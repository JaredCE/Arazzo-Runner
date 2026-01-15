"use strict";

const expect = require("chai").expect;

const Expression = require("../../src/Expression");
const Logger = require("../../src/Logger.js");

const Rules = require("../../src/Rules");

describe(`Rules`, function () {
  const logger = new Logger();

  describe(`constructor`, function () {
    it(`returns an instance of Rules`, function () {
      const expression = new Expression();

      const expected = new Rules(expression);

      expect(expected).to.be.an.instanceOf(Rules);
      expect(expected.failureRules).to.be.an("array");
      expect(expected.failureRules).to.have.lengthOf(0);
      expect(expected.successRules).to.be.an("array");
      expect(expected.successRules).to.have.lengthOf(0);
    });
  });

  describe(`setFailureRules`, function () {
    it(`should take a list of Failure Actions`, function () {
      const rules = new Rules();

      const onFailures = [
        {
          name: "404Failure",
          type: "end",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setFailureRules(onFailures);

      expect(rules).to.have.property("failureRules");
      expect(rules.failureRules).to.be.an("array");
      expect(rules.failureRules).to.have.lengthOf(1);
    });
  });

  describe(`setSuccessRules`, function () {
    it(`should take a list of Success Actions`, function () {
      const rules = new Rules();

      const onSuccess = [
        {
          name: "200End",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setSuccessRules(onSuccess);

      expect(rules).to.have.property("successRules");
      expect(rules.successRules).to.be.an("array");
      expect(rules.successRules).to.have.lengthOf(1);
    });
  });

  describe(`combineRules`, function () {
    it(`takes an instance of a Rules object and appends the failure Rules to the current failureRules array`, function () {
      const rules = new Rules();

      const onFailures = [
        {
          name: "404Failure",
          type: "end",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setFailureRules(onFailures);

      const rules2 = new Rules();

      const onFailures2 = [
        {
          name: "404goto",
          type: "goto",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules2.setFailureRules(onFailures2);

      rules2.combineRules(rules);

      expect(rules2).to.have.property("failureRules");
      expect(rules2.failureRules).to.be.an("array");
      expect(rules2.failureRules).to.have.lengthOf(2);
      expect(rules2.failureRules.at(1)).to.be.eql({
        name: "404Failure",
        type: "end",
        criteria: [{ condition: "$statusCode == 404" }],
      });
    });

    it(`takes an instance of a Rules object and appends the success Rules to the current successRules array`, function () {
      const rules = new Rules();

      const onSuccess = [
        {
          name: "200End",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setSuccessRules(onSuccess);

      const rules2 = new Rules();

      const onSuccess2 = [
        {
          name: "200goto",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules2.setSuccessRules(onSuccess2);

      rules2.combineRules(rules);

      expect(rules2).to.have.property("successRules");
      expect(rules2.successRules).to.be.an("array");
      expect(rules2.successRules).to.have.lengthOf(2);
      expect(rules2.successRules.at(1)).to.be.eql({
        name: "200End",
        type: "end",
        criteria: [{ condition: "$statusCode == 200" }],
      });
    });
  });

  describe(`runRules`, function () {
    describe(`run rules for a success`, function () {
      describe(`no matches`, function () {
        it(`returns an empty object when there are no rules to run`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });

        it(`returns an empty object when there are no matches to successRules`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
              criteria: [{ condition: "$statusCode == 200" }],
            },
          ];

          rules.setSuccessRules(stepOnSuccesses);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });

        it(`returns an empty object when there are no matches to successRules but partial criteria checks`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
              criteria: [{ condition: "$statusCode == 201" }],
            },
            {
              name: "Success",
              type: "end",
              criteria: [
                { condition: "$statusCode == 200" },
                { condition: '$response.header.x-amz-tkn == "abc123"' },
              ],
            },
          ];

          rules.setSuccessRules(stepOnSuccesses);

          expression.addToContext("statusCode", 200);

          expression.addToContext("response.header", { "x-amz-tkn": "abc" });

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });

        it(`returns an empty object when none of the successRules have criteria`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
            },
          ];

          rules.setSuccessRules(stepOnSuccesses);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });
      });

      describe(`matches a rule of type end`, function () {
        it(`returns an object telling the workflow to end when there are matches to successRule with an end type`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
              criteria: [{ condition: "$statusCode == 200" }],
            },
          ];

          rules.setSuccessRules(stepOnSuccesses);

          expression.addToContext("statusCode", 200);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({ endWorkflow: true });
        });
      });

      describe(`matches a rule of type goto`, function () {
        it(`returns an object telling the workflow to end when there are matches to successRule with a goto type`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "goto",
              stepId: "stepTwo",
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setSuccessRules(stepOnSuccesses);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({ goto: true, stepId: "stepTwo" });
        });
      });

      describe(`matches a rule of type retry`, function () {
        it(`returns an object telling the step to retry once when no retryLimit is set`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnFailures = [
            {
              name: "201Retry",
              type: "retry",
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setFailureRules(stepOnFailures);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules();

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({
            retry: true,
            name: "201Retry",
            retryLimit: 1,
          });
        });

        it(`returns an object telling the step to retry three times when retryLimit is set to 3`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnFailures = [
            {
              name: "201Retry",
              type: "retry",
              retryLimit: 3,
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setFailureRules(stepOnFailures);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules();

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({
            retry: true,
            name: "201Retry",
            retryLimit: 3,
          });
        });

        it(`returns an object telling the step to retry with a delay of 30 when retryAfter is set to 30`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnFailures = [
            {
              name: "201Retry",
              type: "retry",
              retryAfter: 30,
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setFailureRules(stepOnFailures);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules();

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({
            retry: true,
            name: "201Retry",
            retryLimit: 1,
            retryAfter: 30,
          });
        });

        it(`returns an object telling the step to retry a different stepId before retrying the current step`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnFailures = [
            {
              name: "201Retry",
              type: "retry",
              stepId: "stepTwo",
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setFailureRules(stepOnFailures);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules();

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({
            retry: true,
            stepId: "stepTwo",
            name: "201Retry",
            retryLimit: 1,
          });
        });

        it(`returns an object telling the step to retry a workflow before retrying the current step`, function () {
          const expression = new Expression();
          const rules = new Rules(expression, { logger });

          const stepOnFailures = [
            {
              name: "201Retry",
              type: "retry",
              workflowId: "workflowOne",
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setFailureRules(stepOnFailures);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules();

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({
            retry: true,
            workflowId: "workflowOne",
            name: "201Retry",
            retryLimit: 1,
          });
        });
      });
    });
  });
});
