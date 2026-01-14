"use strict";

class Rules {
  constructor(expression, options) {
    this.expression = expression;
    this.failureRules = [];
    this.successRules = [];

    this.logger = options?.logger || {
      notice: () => {},
      error: () => {},
      success: () => {},
    };
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

    if (successRules) {
      this.logger.notice(`Running onSuccess Rules`);
    } else {
      this.logger.notice(`Running onFailure Rules`);
    }

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

    this.logger.notice(
      "==================================================================================",
    );

    for (const criteriaObject of rule.criteria) {
      if (criteriaObject?.type) {
        if (criteriaObject.type === "regex") {
          const hasPassedCheck = this.expression.checkRegexExpression(
            criteriaObject.context,
            criteriaObject.condition,
          );

          if (hasPassedCheck) hasPassed.push(true);
        } else {
        }
      } else {
        this.logger.notice(
          `checking ${rule.name} rule: ${criteriaObject.condition} `,
        );
        const hasPassedCheck = this.expression.checkSimpleExpression(
          criteriaObject.condition,
        );

        if (hasPassedCheck) {
          this.logger.success(`${criteriaObject.condition} passed`);
          passedCriteria.push(hasPassedCheck);
        } else {
          this.logger.error(`${criteriaObject.condition} failed`);
        }
      }
    }

    this.logger.notice(
      "==================================================================================",
    );

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
