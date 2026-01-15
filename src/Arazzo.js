"use strict";

const URLParams = require("openapi-params");

const path = require("node:path");

const Document = require("./Document");
// const docFactory = require("./DocFactory");
const Expression = require("./Expression");
const Rules = require("./Rules");

class Arazzo extends Document {
  constructor(url, name, options, docFactory) {
    super(url, name, options);

    this.docFactory = docFactory;
    this.type = "arazzo";
    this.outputs = {};
    this.loadedSourceDescriptions = {};
    this.expression = new Expression();
    // this.pathToArazzoSpecification = path.resolve(arazzoPath);
    this.stepRunRules = {};
    this.workflowRunRules = {};
    this.retrySet = new Set();
    this.retryLimits = {};
    this.stepContext = {};
  }

  setMainArazzo() {
    this.filePath = path.resolve(this.url);
  }

  /**
   * Run the workflows of an Arazzo Document
   * @function runWorkflows
   * @public
   * @param {*} inputFile
   */
  async runWorkflows(inputFile) {
    await this.loadWorkflowData(inputFile);

    this.logger.notice("Running Workflows");

    await this.startWorkflows();

    this.logger.success("All Workflows run");
  }

  async loadWorkflowData(inputFile) {
    this.inputFile = inputFile;
    await this.getSourceDescriptions();
    await this.getWorkflows();
  }

  /**
   * @private
   * @param {number} index
   */
  async startWorkflows(index = 0) {
    this.workflowIndex = index;

    if (index <= this.workflows.length - 1) {
      this.abortWorkflowController = new AbortController();

      try {
        await this.runWorkflow(index);
        await this.startWorkflows(index + 1);
      } catch (err) {
        if (err.name === "AbortError") {
          if (err.goto) {
            // console.log("goto error");
            await this.handleGotoRule(err.goto);
          }
        } else {
          throw err;
        }
      }
    }
  }

  /**
   * @private
   * @param {number} index
   * @returns
   */
  async runWorkflow(index) {
    if (this?.abortWorkflowController?.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    } else {
      this.abortWorkflowController = new AbortController();
    }

    const rules = new Rules(this.expression, { logger: this.logger });
    const workflow = await this.JSONPickerToIndex("workflows", index);

    if (workflow) {
      this.logger.notice(`Running Workflow: ${workflow.workflowId}`);

      this.workflow = workflow;
      this.workflowId = workflow.workflowId;

      if (workflow.dependsOn) {
        await this.runDependsOnWorkflows();

        this.workflow = workflow;
      }

      this.inputs = await this.inputFile.getWorkflowInputs(
        this.workflow.workflowId,
        this.workflow.inputs,
      );

      this.expression.addToContext("inputs", this.inputs);

      if (this.workflow.onSuccess) {
        // this.workflow.rules.set(this.workflow.onSuccess);
        rules.setSuccessRules(this.workflow.onSuccess);
      }

      if (this.workflow.onFailure) {
        // this.workflow.rules.setWorkflowFailures(this.workflow.onFailure);
        rules.setFailureRules(this.workflow.onFailure);
      }

      this.workflow.rules = rules;

      await this.runSteps();

      if (this.workflow.outputs) {
        const outputs = {};

        for (const key in this.workflow.outputs) {
          const value = this.expression.resolveExpression(
            this.workflow.outputs[key],
          );

          Object.assign(outputs, { [key]: value });
        }

        this.expression.addToContext("workflows", {
          [this.workflow.workflowId]: { outputs: outputs },
        });
      }

      this.logger.success(`Workflow ${workflow.workflowId} completed`);
      return { noMoreWorkflows: false };
    }
  }

  /**
   * @private
   */
  async runDependsOnWorkflows() {
    this.logger.notice("Running Workflows from dependsOn");

    for await (const workflowId of this.workflow.dependsOn) {
      const workflowIndex = this.findWorkflowIndexByWorkflowId(workflowId);

      if (workflowIndex !== -1) {
        await this.runWorkflow(workflowIndex);
      }
    }

    this.logger.success("All Workflows from dependsOn have run");
  }

