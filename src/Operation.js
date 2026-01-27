'use strict';

const URLParams = require("openapi-params");
const client = require("openid-client");

const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

class Operation {
  constructor(operation, sourceDescriptionFile, expression, inputs, logger, step) {
    this.sourceDescriptionFile = sourceDescriptionFile;
    this.expression = expression;
    this.inputs = inputs;
    this.logger = logger;
    this.step = step;
    this.operation = operation;
  }

  async runOperation(retryAfter) {
    this.retryAfter = retryAfter;
    this.buildOperation()

    return await this.makeRequest()
  }

  async makeRequest() {
    const sleep = function (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const parseRetryAfter = function (retryAfter) {
      if (!retryAfter || typeof retryAfter !== "string") {
        return null;
      }

      const trimmed = retryAfter.trim();

      // Try parsing as a number (seconds format)
      const asNumber = parseInt(trimmed, 10);
      if (!isNaN(asNumber) && asNumber >= 0 && String(asNumber) === trimmed) {
        return asNumber;
      }

      // Try parsing as HTTP date format
      try {
        const date = new Date(trimmed);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return null;
        }

        // Calculate seconds from now until the date
        const now = new Date();
        const secondsUntil = Math.ceil((date.getTime() - now.getTime()) / 1000);

        // Return the delay, but don't return negative values
        return secondsUntil >= 0 ? secondsUntil : 0;
      } catch (err) {
        return null;
      }
    };

    let url = this.operation.url;

    if (this.operation.queryParams.size) {
      url += `?${this.operation.queryParams}`;
    }

    const options = {
      method: this.operation.method,
      headers: this.operation.headers,
    };

    if (this.operation.data) {
      options.body = this.operation.data;
    }

    if (this.retryAfter) {
      this.logger.notice(
        `retryAfter was set: waiting ${this.retryAfter} seconds`,
      );
      await sleep(this.retryAfter * 1000);
    }

    this.expression.addToContext("url", url);
    this.expression.addToContext("method", options.method);

    this.logger.notice(`Making a ${options.method.toUpperCase()} to ${url}`);

    let response;
    if (this.operation?.mutualTLS) {
      this.logger.verbose("Using mutualTLS call");
      response = await this.mutualTLS();
    } else {
      this.logger.verbose("Using fetch call");

      this.logger.verbose(`request url: ${url}`);
      this.logger.verbose(`request method: ${options.method}`);
      this.logger.verbose("request headers:");
      for (const [key, value] of options.headers.entries()) {
        this.logger.verbose(`${key}: ${value}`);
      }

      this.logger.verbose(`body: ${options.body}`);

      response = await fetch(url, options);
    }

    this.logger.verbose(`received StatusCode: ${response.status}`);
    this.logger.verbose(`received headers:`);
    for (const [key, value] of response.headers.entries()) {
      this.logger.verbose(`${key}: ${value}`);
    }

    if (response.headers.has("retry-after")) {
      const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
      if (retryAfter !== null) {
        this.retryAfter = retryAfter;
      }
    }

    this.addParamsToContext(response.headers, "header", "response");
    this.expression.addToContext("statusCode", response.status);

    this.logger.notice(`${url} responded with a: ${response.status}`);

    await this.dealWithResponse(response);

    return response;
  }

