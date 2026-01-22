"use strict";

/**
 * @typedef {Object} criteriaType
 * @property {('simple'|'regex'|'jsonpath'|'xpath')} type - REQUIRED. The type of condition to be applied. The options allowed are jsonpath or xpath.
 * @property {string=} version - REQUIRED. A short hand string representing the version of the expression type being used. The allowed values for JSONPath are draft-goessner-dispatch-jsonpath-00. The allowed values for XPath are xpath-30, xpath-20, or xpath-10.
 */

/**
 * @typedef {Object} criteria
 * @property {string} context - A Runtime Expression used to set the context for the condition to be applied on. If type is specified, then the context MUST be provided (e.g. $response.body would set the context that a JSONPath query expression could be applied to).
 * @property {string} condition - REQUIRED. The condition to apply. Conditions can be simple (e.g. $statusCode == 200 which applies an operator on a value obtained from a runtime expression), or a regex, or a JSONPath expression. For regex or JSONPath, the type and context MUST be specified.
 * @property {criteriaType} type - The type of condition to be applied. If specified, the options allowed are simple, regex, jsonpath or xpath. If omitted, then the condition is assumed to be simple, which at most combines literals, operators and Runtime Expressions. If jsonpath, then the expression MUST conform to JSONPath. If xpath the expression MUST conform to XML Path Language 3.1. Should other variants of JSONPath or XPath be required, then a Criterion Expression Type Object MUST be specified.
 */

/**
 * @typedef {Object} failureActionsObject
 * @property {string} name - REQUIRED. The name of the failure action. Names are case sensitive.
 * @property {string} type - REQUIRED. The type of action to take. Possible values are "end", "retry", or "goto".
 * @property {string=} workflowId - The workflowId referencing an existing workflow within the Arazzo Description to transfer to upon failure of the step. This field is only relevant when the type field value is "goto" or "retry". If the referenced workflow is contained within an arazzo type sourceDescription, then the workflowId MUST be specified using a Runtime Expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. This field is mutually exclusive to stepId. When used with "retry", context transfers back upon completion of the specified workflow.
 * @property {string=} stepId - The stepId to transfer to upon failure of the step. This field is only relevant when the type field value is "goto" or "retry". The referenced stepId MUST be within the current workflow. This field is mutually exclusive to workflowId. When used with "retry", context transfers back upon completion of the specified step.
 * @property {number=} retryAfter - A non-negative decimal indicating the seconds to delay after the step failure before another attempt SHALL be made. Note: if an HTTP Retry-After response header was returned to a step from a targeted operation, then it SHOULD overrule this particular field value. This field only applies when the type field value is "retry".
 * @property {number=} retryLimit - A non-negative integer indicating how many attempts to retry the step MAY be attempted before failing the overall step. If not specified then a single retry SHALL be attempted. This field only applies when the type field value is "retry". The retryLimit MUST be exhausted prior to executing subsequent failure actions.
 * @property {criteria[]} criteria - A list of assertions to determine if this action SHALL be executed. Each assertion is described using a Criterion Object.
 */