  /**
   * @private
   */
  async runStepByIdFromRetry(stepId) {
    const stepIndex = this.workflow.steps.findIndex(
      (step) => step.stepId === stepId,
    );

    return await this.runStep(stepIndex);
  }

  /**
   * @private
   * @param {number} index
   */
  async runSteps(index = 0) {
    if (this.abortWorkflowController.signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    this.stepIndex = index;
    if (index <= this.workflow?.steps?.length - 1) {
      await this.runStep(index);
      await this.runSteps(index + 1);
    }
  }

  /**
   * @private
   * @param {*} index
   * @returns
   */
  async runStep(index) {
    if (this.abortWorkflowController.signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const step = this.workflow.steps[index];

    if (step) {
      this.step = step;
      const rules = new Rules(this.expression, { logger: this.logger });
      // if (!this.stepContext[step.stepId])
      //   Object.assign(this.stepContext, { [step.stepId]: {} });

      this.logger.notice(`Running Step: ${step.stepId}`);

      // need to deal with reloading the rules when in a retry state or a goto state
      // if (this.stepContext?.[step.stepId]?.hasLoadedRules === false) {
      if (this.step.onSuccess) {
        rules.setSuccessRules(this.step.onSuccess);
        // this.workflow.rules.setStepSuccesses(this.step.onSuccess);
      }

      if (this.step.onFailure) {
        rules.setFailureRules(this.step.onFailure);
        // this.workflow.rules.setStepFailures(this.step.onFailure);
      }

      rules.combineRules(this.workflow.rules);
      this.step.rules = rules;
      // this.step.rules.combineRules(this.workflow.rules);

      //   this.stepContext[step.stepId].hasLoadedRules = true;
      // }

      await this.loadOperationData();

      if (this.openAPISteps) {
        await this.runOpenAPIStep();
      }

      this.isAnOperationId = false;
      this.isAWorkflowId = false;
      this.isAnOperationPath = false;
      this.openAPISteps = false;

      this.logger.success(`Step ${step.stepId} completed`);
      return { noMoreSteps: false };
    } else {
      // this.logger.notice(`All steps in ${this.workflow.workflowId} have run`);

      return { noMoreSteps: true };
    }
  }

  /**
   * @private
   */
  async runOpenAPIStep() {
    this.operations = await this.sourceDescriptionFile.buildOperation(
      this.inputs,
      this.step,
    );

    this.mapInputs();

    await this.runOperation();
  }

  /**
   *
   * @private
   * @param {*} retry
   * @param {*} retryAfter
   */
  async runOperation(retry = 0, retryAfter = 0) {
    const sleep = function (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const parseRetryAfter = function (retryAfter) {
      if (!retryAfter || typeof retryAfter !== "string") {
        return null;
      }

      const trimmed = retryAfter.trim();

      // Try parsing as a number (seconds format)
      const asNumber = parseInt(trimmed, 10);
      if (!isNaN(asNumber) && asNumber >= 0 && String(asNumber) === trimmed) {
        return asNumber;
      }

      // Try parsing as HTTP date format
      try {
        const date = new Date(trimmed);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return null;
        }

        // Calculate seconds from now until the date
        const now = new Date();
        const secondsUntil = Math.ceil((date.getTime() - now.getTime()) / 1000);

        // Return the delay, but don't return negative values
        return secondsUntil >= 0 ? secondsUntil : 0;
      } catch (err) {
        return null;
      }
    };

    for (const operation of this.operations) {
      let url = operation.url;

      if (operation.queryParams.size) {
        url += `?${operation.queryParams}`;
      }

      const options = {
        method: operation.operation,
        headers: operation.headers,
      };

      if (operation.data) {
        options.body = operation.data;
      }

      if (this.retryAfter) {
        this.logger.notice(
          `retryAfter was set: waiting ${this.retryAfter * 1000} seconds`,
        );
        await sleep(this.retryAfter * 1000);
      }

      this.expression.addToContext("url", url);
      this.expression.addToContext("method", options.method);

      this.logger.notice(`Making a ${options.method.toUpperCase()} to ${url}`);

      const response = await fetch(url, options);

      if (response.headers.has("retry-after")) {
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        if (retryAfter !== null) {
          this.retryAfter = retryAfter;
        }
      }

      this.addParamsToContext(response.headers, "header", "response");
      this.expression.addToContext("statusCode", response.status);

      this.logger.notice(`${url} responded with a: ${response.status}`);

      await this.dealWithResponse(response);
    }
  }

  /**
   * @private
   * @param {*} response
   */
  async dealWithResponse(response) {
    this.doNotProcessStep = false;
    this.alreadyProcessingOnFailure = false;

    if (this.step.successCriteria) {
      if (this.step.successCriteria) {
        const passedSuccessCriteria = this.hasPassedSuccessCriteria();

        if (passedSuccessCriteria) {
          this.logger.success("All criteria checks passed");
          if (this.currentRetryRule) {
            if (this.retryContext.doNotDeleteRetryLimits) {
              this.retryLimits[this.currentRetryRule] = 0;
              this.logger.notice("Retries stopped");
            }
          }

          await this.dealWithPassedRule(response);
        } else {
          this.logger.error("Not all criteria checks passed");
          if (this.step.onFailure) {
            await this.dealWithFailedRule();
          } else {
            throw new Error(
              `${this.step.stepId} step of the ${this.workflow.workflowId} workflow failed the successCriteria`,
            );
          }
        }
      }
    } else {
      if (this.step?.outputs) {
        await this.dealWithStepOutputs(response);
      }
    }
  }

  /**
   * @private
   * @returns
   */
  hasPassedSuccessCriteria() {
    const hasPassed = [];
    this.logger.notice(
      "==================================================================================",
    );
    for (const criteriaObject of this.step.successCriteria) {
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
        this.logger.notice(`Checking: ${criteriaObject.condition}`);
        const hasPassedCheck = this.expression.checkSimpleExpression(
          criteriaObject.condition,
        );

        if (hasPassedCheck) {
          this.logger.success(`${criteriaObject.condition} passed`);
          hasPassed.push(true);
        } else {
          this.logger.error(`${criteriaObject.condition} failed`);
        }
      }
    }
    this.logger.notice(
      "==================================================================================",
    );
    return hasPassed.length === this.step.successCriteria.length;
  }

  /**
   * @private
   * @param {*} response
   */
  async dealWithPassedRule(response) {
    if (this.step?.outputs) {
      await this.dealWithStepOutputs(response);
    }

    const whatNext = this.step.rules.runRules(true);

    if (whatNext.endWorkflow) {
      this.workflowIndex += 1;

      this.abortWorkflowController.abort();
      this.logger.notice(
        `${this.step.stepId} onSuccess End Workflow rule triggered`,
      );
      this.logger.notice(`Ending Workflow: ${this.workflowId}`);
      throw new DOMException("Aborted", "AbortError");
    } else if (whatNext.goto) {
      this.logger.notice(`${this.step.stepId} onSuccess GoTo rule triggered`);
      await this.gotoRule(whatNext);
    }
  }

  /**
   * @private
   * @param {string} stepId
   * @returns
   */
  findStepIndexInWorkflowByStepId(stepId) {
    const stepIndex = this.workflow.steps.findIndex(
      (step) => step.stepId === stepId,
    );

    if (stepIndex === -1) {
      throw new Error(`goto Step does not exist within current workflow`);
    }

    return stepIndex;
  }

  /**
   * @private
   * @param {string} workflowId
   * @returns
   */
  findWorkflowIndexByWorkflowId(workflowId) {
    const resolvedWorkflowId = this.expression.resolveExpression(workflowId);

    const workflowIndex = this.workflows.findIndex(
      (workflow) => workflow.workflowId === resolvedWorkflowId,
    );

    if (workflowIndex === -1) {
      throw new Error(`goto Workflow does not exist within current workflows`);
    }

    return workflowIndex;
  }

  /**
   * @private
   * @param {*} response
   */
  async dealWithFailedRule(response) {
    // if (this.step?.outputs) {
    //   await this.dealWithStepOutputs(response);
    // }

    const whatNext = this.step.rules.runRules();
    if (whatNext.endWorkflow) {
      this.workflowIndex += 1;
      this.logger.notice(
        `${this.step.stepId} onFailure End Workflow rule triggered`,
      );

      this.abortWorkflowController.abort();
      throw new DOMException("Aborted", "AbortError");
    } else if (whatNext.goto) {
      this.logger.notice(`${this.step.stepId} onFailure GoTo rule triggered`);
      await this.gotoRule(whatNext);
    } else {
      if (this.retrySet.has(whatNext.name) === false)
        this.logger.notice(
          `${this.step.stepId} onFailure Retry rule triggered`,
        );
      await this.retryProcessing(whatNext);
    }
  }

  /**
   * @private
   * @param {*} gotoRule
   */
  async gotoRule(gotoRule) {
    if (gotoRule.stepId) {
      this.abortWorkflowController.abort();

      // Attach goto to the error so we can handle it
      const abortError = new DOMException("Aborted", "AbortError");
      abortError.goto = gotoRule;
      throw abortError;
    } else {
      const abortError = new DOMException("Aborted", "AbortError");
      abortError.goto = gotoRule;
      throw abortError;
    }
  }

  /**
   * @private
   * @param {*} gotoRule
   */
  async handleGotoRule(gotoRule) {
    if (gotoRule.stepId) {
      const stepIndex = this.workflow.steps.findIndex(
        (step) => step.stepId === gotoRule.stepId,
      );

      if (stepIndex === -1) {
        throw new Error(`goto Step does not exist within current workflow`);
      }

      this.abortWorkflowController = new AbortController();
      try {
        await this.runSteps(stepIndex);
        // After finishing this workflow, continue to next
        await this.startWorkflows(this.workflowIndex + 1);
      } catch (err) {
        if (err.name === "AbortError") {
          if (err.goto) {
            await this.handleGotoRule(err.goto);
          } else {
            await this.startWorkflows(this.workflowIndex + 1);
          }
        } else {
          throw err;
        }
      }
    } else {
      const workflowIndex = this.workflows.findIndex(
        (workflow) => workflow.workflowId === gotoRule.workflowId,
      );

      if (workflowIndex === -1) {
        throw new Error(
          `goto Workflow does not exist within current workflows`,
        );
      }

      await this.startWorkflows(workflowIndex);
    }
  }

  /**
   * @private
   * @param {*} whatNext
   */
  async retryProcessing(whatNext) {
    const addOrdinalSuffix = function (num) {
      // Validate input
      if (typeof num !== "number" || !Number.isFinite(num)) {
        throw new Error("Input must be a finite number.");
      }

      const absNum = Math.abs(num); // Handle negative numbers
      const lastTwoDigits = absNum % 100;
      const lastDigit = absNum % 10;

      let suffix = "th"; // Default suffix

      // Special case: 11, 12, 13 always use "th"
      if (lastTwoDigits < 11 || lastTwoDigits > 13) {
        if (lastDigit === 1) suffix = "st";
        else if (lastDigit === 2) suffix = "nd";
        else if (lastDigit === 3) suffix = "rd";
      }

      return `${num}${suffix}`;
    };

    this.retryContext = {
      doNotDeleteRetryLimits: true,
    };

    let shouldRunRule = true;
    this.currentRetryRule = whatNext.name;

    if (this.retrySet.has(whatNext.name)) {
      shouldRunRule = false;
    } else {
      this.retrySet.add(whatNext.name);
    }

    if (shouldRunRule) {
      Object.assign(this.retryLimits, {
        [whatNext.name]: whatNext.retryLimit,
      });

      if (whatNext.stepId || whatNext.workflowId) {
        this.retryContext.doNotDeleteRetryLimits = false;

        if (whatNext.stepId) {
          this.logger.notice(
            `Rule ${whatNext.name} requires Step ${whatNext.stepId} running first`,
          );

          const stepIndex = this.findStepIndexInWorkflowByStepId(
            whatNext.stepId,
          );

          await this.runStep(stepIndex);

          this.logger.notice(
            `Rule ${whatNext.name} Step ${whatNext.stepId} has run`,
          );
        } else {
          this.logger.notice(
            `Rule ${whatNext.name} requires Workflow ${whatNext.workflowId} running first`,
          );

          const workflowIndex = this.findWorkflowIndexByWorkflowId(
            whatNext.workflowId,
          );

          await this.runWorkflow(workflowIndex);

          this.logger.notice(
            `Rule ${whatNext.name} Workflow ${whatNext.workflowId} has run`,
          );
        }
      }

      if (!this.retryAfter && whatNext.retryAfter)
        this.retryAfter = whatNext.retryAfter;

      let counter = 1;
      do {
        this.logger.notice(
          `Retrying ${this.step.stepId} for the ${addOrdinalSuffix(counter)} time`,
        );

        let count = this.retryLimits[whatNext.name];

        await this.runStep(this.stepIndex);

        if (this.retryLimits[whatNext.name] !== 0) {
          count--;
          counter++;
          this.retryLimits[whatNext.name] = count;
        }
      } while (this.retryLimits[whatNext.name] > 0);
    }

    if (this.retryLimits[whatNext.name] === 0)
      this.retrySet.delete(whatNext.name);

    // console.log("I need to return here after retrying");
  }

  /**
   * @private
   * @param {*} response
   */
  async dealWithStepOutputs(response) {
    const json = await response?.json().catch((err) => {
      console.error(err);
      this.logger.error(`Error trying to resolve ${this.step.stepId} outputs`);
      throw new Error(err);
    });

    this.expression.addToContext("response.body", json);

    const outputs = {};
    for (const key in this.step.outputs) {
      const value = this.expression.resolveExpression(this.step.outputs[key]);

      Object.assign(outputs, { [key]: value });
    }

    this.expression.addToContext("steps", {
      [this.step.stepId]: { outputs: outputs },
    });
  }

  /**
   * @private
   */
  mapInputs() {
    this.mapParameters();
    this.mapRequestBody();

    for (const operation of this.operations) {
      this.addParamsToContext(operation.headers, "headers", "request");
      this.addParamsToContext(operation.queryParams, "query", "request");
    }
  }

  /**
   * @private
   */
  mapParameters() {
    const headers = new Headers();
    const queryParams = new URLSearchParams();
    const pathParams = {};

    for (const param of this.step?.parameters || []) {
      const operationDetailParam =
        this.sourceDescription.operationDetails?.parameters
          .filter((obj) => obj.name === param.name && obj.in === param.in)
          .at(0);

      const value = this.expression.resolveExpression(param.value);

      switch (param.in) {
        case "header":
          headers.append(param.name, value);

          break;

        case "path":
          for (const operation of this.operations) {
            operation.url = operation.url.replace(`{${param.name}}`, value);
            Object.assign(pathParams, { [param.name]: value });
          }
          break;

        case "query":
          queryParams.append(param.name, value);
          break;
      }
    }

    this.expression.addToContext("request.path", pathParams);

    for (const operation of this.operations) {
      operation.headers = headers;
      operation.queryParams = queryParams;
    }
  }

  /**
   * @private
   * @param {*} params
   * @param {*} paramType
   * @param {*} contextType
   */
  addParamsToContext(params, paramType, contextType) {
    const parameters = {};
    for (const [key, value] of params.entries()) {
      Object.assign(parameters, { [key]: value });
    }

    this.expression.addToContext(contextType, { [paramType]: parameters });
  }

  /**
   * @private
   */
  mapRequestBody() {
    if (this.step?.requestBody) {
      const payload = this.expression.resolveExpression(
        this.step.requestBody.payload,
      );

      for (const operation of this.operations) {
        if (this.step.requestBody.contentType) {
          operation.headers.append("accept", this.step.requestBody.contentType);
        }

        operation.data = payload;
      }
    }
  }

  /**
   * @private
   */
  async loadOperationData() {
    this.sourceDescription = this.getOperationIdSourceDescription();

    if (!this.loadedSourceDescriptions[this.sourceDescription.name]) {
      this.logger.notice(
        `Getting Source Description for: ${this.sourceDescription.name}`,
      );

      this.sourceDescriptionFile = await this.docFactory.buildDocument(
        this.sourceDescription.type,
        this.sourceDescription.url,
        this.sourceDescription.name,
        { logger: this.logger },
      );

      Object.assign(this.loadedSourceDescriptions, {
        [this.sourceDescription.name]: true,
      });
    }

    if (this.isAnOperationId) {
      // this.logger.notice(`Getting OperationId: ${this.step.operationId}`);
      let operationId = this.step.operationId;

      operationId = operationId.split(".").at(-1);
      await this.sourceDescriptionFile.getOperationById(operationId);
    } else {
      let workflowIdArr = this.step?.workflowId?.split(".") || [];

      if (workflowIdArr.length === 1) {
        await this.runWorkflowById(workflowIdArr.at(0));
      } else {
        await this.sourceDescriptionFile.loadWorkflowData(this.inputFile);
        await this.sourceDescriptionFile.runWorkflowById(workflowIdArr.at(-1));
      }
    }
  }

  /**
   * @private
   * @returns
   */
  getOperationIdSourceDescription() {
    const operationOrWorkflowPointer = this.getOperationType();

    // if there's only one, then all pointers must point to this
    if (this.sourceDescriptions.length === 1) {
      return this.sourceDescriptions[0];
    } else {
      const operationOrWorkflowPointerArr =
        operationOrWorkflowPointer.split(".");

      const joinedoperationOrWorkflowPointer = `${operationOrWorkflowPointerArr[0]}.${operationOrWorkflowPointerArr[1]}`;

      const sourceDescription = this.expression.resolveExpression(
        joinedoperationOrWorkflowPointer,
      );

      if (sourceDescription) {
        return sourceDescription;
      }
    }

    throw new Error(
      `No known matching source description for ${this.step.operationId}`,
    );
  }

  /**
   * @private
   * @returns
   */
  getOperationType() {
    this.isAnOperationId = false;
    this.isAWorkflowId = false;
    this.isAnOperationPath = false;
    this.openAPISteps = false;

    let operationOrWorkflowPointer;

    if (this.step.operationId) {
      operationOrWorkflowPointer = this.step.operationId;
      this.isAnOperationId = true;
      this.openAPISteps = true;
    } else if (this.step.workflowId) {
      operationOrWorkflowPointer = this.step.workflowId;
      this.isAWorkflowId = true;
    } else {
      operationOrWorkflowPointer = this.step.operationPath;
      this.isAnOperationPath = true;
      this.openAPISteps = true;
    }
    return operationOrWorkflowPointer;
  }

  /**
   * @private
   */
  async getSourceDescriptions() {
    const pipeline = this.JSONPicker("sourceDescriptions", this.filePath);

    let sourceDescriptions = [];
    for await (const { value } of pipeline) {
      sourceDescriptions = value.flat();
    }

    if (sourceDescriptions.length === 0) {
      throw new Error("Missing Source Descriptions");
    }

    this.sourceDescriptions = sourceDescriptions;
    for (const sourceDescription of sourceDescriptions) {
      this.expression.addToContext("sourceDescriptions", {
        [sourceDescription.name]: {
          name: sourceDescription.name,
          url: sourceDescription.url,
          type: sourceDescription.type,
        },
      });
    }
  }

  /**
   * private
   */
  async getWorkflows() {
    const pipeline = this.JSONPicker("workflows", this.filePath);

    let workflows = [];
    for await (const { value } of pipeline) {
      workflows = value.flat();
    }

    if (workflows.length === 0) {
      throw new Error("Missing Workflows");
    }

    this.workflows = workflows;
  }

  /**
   * private
   * @param {string} workflowId
   */

  async runWorkflowById(workflowId) {
    const workflowIndex = this.findWorkflowIndexByWorkflowId(workflowId);
    await this.runWorkflow(workflowIndex);
  }
}

module.exports = Arazzo;