  async mutualTLS() {
    let clientKeyPath;
    try {
      clientKeyPath = path.resolve(this.inputs.key);
      this.logger.verbose(`clientKey Path: ${clientKeyPath}`);
    } catch (err) {
      this.logger.error(`could not resolve clientKey`);
      throw err;
    }

    let clientCertPath;
    try {
      clientCertPath = path.resolve(this.inputs.cert);
      this.logger.verbose(`clientCert Path: ${clientCertPath}`);
    } catch (err) {
      this.logger.error(`could not resolve clientCert`);
      throw err;
    }

    let url = this.operation.url;

    if (this.operation.queryParams.size) {
      url += `?${this.operation.queryParams}`;
    }

    const opUrl = new URL(url);

    this.logger.verbose(`url: ${opUrl.pathname + opUrl.search}`);
    this.logger.verbose(`method: ${this.operation.method}`);
    this.logger.verbose("headers:");
    const headersObj = {};
    for (const [key, value] of this.operation.headers.entries()) {
      this.logger.verbose(`${key}: ${value}`);
      Object.assign(headersObj, { [key]: value });
    }

    this.logger.verbose(`body: ${this.operation.data}`);

    return new Promise((resolve, reject) => {
      const options = {
        key: fs.readFileSync(clientKeyPath),
        cert: fs.readFileSync(clientCertPath),
        method: this.operation.method,
        headers: headersObj,
        rejectUnauthorized: true,
        hostname: opUrl.hostname,
        path: opUrl.pathname + opUrl.search,
      };

      if (this.operation.data) {
        options.headers = options.headers || {};
        if (!options.headers["content-length"]) {
          const bodyBuffer = Buffer.from(
            typeof this.operation.data === "string"
              ? this.operation.data
              : JSON.stringify(this.operation.data),
          );
          options.headers["content-length"] = bodyBuffer.length;
        }
      }

      const headers = new Headers();
      const chunks = [];

      const req = https.request(options, (res) => {
        for (const [name, value] of Object.entries(res.headers)) {
          headers.append(name, value);
        }

        // Collect data chunks as buffers for proper encoding
        res.on("data", (chunk) => chunks.push(chunk));

        res.on("end", () => {
          // Concatenate buffers and decode based on content-type
          const buffer = Buffer.concat(chunks);
          let body;

          const contentType = res.headers["content-type"] || "";

          if (contentType.includes("application/json")) {
            try {
              body = JSON.parse(buffer.toString("utf8"));
            } catch (err) {
              body = buffer.toString("utf8");
            }
          } else {
            body = buffer.toString("utf8");
          }

          const response = new Response(buffer, {
            status: res.status,
            statusText: res.statusMessage,
            headers,
          });
          // resolve({
          //   headers: headers,
          //   body: body,

          //   status: res.statusCode,
          //   statusText: res.statusMessage,
          //   ok: res.statusCode >= 200 && res.statusCode < 300,
          // });
          resolve(response);
        });
      });

      req.on("error", (err) => {
        this.logger.error(`mTLS Error: ${err.message}`);
        reject(new Error(`mTLS request failed: ${err.message}`));
      });

      // Write request body if present
      if (this.operation.data) {
        const body =
          typeof this.operation.data === "string"
            ? this.operation.data
            : JSON.stringify(this.operation.data);
        req.write(body);
      }

      req.end();
    });
  }

  async dealWithResponse(response) {
    if (
      response.headers.has("Content-Type") &&
      response.headers.get("Content-Type") === "application/json"
    ) {
      const json = await response?.json().catch((err) => {
        this.logger.error(
          `Error trying to resolve ${this.step.stepId} outputs`,
        );
        throw new Error(err);
      });

      this.expression.addToContext("response.body", json);
    } else {
      const body = await response.body;

      this.expression.addToContext("response.body", body);
    }
  }

  buildOperation() {
    if (Object.keys(this.sourceDescriptionFile.securitySchemes).length === 1) {
      for (const [key, value] of Object.entries(
        this.sourceDescriptionFile.securitySchemes,
      )) {
        if (value.type.toLowerCase() === "mutualtls")
          this.operation.mutualTLS = true;
      }
    }

    this.mapInputs()
  }

  mapInputs() {
    this.mapParameters();
    this.encodeRequestBody();

    this.addParamsToContext(this.operation.headers, "headers", "request");
    this.addParamsToContext(this.operation.queryParams, "query", "request");
  }

