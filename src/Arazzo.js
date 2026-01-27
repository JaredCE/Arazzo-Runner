"use strict";

const URLParams = require("openapi-params");
const client = require("openid-client");

const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

const Document = require("./Document");
const ExecutionContext = require('./ExecutionContext');
const ExecutionContextStack = require('./ExecutionContextStack');
const Expression = require("./Expression");
const Operation = require('./Operation');
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
    this.context = new Map();
    this.executionStack = new ExecutionContextStack();
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


    const workflow = await this.JSONPickerToIndex("workflows", index);

    if (workflow) {
      const context = new ExecutionContext(
        'workflow',
        workflow.workflowId,
        index,
        null,
        workflow.workflowId,
        null
      );
      this.executionStack.push(context);

      try {
        await this.buildWorkflow(workflow);
        // const prevWorkflowContexts = this.executionStack.getContextsByType('workflow')
        //   .slice(0, -1);
        // if (prevWorkflowContexts.some(ctx => ctx.workflowId === workflow.workflowId)) {
        //   throw new Error(`Circular workflow dependency detected: ${workflow.workflowId}`);
        // }


        this.logger.notice(`Running Workflow: ${this.workflow.workflowId}`);

        // this.workflow = workflow;
        // this.workflowId = workflow.workflowId;

        if (this.workflow.dependsOn) {
          await this.runDependsOnWorkflows();

          this.workflow = workflow;
        }

        // this.inputs = await this.inputFile.getWorkflowInputs(
        //   this.workflow.workflowId,
        //   this.workflow.inputs,
        // );

        // this.expression.addToContext("inputs", this.inputs);

        // if (this.workflow.successActions) {
        //   rules.setSuccessRules(this.workflow.successActions);
        // }

        // if (this.workflow.failureActions) {
        //   rules.setFailureRules(this.workflow.failureActions);
        // }

        // this.workflow.rules = rules;

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
      } finally {
        this.executionStack.pop();
      }
    }
  }

  async buildWorkflow(workflow) {
    const rules = new Rules(this.expression, { logger: this.logger });

    this.workflow = workflow;
    this.workflowId = workflow.workflowId;

    this.inputs = await this.inputFile.getWorkflowInputs(
      this.workflow.workflowId,
      this.workflow.inputs,
    );

    this.expression.addToContext("inputs", this.inputs);

    if (this.workflow.successActions) {
      rules.setSuccessRules(this.workflow.successActions);
    }

    if (this.workflow.failureActions) {
      rules.setFailureRules(this.workflow.failureActions);
    }

    this.workflow.rules = rules;
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

    const context = new ExecutionContext(
      'step',
      step.stepId,
      this.workflowIndex,
      index,
      this.workflow.workflowId,
      step.stepId
    );
    this.executionStack.push(context);

    try {
      // if (this.executionStack.depth > 1) {
      //   const prevContexts = this.executionStack.getContextsByType('step')
      //     .slice(0, -1); // Exclude current
      //   if (prevContexts.some(ctx => ctx.stepId === step.stepId)) {
      //     throw new Error(`Circular step dependency detected: ${step.stepId}`);
      //   }
      // }

      this.step = step;
      const rules = new Rules(this.expression, { logger: this.logger });

      this.logger.notice(`Running Step: ${step.stepId}`);

      if (this.step.onSuccess) {
        rules.setSuccessRules(this.step.onSuccess);
      }

      if (this.step.onFailure) {
        rules.setFailureRules(this.step.onFailure);
      }

      rules.combineRules(this.workflow.rules);
      this.step.rules = rules;

      await this.loadOperationData();

      if (this.openAPISteps) {
        await this.runOpenAPIStep();
      } else if (this.isAWorkflowId) {
        await this.runWorkflowStep()
      }

      this.isAnOperationId = false;
      this.isAWorkflowId = false;
      this.isExternalWorkflow = false;
      this.isAnOperationPath = false;
      this.openAPISteps = false;

      this.logger.success(`Step ${step.stepId} completed`);

    } finally {
      this.executionStack.pop();
    }
  }

  async runWorkflowStep() {
    this.currentStepIndex = this.stepIndex;
    this.currentWorkflow = this.workflow;
    if (this.isExternalWorkflow) {
      await this.sourceDescriptionFile.runWorkflowById(this.step.workflowId)
      const sourceDesc = this.expression.context.sourceDescriptions[this.sourceDescriptionFile.name];
      if (!sourceDesc[this.step.workflowId]) {
        if (this.sourceDescriptionFile.expression?.context?.workflows?.[this.step.workflowId]?.outputs) {
          Object.assign(sourceDesc, { [this.step.workflowId]: { outputs: this.sourceDescriptionFile.expression.context.workflows[this.step.workflowId].outputs } });
          this.expression.context.sourceDescriptions[this.sourceDescriptionFile.name] = sourceDesc;
        }
      }
    } else {
      await this.runWorkflowById(this.step.workflowId);
    }
    this.stepIndex = this.currentStepIndex;
    this.workflow = this.currentWorkflow;
  }

  /**
   * @private
   */
  async runOpenAPIStep() {
    this.operation = await this.sourceDescriptionFile.buildOperation(
      this.inputs,
      this.step,
    );

    const miniStep = {
      stepId: this.step.stepId,
      parameters: this.step.parameters || [],
      requestBody: this.step.requestBody || undefined,
    };

    const apiOperation = new Operation(this.operation, this.sourceDescriptionFile, this.expression, this.inputs, this.logger, miniStep);
    const response = await apiOperation.runOperation(this.retryAfter)
    await this.dealWithResponse(response)
  }

  /**
   * @private
   * @param {*} response
   */
  async dealWithResponse(response) {
    this.doNotProcessStep = false;
    this.alreadyProcessingOnFailure = false;

    if (this.step.successCriteria) {
      const passedSuccessCriteria = this.hasPassedSuccessCriteria();

      if (passedSuccessCriteria) {
        this.logger.success("All criteria checks passed");

        if (this.currentRetryRule) {
          if (this.retryContext.doNotDeleteRetryLimits) {
            this.retryLimits[this.currentRetryRule] = 0;
            this.logger.notice("Retries stopped");
            delete this.retryAfter;
          }
        }

        await this.dealWithPassedRule(response);
      } else {
        this.logger.error("Not all criteria checks passed");
        // if (this.step.onFailure) {
        await this.dealWithFailedRule(response);
        // } else {
        //   throw new Error(
        //     `${this.step.stepId} step of the ${this.workflow.workflowId} workflow failed the successCriteria`,
        //   );
        // }
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

      if (response.headers.has('retry-after')) {
        this.retryAfter = response.headers.get('retry-after');
      }

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

    const currentContext = this.executionStack.current;
    currentContext.isRetrying = true;
    currentContext.retryCount++;
    // console.log(this.currentContext)
    // this.currentContext.currentlyBeingRetried = true;

    this.retryContext = {
      doNotDeleteRetryLimits: true,
      originContext: currentContext,
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
          await this.retryStep(whatNext)
        } else {
          await this.retryWorkflow(whatNext)
        }

        // After retry step/workflow completes, restore our context
        await this.restoreContextFromRetry(currentContext);
      }

      if (!this.retryAfter && whatNext.retryAfter)
        this.retryAfter = whatNext.retryAfter;

      let counter = 1;
      do {
        this.logger.notice(
          `Retrying ${this.step.stepId} for the ${addOrdinalSuffix(counter)} time`,
        );

        let count = this.retryLimits[whatNext.name];

        await this.runStep(currentContext.stepIndex);

        if (this.retryLimits[whatNext.name] !== 0) {
          count--;
          counter++;
          this.retryLimits[whatNext.name] = count;
        }
      } while (this.retryLimits[whatNext.name] > 0);
    }

    currentContext.isRetrying = false;

    if (this.retryLimits[whatNext.name] === 0)
      this.retrySet.delete(whatNext.name);
  }

  /**
   * @private
   * @param {*} whatNext
   */
  async retryStep(whatNext) {
    const currentContext = this.executionStack.current;

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
  }

  /**
   * @private
   * @param {*} whatNext
   */
  async retryWorkflow(whatNext) {
    const currentContext = this.executionStack.current;

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

  async restoreContextFromRetry(context) {
    // Restore the indexes and state
    this.workflowIndex = context.workflowIndex;
    this.stepIndex = context.stepIndex;
    const workflow = await this.JSONPickerToIndex("workflows", context.workflowIndex);
    await this.buildWorkflow(workflow)
    this.step = this.workflow.steps[context.stepIndex];

    this.logger.notice(
      `Restored context: workflow=${context.workflowId}, step=${context.stepId}`
    );
  }

  /**
   * @private
   * @param {*} response
   */
  async dealWithStepOutputs() {
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
        { logger: this.logger, config: this.config },
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

      if (workflowIdArr.length !== 1) {
        this.step.workflowId = workflowIdArr.at(-1)
        this.isExternalWorkflow = true;
        //   await this.runWorkflowById(workflowIdArr.at(0));
        // } else {
        await this.sourceDescriptionFile.loadWorkflowData(this.inputFile);
        // await this.sourceDescriptionFile.runWorkflowById(workflowIdArr.at(-1));
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
      if (this.isAnOperationId) {
        const multipleOpenAPISourceDescriptions = this.sourceDescriptions.filter(obj => obj.type === 'openapi');
        if (multipleOpenAPISourceDescriptions.length > 1) {

        } else {
          return multipleOpenAPISourceDescriptions[0]
        }
      }

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
