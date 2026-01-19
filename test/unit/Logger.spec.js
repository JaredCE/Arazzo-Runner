"use strict";

const expect = require("chai").expect;
const sinon = require("sinon");

const Logger = require("../../src/Logger");

describe(`Logger`, function () {
  describe(`debug`, function () {
    it(`should output the expected string`, function () {
      const logger = new Logger();

      logger.debug("The expected string");
    });
  });

  describe(`error`, function () {
    it(`should output the expected string`, function () {
      const logger = new Logger();

      logger.error("The expected string");
    });
  });

  describe(`info`, function () {
    it(`should output the expected string`, function () {
      const logger = new Logger();

      logger.info("The expected string");
    });
  });

  describe(`notice`, function () {
    it(`should output the expected string`, function () {
      const logger = new Logger();

      logger.notice("The expected string");
    });
  });

  describe(`success`, function () {
    it(`should output the expected string`, function () {
      const logger = new Logger();

      logger.success("The expected string");
    });
  });

  describe(`verbose`, function () {
    it(`should output the expected string when verboseLogging is true`, function () {
      const logger = new Logger(true);

      const spy = sinon.spy(logger, "log");

      logger.verbose("The expected string");

      expect(spy.callCount).to.be.equal(1);

      spy.restore();
    });

    it(`should output the expected string when verboseLogging is false`, function () {
      const logger = new Logger(false);

      const spy = sinon.spy(logger, "log");

      logger.verbose("The expected string");

      expect(spy.callCount).to.be.equal(0);

      spy.restore();
    });

    it(`should output the expected string when verboseLogging is undefined`, function () {
      const logger = new Logger();

      const spy = sinon.spy(logger, "log");

      logger.verbose("The expected string");

      expect(spy.callCount).to.be.equal(0);

      spy.restore();
    });
  });

  describe(`warning`, function () {
    it(`should output the expected string`, function () {
      const logger = new Logger();

      logger.warning("The expected string");
    });
  });
});
