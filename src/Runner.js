"use strict";

const docFactory = require("./DocFactory");
const Input = require("./Input");

const Logger = require("./Logger");

class Runner {
  constructor(logger) {
    this.logger = logger || new Logger();
  }

  /**
   * Run an Arazzo Document
   * @function runArazzo
   * @public
   */
  async runArazzo(arazzoUrl, inputFilePath) {
    const inputFile = new Input(inputFilePath, "inputs");

    const arazzo = await docFactory.buildDocument(
      "arazzo",
      arazzoUrl,
      "arazzo",
      { logger: this.logger },
    );

    if (!this.isUrl(arazzoUrl)) {
      arazzo.setMainArazzo();
    }

    await arazzo.runWorkflows(inputFile);
  }

  /**
   * Tests whether a string is a URL or not
   * @private
   * @param {string} str
   * @returns
   */
  isUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = Runner;
