"use strict";

class Logger {
  constructor(verboseLogging) {
    this.verboseLogging = verboseLogging || false;
    this.logOutput = {
      debug: (message) => console.debug(message),
      error: (message) => console.error(`❌ ${message}`),
      info: (message) => console.info(message),
      notice: (message) => console.log(message),
      success: (message) => console.log(`✅ ${message}`),
      verbose: (message) => console.log(message),
      warning: (message) => console.warn(message),
    };

    this.logTypes = {
      NOTICE: "notice",
      DEBUG: "debug",
      ERROR: "error",
      WARNING: "warning",
      INFO: "info",
      VERBOSE: "verbose",
      SUCCESS: "success",
    };

    this.defaultLog = this.logTypes.NOTICE;
  }

  log(str, type = this.defaultLog) {
    this.logOutput[type](str);
  }

  debug(str) {
    this.log(str, this.logTypes.DEBUG);
  }

  error(str) {
    this.log(str, this.logTypes.ERROR);
  }

  info(str) {
    this.log(str, this.logTypes.INFO);
  }

  notice(str) {
    this.log(str, this.logTypes.NOTICE);
  }

  success(str) {
    this.log(str, this.logTypes.SUCCESS);
  }

  verbose(str) {
    if (this.verboseLogging) this.log(str, this.logTypes.VERBOSE);
  }

  warning(str) {
    this.log(str, this.logTypes.WARNING);
  }
}

module.exports = Logger;
