"use strict";

class Rules {
  constructor(expression) {
    this.expression = expression;
    this.failureRules = [];
    this.successRules = [];
  }

  setWorkflowFailures(failureActions) {
    this.workflowFailures = failureActions;
    this.failureRules.push(...failureActions);
  }

  setStepFailures(failureActions) {
    this.stepFailures = failureActions;
    this.failureRules.push(...failureActions);
  }

  setWorkflowSuccess(successActions) {
    this.workflowSuccesses = successActions;
    this.successRules.push(...successActions);
  }

  setStepSuccesses(successActions) {
    this.stepSuccesses = successActions;
    this.successRules.push(...successActions);
  }

  runRules(successRules = false) {
    if (successRules) {
      this.buildSuccessRules();
    } else {
      this.buildFailureRules();
    }

    const obj = {};

    for (const rule of this.rules) {
      if (rule.criteria) {
        const passedCriteria = this.criteriaChecks(rule);

        if (passedCriteria.length === rule.criteria.length) {
          if (rule.type === "end") {
            obj.endWorkflow = true;
            break;
          } else if (rule.type === "goto") {
            obj.goto = true;
            if (rule.stepId) obj.stepId = rule.stepId;
            else obj.workflowId = rule.workflowId;
          } else {
            obj.name = rule.name;
            obj.retry = true;
            if (rule.stepId) obj.stepId = rule.stepId;
            if (rule.workflowId) obj.workflowId = rule.workflowId;
            obj.retryLimit = rule?.retryLimit || 1;
            if (rule.retryAfter) obj.retryAfter = rule.retryAfter;
          }
        }
      }
    }

    return obj;
  }

  criteriaChecks(rule) {
    const passedCriteria = [];

    for (const criteriaObject of rule.criteria) {
      if (criteriaObject?.type) {
      } else {
        const hasPassedCheck = this.expression.checkSimpleExpression(
          criteriaObject.condition,
        );
        // console.log(criteriaObject.condition);
        if (hasPassedCheck) passedCriteria.push(hasPassedCheck);
      }
    }

    return passedCriteria;
  }

  buildFailureRules() {
    this.failureRules.reverse();
    this.rules = this.failureRules;
  }

  buildSuccessRules() {
    this.successRules.reverse();
    this.rules = this.successRules;
  }
}

module.exports = Rules;
