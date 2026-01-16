"use strict";

const { substitute, parse } = require("openapi-server-url-templating");

const Document = require("./Document");

class OpenAPI extends Document {
  constructor(url, name, options) {
    super(url, name, options);

    this.type = "openapi";
  }

  async getOperationById(operationId) {
    const pipeline = await this.JSONPicker("paths", this.filePath);

    for await (const { value } of pipeline) {
      for (let key in value) {
        for (let operation in value[key]) {
          if (value[key][operation]?.operationId === operationId) {
            this.path = key;
            this.method = operation;
            this.operationDetails = value[key][operation];
            this.pathServers = value[key]?.["servers"] || [];
          }
        }
      }
    }

    if (this.path === undefined) {
      throw new Error(`The OperationId: ${operationId} does not exist`);
    }
  }

  async buildOperation(inputs, step) {
    if (!this.pathServers.length && !this.operationDetails?.servers?.length) {
      await this.getServers();
    } else {
      if (this.operationDetails.servers) {
        this.servers = this.operationDetails.servers;
      } else {
        this.servers = this.pathServers;
      }
    }

    this.buildOperations();

    return this.operation;
  }

  async getServers() {
    const pipeline = await this.JSONPicker("servers", this.filePath);

    for await (const { value } of pipeline) {
      this.servers = value;
    }
  }

  async getSecurity() {
    const pipeline = await this.JSONPicker("security", this.filePath);

    for await (const { value } of pipeline) {
      if (value) this.security = value;
    }

    if (this.security) {
      const componentPipeline = await this.JSONPicker(
        "components",
        this.filePath,
      );
      for await (const { value } of componentPipeline) {
        if (value.securitySchemes) {
          console.log(value.securitySchemes);
        }
      }
    }
  }

  parseServer() {
    const server = this.servers.at(0);

    if (server.variables) {
      const parseResult = parse(server.url);
      const parts = [];

      parseResult.ast.translate(parts);

      for (const partType of parts) {
        const [type, value] = partType;

        if (type === "server-variable-name") {
          const replacementValueData = server.variables[value];
          if (replacementValueData.default) {
            server.url = server.url.replace(
              `{${value}}`,
              replacementValueData.default,
            );
          }
        }
      }
    }

    return server;
  }

  buildOperations() {
    this.operation = {};

    const server = this.parseServer();

    Object.assign(this.operation, {
      url: `${server.url}${this.path}`,
      method: this.method,
    });
  }
}

module.exports = OpenAPI;
