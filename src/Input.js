"use strict";

const Ajv = require("ajv");

const path = require("node:path");

const Document = require("./Document");

class Input extends Document {
  /**
   *
   * @param {string} filePath The Path to the Input File
   * @param {string} name
   */
  constructor(filePath, name) {
    super(filePath, name, {});

    this.type = "input";

    this.filePath = path.resolve(filePath);

    this.ajv = new Ajv();
  }

  async getWorkflowInputs(workflowId, schema) {
    const pipeline = this.JSONPicker(workflowId, this.filePath);

    for await (const { value } of pipeline) {
      this.validateInputs(value, schema);
      this.inputs = value;
    }

    return this.inputs;
  }

  validateInputs(value, schema) {
    const validate = this.ajv.compile(schema);

    const valid = validate(value);

    if (!valid) {
      throw new Error("Input values do not match Input schema", {
        cause: validate.errors,
      });
    }
  }
}

module.exports = Input;
