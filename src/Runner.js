"use strict";

const docFactory = require("./DocFactory");
const Input = require("./Input");

const Logger = require("./Logger");

const path = require("node:path");

class Runner {
  constructor(options, logger) {
    const verboseLogging = options?.verbose || false;
    this.logger = logger || new Logger(verboseLogging);

    try {
      this.logger.verbose(
        `Loading config from ${path.resolve("./options", "config")}`,
      );

      this.config = require(path.resolve("./options", "config.js"));
    } catch (err) {
      this.logger.verbose("No config found");
      this.config = {};
    }
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
      { logger: this.logger, config: this.config },
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
