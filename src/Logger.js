"use strict";

class Logger {
  constructor() {
    this.logOutput = {
      notice: () => console.log,
      error: () => console.error,
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
    this.log(str, this.logTypes.VERBOSE);
  }

  warning(str) {
    this.log(str, this.logTypes.WARNING);
  }
}

module.exports = Logger;