  mapParameters() {
    const headersObj = new Headers();
    const headers = new URLParams();
    const queryParams = new URLParams();
    const pathParams = new URLParams();

    for (const param of this.step?.parameters || []) {
      const operationDetailParam =
        this.sourceDescriptionFile.operationDetails?.parameters
          .filter((obj) => obj.name === param.name && obj.in === param.in)
          .at(0);

      let value = this.expression.resolveExpression(param.value);

      switch (param.in) {
        case "header":
          let headerStyle = "simple";
          let headerExplode = false;

          if (
            operationDetailParam?.style &&
            ["accept", "authorization", "content-type"].includes(
              operationDetailParam.name.toLowerCase() === false,
            )
          ) {
            headerStyle = operationDetailParam.style;
          }

          if (
            operationDetailParam?.explode &&
            ["accept", "authorization", "content-type"].includes(
              operationDetailParam.name.toLowerCase() === false,
            )
          ) {
            headerExplode = operationDetailParam.explode;
          }

          if (this.operation.security) {
            // console.log(this.operation.security);
            for (const key in this.sourceDescriptionFile.securitySchemes) {
              if (
                this.sourceDescriptionFile.securitySchemes[key].type ===
                "http" &&
                param.name === key
              ) {
                if (
                  this.sourceDescriptionFile.securitySchemes[
                    key
                  ].scheme.toLowerCase() === "bearer"
                ) {
                  value = `Bearer ${value}`;
                } else {
                  const basicPass = Buffer.from(
                    this.expression.resolveExpression(value),
                  ).toString("base64");
                  value = `Basic ${basicPass}`;
                }
              }
            }

            // const authSchemaName = Object.keys(
            //   this.operation.security.at(0),
            // ).at(0);

            // const securityScheme =
            //   this.sourceDescriptionFile.securitySchemes[authSchemaName];
            // console.log(securityScheme);

            // if (
            //   securityScheme.type === "http" &&
            //   securityScheme?.scheme?.toLowerCase() === "bearer"
            // ) {
            //   value = `Bearer ${value}`;
            // } else if (
            //   securityScheme.type === "http" &&
            //   securityScheme?.scheme?.toLowerCase() === "basic"
            // ) {
            //   const basicPass = Buffer.from(
            //     this.expression.resolveExpression(value),
            //   ).toString("base64");
            //   value = `Basic ${basicPass}`;
            // }
          }

          headers.append(param.name, value, {
            style: headerStyle,
            explode: headerExplode,
          });

          for (const [header, value] of headers) {
            if (header === param.name) {
              headersObj.append(param.name, value);
            }
          }

          break;

        case "path":
          const pathStyle = operationDetailParam?.style || "simple";
          const pathExplode = operationDetailParam?.explode || false;

          pathParams.append(param.name, value, {
            style: pathStyle,
            explode: pathExplode,
          });


          for (const [name, value] of pathParams.entries()) {
            this.operation.url = this.operation.url.replace(`{${name}}`, value);
          }


          break;

        case "query":
          // queryParams.append(param.name, value);
          const style = operationDetailParam?.style || "form";
          let explode = false;
          if (Object.hasOwn(operationDetailParam, "explode")) {
            explode = operationDetailParam.explode;
          } else {
            if (style === "form") {
              explode = true;
            }
          }
          // const explode = operationDetailParam?.explode || false;
          queryParams.append(param.name, value, {
            style: style,
            explode: explode,
          });
          break;
      }
    }

    this.addParamsToContext(pathParams, "path", "request");

    this.operation.headers = headersObj;
    this.operation.queryParams = queryParams;
  }

  addParamsToContext(params, paramType, contextType) {
    const parameters = {};
    for (const [key, value] of params.entries()) {
      Object.assign(parameters, { [key]: value });
    }

    this.expression.addToContext(contextType, { [paramType]: parameters });
  }

  /**
 * Encode request body based on Content-Type
 * Returns { body } with properly encoded body and headers
 *
 * @param {*} data - The data to encode
 * @param {string} contentType - The Content-Type header value
 * @param {Headers} headers - Existing headers object (will be modified)
 * @returns {{body: *, headers: Headers}} Encoded body and updated headers
 */
  encodeRequestBody() {
    if (this.step?.requestBody) {
      const payload = this.expression.resolveExpression(
        this.step.requestBody.payload,
      );

      if (payload === null || payload === undefined) {
        return { body: null };
      }

      // Normalize content type (remove charset, parameters)
      // const normalizedType = contentType.split(';')[0].trim().toLowerCase();
      let normalizedType
      if (this.step.requestBody.contentType) {
        normalizedType = this.step.requestBody.contentType.split(';')[0].trim().toLowerCase();
      }

      switch (normalizedType) {
        case 'application/json':
          this.encodeJSON(payload);
          break;

        case 'application/x-www-form-urlencoded':
          this.encodeFormURLEncoded(payload);
          break;

        case 'multipart/form-data':
          this.encodeMultipartFormData(payload);
          break;

        case 'text/plain':
          this.encodeTextPlain(payload);
          break;

        case 'text/xml':
        case 'application/xml':
          this.encodeXML(payload, normalizedType);
          break;

        case 'text/html':
          this.encodeHTML(payload);
          break;

        case 'application/octet-stream':
          this.encodeBinary(payload);
          break;

        default:
          // For unknown types, try JSON if it's an object, otherwise text
          if (typeof payload === 'object' && !(payload instanceof Blob) && !(payload instanceof ArrayBuffer)) {
            this.encodeJSON(payload);
          }
          this.encodeTextPlain(payload);
          break;
      }
    }
  }

