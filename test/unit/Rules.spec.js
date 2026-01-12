"use strict";

const expect = require("chai").expect;

const Expression = require("../../src/Expression");

const Rules = require("../../src/Rules");

describe(`Rules`, function () {
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

  describe(`setWorkflowFailures`, function () {
    it(`should take a list of Workflow Failure Actions`, function () {
      const rules = new Rules();

      const onFailures = [
        {
          name: "404Failure",
          type: "end",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setWorkflowFailures(onFailures);

      expect(rules).to.have.property("workflowFailures");
      expect(rules.workflowFailures).to.be.an("array");
      expect(rules.workflowFailures).to.have.lengthOf(1);
      expect(rules.failureRules).to.be.an("array");
      expect(rules.failureRules).to.have.lengthOf(1);
    });
  });

  describe(`setStepFailures`, function () {
    it(`should take a list of Step Failure Actions and combine with Workflow Failure Actions`, function () {
      const rules = new Rules();

      const workflowOnFailures = [
        {
          name: "404Failure",
          type: "end",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setWorkflowFailures(workflowOnFailures);

      const stepOnFailures = [
        {
          name: "404Failure",
          type: "end",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setStepFailures(stepOnFailures);

      expect(rules).to.have.property("workflowFailures");
      expect(rules).to.have.property("stepFailures");
      expect(rules.workflowFailures).to.be.an("array");
      expect(rules.workflowFailures).to.have.lengthOf(1);
      expect(rules.stepFailures).to.be.an("array");
      expect(rules.stepFailures).to.have.lengthOf(1);
      expect(rules.failureRules).to.be.an("array");
      expect(rules.failureRules).to.have.lengthOf(2);
    });
  });

  describe(`setWorkflowSuccess`, function () {
    it(`should take a list of Workflow Success Actions`, function () {
      const rules = new Rules();

      const onSuccess = [
        {
          name: "200Success",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setWorkflowSuccess(onSuccess);

      expect(rules).to.have.property("workflowSuccesses");
      expect(rules.workflowSuccesses).to.be.an("array");
      expect(rules.workflowSuccesses).to.have.lengthOf(1);
      expect(rules.successRules).to.be.an("array");
      expect(rules.successRules).to.have.lengthOf(1);
    });
  });

  describe(`setStepSuccess`, function () {
    it(`should take a list of Step Success Actions and combine with Workflow Success Actions`, function () {
      const rules = new Rules();

      const workflowOnSuccesses = [
        {
          name: "200Success",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setWorkflowSuccess(workflowOnSuccesses);

      const stepOnSuccesses = [
        {
          name: "200Success",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setStepSuccesses(stepOnSuccesses);

      expect(rules).to.have.property("workflowSuccesses");
      expect(rules).to.have.property("stepSuccesses");
      expect(rules.workflowSuccesses).to.be.an("array");
      expect(rules.workflowSuccesses).to.have.lengthOf(1);
      expect(rules.stepSuccesses).to.be.an("array");
      expect(rules.stepSuccesses).to.have.lengthOf(1);
      expect(rules.successRules).to.be.an("array");
      expect(rules.successRules).to.have.lengthOf(2);
    });
  });

  describe(`runRules`, function () {
    describe(`run rules for a success`, function () {
      describe(`no matches`, function () {
        it(`returns an empty object when there are no rules to run`, function () {
          const expression = new Expression();
          const rules = new Rules(expression);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });

        it(`returns an empty object when there are no matches to successRules`, function () {
          const expression = new Expression();
          const rules = new Rules(expression);

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
              criteria: [{ condition: "$statusCode == 200" }],
            },
          ];

          rules.setStepSuccesses(stepOnSuccesses);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });

        it(`returns an empty object when there are no matches to successRules but partial criteria checks`, function () {
          const expression = new Expression();
          const rules = new Rules(expression);

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

          rules.setStepSuccesses(stepOnSuccesses);

          expression.addToContext("statusCode", 200);

          expression.addToContext("response.header", { "x-amz-tkn": "abc" });

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });

        it(`returns an empty object when none of the successRules have criteria`, function () {
          const expression = new Expression();
          const rules = new Rules(expression);

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
            },
          ];

          rules.setStepSuccesses(stepOnSuccesses);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(Object.keys(expected)).to.have.lengthOf(0);
        });
      });

      describe(`matches a rule of type end`, function () {
        it(`returns an object telling the workflow to end when there are matches to successRule with an end type`, function () {
          const expression = new Expression();
          const rules = new Rules(expression);

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "end",
              criteria: [{ condition: "$statusCode == 200" }],
            },
          ];

          rules.setStepSuccesses(stepOnSuccesses);

          expression.addToContext("statusCode", 200);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({ endWorkflow: true });
        });
      });

      describe(`matches a rule of type goto`, function () {
        it(`returns an object telling the workflow to end when there are matches to successRule with a goto type`, function () {
          const expression = new Expression();
          const rules = new Rules(expression);

          const stepOnSuccesses = [
            {
              name: "200Success",
              type: "goto",
              stepId: "stepTwo",
              criteria: [{ condition: "$statusCode == 201" }],
            },
          ];

          rules.setStepSuccesses(stepOnSuccesses);

          expression.addToContext("statusCode", 201);

          const expected = rules.runRules(true);

          expect(expected).to.be.an("object");
          expect(expected).to.be.eql({ goto: true, stepId: "stepTwo" });
        });
      });
    });
  });

  describe(`buildFailureRules`, function () {
    it(`reverses the rules, so step rules are first and workflow rules are last`, function () {
      const rules = new Rules();

      const workflowOnFailures = [
        {
          name: "404Failure",
          type: "end",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setWorkflowFailures(workflowOnFailures);

      const stepOnFailures = [
        {
          name: "404Failure",
          type: "goto",
          criteria: [{ condition: "$statusCode == 404" }],
        },
      ];

      rules.setStepFailures(stepOnFailures);

      rules.buildFailureRules();

      expect(rules.rules.at(0)).to.be.eql({
        name: "404Failure",
        type: "goto",
        criteria: [{ condition: "$statusCode == 404" }],
      });
    });
  });

  describe(`buildSuccessRules`, function () {
    it(`reverses the rules, so step rules are first and workflow rules are last`, function () {
      const rules = new Rules();

      const workflowOnSuccesses = [
        {
          name: "200Success",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setWorkflowSuccess(workflowOnSuccesses);

      const stepOnSuccesses = [
        {
          name: "200Success",
          type: "end",
          criteria: [{ condition: "$statusCode == 200" }],
        },
      ];

      rules.setStepSuccesses(stepOnSuccesses);

      rules.buildFailureRules();

      expect(rules.successRules.at(0)).to.be.eql({
        name: "200Success",
        type: "end",
        criteria: [{ condition: "$statusCode == 200" }],
      });
    });
  });
});
