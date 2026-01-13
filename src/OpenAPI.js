"use strict";

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
            this.operation = operation;
            this.operationDetails = value[key][operation];
          }
        }
      }
    }

    if (this.path === undefined) {
      throw new Error(`The OperationId: ${operationId} does not exist`);
    }
  }

  async buildOperation(inputs, step) {
    await this.getServers();

    this.buildOperations();

    return this.operations;
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

  buildOperations() {
    this.operations = [];

    for (const server of this.servers) {
      this.operations.push({
        url: `${server.url}${this.path}`,
        operation: this.operation,
      });
    }
  }
}

module.exports = OpenAPI;