  /**
 * Encode as JSON
 */
  encodeJSON(data) {
    this.operation.data = typeof data === 'string' ? data : JSON.stringify(data);
    this.operation.headers.set('Content-Type', 'application/json');
    this.operation.headers.set('Content-Length', String(Buffer.byteLength(this.operation.data, 'utf8')));
  }

  /**
   * Encode as application/x-www-form-urlencoded
   */
  encodeFormURLEncoded(data) {
    let body;

    if (typeof data === 'string') {
      body = data;
    } else if (data instanceof URLSearchParams) {
      body = data.toString();
    } else if (typeof data === 'object') {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
      body = params.toString();
    } else {
      body = String(data);
    }

    this.operation.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.operation.headers.set('Content-Length', String(Buffer.byteLength(body, 'utf8')));
    this.operation.data = body;
  }

  /**
   * Encode as multipart/form-data
   */
  encodeMultipartFormData(data) {
    const formData = new FormData();

    if (data instanceof FormData) {
      this.operation.data = data; // Let fetch handle the boundary
      return;
    }

    if (typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (value instanceof Blob || value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else {
          formData.append(key, String(value));
        }
      }
    }

    // Do NOT set Content-Type - let fetch set it with the boundary
    // headers.set('Content-Type', 'multipart/form-data'); // WRONG!
    this.operation.headers.delete('Content-Type'); // Let fetch handle it

    this.operation.data = formData;
  }

  /**
   * Encode as plain text
   */
  encodeTextPlain(data) {
    const body = typeof data === 'string' ? data : String(data);
    this.operation.headers.set('Content-Type', 'text/plain; charset=utf-8');
    this.operation.headers.set('Content-Length', String(Buffer.byteLength(body, 'utf8')));
    this.operation.data = body;
  }

  /**
   * Encode as XML
   */
  encodeXML(data, contentType) {
    let body;

    if (typeof data === 'string') {
      body = data;
    } else if (typeof data === 'object') {
      // Simple object to XML conversion
      body = this.objectToXML(data);
    } else {
      body = String(data);
    }

    this.operation.headers.set('Content-Type', `${contentType}; charset=utf-8`);
    this.operation.headers.set('Content-Length', String(Buffer.byteLength(body, 'utf8')));
    this.operation.data = body;
  }

  /**
   * Encode as HTML
   */
  encodeHTML(data) {
    const body = typeof data === 'string' ? data : String(data);
    this.operation.headers.set('Content-Type', 'text/html; charset=utf-8');
    this.operation.headers.set('Content-Length', String(Buffer.byteLength(body, 'utf8')));
    this.operation.data = body;
  }

  /**
   * Encode as binary (octet-stream)
   */
  encodeBinary(data) {
    let body;

    if (data instanceof Blob || data instanceof ArrayBuffer || Buffer.isBuffer(data)) {
      body = data;
    } else if (typeof data === 'string') {
      body = Buffer.from(data);
    } else {
      body = Buffer.from(JSON.stringify(data));
    }

    this.operation.headers.set('Content-Type', 'application/octet-stream');

    if (Buffer.isBuffer(body)) {
      this.operation.headers.set('Content-Length', String(body.length));
    }

    this.operation.data = body;
  }

  /**
   * Simple object to XML converter
   */
  objectToXML(obj, rootName = 'root') {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';

    function buildXML(data, tagName) {
      if (data === null || data === undefined) {
        return `<${tagName}/>`;
      }

      if (typeof data === 'object' && !Array.isArray(data)) {
        let result = `<${tagName}>`;
        for (const [key, value] of Object.entries(data)) {
          result += buildXML(value, key);
        }
        result += `</${tagName}>`;
        return result;
      }

      if (Array.isArray(data)) {
        return data.map(item => buildXML(item, tagName)).join('');
      }

      // Escape XML special characters
      const escaped = String(data)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      return `<${tagName}>${escaped}</${tagName}>`;
    }

    xml += buildXML(obj, rootName);
    return xml;
  }
}

module.exports = Operation