/**
 * @typedef {Object} successActionsObject
 * @property {string} name - REQUIRED. The name of the failure action. Names are case sensitive.
 * @property {string} type - REQUIRED. The type of action to take. Possible values are "end" or "goto".
 * @property {string=} workflowId -  The workflowId referencing an existing workflow within the Arazzo Description to transfer to upon success of the step. This field is only relevant when the type field value is "goto". If the referenced workflow is contained within an arazzo type sourceDescription, then the workflowId MUST be specified using a Runtime Expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. This field is mutually exclusive to stepId.
 * @property {string=} stepId - The stepId to transfer to upon success of the step. This field is only relevant when the type field value is "goto". The referenced stepId MUST be within the current workflow. This field is mutually exclusive to workflowId.
 * @property {criteria[]} criteria - A list of assertions to determine if this action SHALL be executed. Each assertion is described using a Criterion Object. All criteria assertions MUST be satisfied for the action to be executed.
 */

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

  /**
   * Sets the Failure Action Rules to be run
   * @function setFailureRules
   * @param {failureActionsObject[]} failureActions
   */
  setFailureRules(failureActions) {
    this.failureRules.push(...failureActions);
  }

  /**
   * Sets the Success Action Rules to be run
   * @function setSuccessRules
   * @param {successActionsObject[]} successActions
   */
  setSuccessRules(successActions) {
    this.successRules.push(...successActions);
  }

  /**
   * Takes a Rules instance and combines the rules
   * @function combineRules
   * @param {Rules} rulesObj
   */
  combineRules(rulesObj) {
    this.failureRules.push(...rulesObj.failureRules);
    this.successRules.push(...rulesObj.successRules);
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

    if (this.rules.length)
      this.logger.notice(
        "==================================================================================",
      );

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
            break;
          } else {
            obj.name = rule.name;
            obj.retry = true;
            if (rule.stepId) obj.stepId = rule.stepId;
            if (rule.workflowId) obj.workflowId = rule.workflowId;
            obj.retryLimit = rule?.retryLimit || 1;
            if (rule.retryAfter) obj.retryAfter = rule.retryAfter;
            break;
          }
        }
      }
    }

    if (this.rules.length)
      this.logger.notice(
        "==================================================================================",
      );

    return obj;
  }

  /**
   * @function criteriaChecks
   * @private
   * @param {successActionsObject|failureActionsObject} rule
   * @returns {boolean[]}
   */
  criteriaChecks(rule) {
    const passedCriteria = [];

    for (const criteriaObject of rule.criteria) {
      if (criteriaObject?.type) {
        if (criteriaObject.type === "regex") {
          this.logger.notice(
            `checking ${rule.name} rule: ${criteriaObject.context} matches ${criteriaObject.condition} `,
          );
          const hasPassedCheck = this.expression.checkRegexExpression(
            criteriaObject.context,
            criteriaObject.condition,
          );

          if (hasPassedCheck) {
            this.logger.success(
              `${criteriaObject.context} matched ${criteriaObject.condition}`,
            );
            passedCriteria.push(hasPassedCheck);
          } else {
            this.logger.error(
              `${criteriaObject.context} did not match ${criteriaObject.condition}`,
            );
          }
        } else if (criteriaObject.type === "jsonpath") {
          const hasPassedCheck = this.jsonPathCheck(rule, criteriaObject);
          if (hasPassedCheck) passedCriteria.push(hasPassedCheck);
        } else if (criteriaObject.type === "xpath") {
          const hasPassedCheck = this.xPathCheck(rule, criteriaObject);
          if (hasPassedCheck) passedCriteria.push(hasPassedCheck);
        } else if (criteriaObject.type === "simple") {
          const hasPassedCheck = this.simpleCheck(rule, criteriaObject);
          if (hasPassedCheck) passedCriteria.push(hasPassedCheck);
        }
      } else {
        const hasPassedCheck = this.simpleCheck(rule, criteriaObject);
        if (hasPassedCheck) passedCriteria.push(hasPassedCheck);
      }
    }

    return passedCriteria;
  }

  /**
   * @function simpleCheck
   * @private
   * @param {successActionsObject|failureActionsObject} rule
   * @param {criteriaObject} criteriaObject
   * @returns {boolean}
   */
  simpleCheck(rule, criteriaObject) {
    this.logger.notice(
      `checking ${rule.name} rule: ${criteriaObject.condition} `,
    );
    const hasPassedCheck = this.expression.checkSimpleExpression(
      criteriaObject.condition,
    );

    if (hasPassedCheck) {
      this.logger.success(`${criteriaObject.condition} passed`);
    } else {
      this.logger.error(`${criteriaObject.condition} failed`);
    }

    return hasPassedCheck;
  }

  /**
   * @function jsonPathCheck
   * @private
   * @param {successActionsObject|failureActionsObject} rule
   * @param {criteriaObject} criteriaObject
   * @returns {boolean}
   */
  jsonPathCheck(rule, criteriaObject) {
    this.logger.notice(
      `checking ${rule.name} rule: ${criteriaObject.context} has a matching JSONPath for ${criteriaObject.condition} `,
    );
    const hasPassedCheck = this.expression.checkJSONPathExpression(
      criteriaObject.context,
      criteriaObject.condition,
    );

    if (hasPassedCheck) {
      this.logger.success(`${criteriaObject.condition} passed`);
    } else {
      this.logger.error(`${criteriaObject.condition} failed`);
    }

    return hasPassedCheck;
  }

  /**
   * @function xPathCheck
   * @private
   * @param {successActionsObject|failureActionsObject} rule
   * @param {criteriaObject} criteriaObject
   * @returns {boolean}
   */
  xPathCheck(rule, criteriaObject) {
    this.logger.notice(
      `checking ${rule.name} rule: ${criteriaObject.context} has a matching xPath for ${criteriaObject.condition} `,
    );
    const hasPassedCheck = this.expression.checkXPathExpression(
      criteriaObject.context,
      criteriaObject.condition,
    );

    if (hasPassedCheck) {
      this.logger.success(`${criteriaObject.condition} passed`);
    } else {
      this.logger.error(`${criteriaObject.condition} failed`);
    }

    return hasPassedCheck;
  }

  /**
   * @function buildFailureRules
   * @private
   */
  buildFailureRules() {
    this.rules = this.failureRules;
  }

  /**
   * @function buildSuccessRules
   * @private
   */
  buildSuccessRules() {
    this.rules = this.successRules;
  }
}

module.exports = Rules;
