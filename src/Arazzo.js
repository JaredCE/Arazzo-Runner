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
    this.inputFile = inputFile;
    await this.getSourceDescriptions();
    await this.getWorkflows();

    console.log("Starting Workflows");

    await this.startWorkflows();

    console.log("All Workflows run");
  }

  /**
   * @private
   * @param {number} index
   */
  async startWorkflows(index = 0) {
    this.workflowIndex = index;
    if (index <= this.workflows.length - 1) {
      this.abortWorkflowController = new AbortController();

      console.log("Running workflow index", index);
      try {
        await this.runWorkflow(index);
        await this.startWorkflows(index + 1);
      } catch (err) {
        console.log("Caught");
        // console.error(err);

        if (err.name === "AbortError") {
          if (err.goto) {
            console.log("goto error");
            await this.handleGotoRule(err.goto);
          }
        } else {
          throw err;
        }
      }
      // await this.runWorkflow(index).catch((err) => {
      //   console.log("caught", err);
      //   if (err.name === "AbortError") {
      //   } else {
      //     throw err;
      //   }
      // });

      // await this.startWorkflows(index + 1);
    } else {
      console.log("no more workflows");
    }
    // this.workflowIndex = index;
    // const continueRunning = await this.runWorkflow(index);

    // if (continueRunning.noMoreWorkflows === false) {
    //   await this.startWorkflows(index + 1);
    // }
  }

  /**
   * @private
   * @param {number} index
   * @returns
   */
  async runWorkflow(index) {
    if (this.abortWorkflowController.signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const rules = new Rules(this.expression);
    const workflow = await this.JSONPickerToIndex("workflows", index);

    if (workflow) {
      console.log(`Running Workflow: ${workflow.workflowId}`);
      this.logger.notice(`Running Workflow: ${workflow.workflowId}`);

      this.workflow = workflow;

      if (workflow.dependsOn) {
        console.log(`${workflow.workflowId} has dependsOn`);
        // console.log(this.expression.context);
        await this.runDependsOnWorkflows();
        // console.log(this.expression.context);
        console.log("end dependsOn");
        this.workflow = workflow;
      }

      this.inputs = await this.inputFile.getWorkflowInputs(
        this.workflow.workflowId,
        this.workflow.inputs,
      );

      this.expression.addToContext("inputs", this.inputs);

      this.workflow.rules = rules;

      if (this.workflow.onSuccess) {
        this.workflow.rules.setWorkflowSuccess(this.workflow.onSuccess);
      }

      if (this.workflow.onFailure) {
        this.workflow.rules.setWorkflowFailures(this.workflow.onFailure);
      }

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

      return { noMoreWorkflows: false };
    } else {
      this.logger.notice(`All workflows have run`);

      return { noMoreWorkflows: true };
    }
  }

  /**
   * @private
   */
  async runDependsOnWorkflows() {
    console.log("depends on workflows running first");
    for await (const workflowId of this.workflow.dependsOn) {
      const workflowIndex = this.findWorkflowIndexByWorkflowId(workflowId);

      if (workflowIndex !== -1) {
        await this.runWorkflow(workflowIndex);
      }
    }
    console.log("all dependsOn have been run");
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
      console.log("Running Step Index:", index);
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
      console.log(`running step: ${step.stepId}`);
      if (this.step.onSuccess) {
        this.workflow.rules.setStepSuccesses(this.step.onSuccess);
      }

      if (this.step.onFailure) {
        this.workflow.rules.setStepFailures(this.step.onFailure);
      }

      this.logger.notice(`Running Step: ${this.step.stepId}`);

      await this.loadOperationData();
      console.log(this.openAPISteps);
      if (this.openAPISteps) {
        await this.runOpenAPIStep();
      }

      this.isAnOperationId = false;
      this.isAWorkflowId = false;
      this.isAnOperationPath = false;
      this.openAPISteps = false;

      return { noMoreSteps: false };
    } else {
      this.logger.notice(`All steps in ${this.workflow.workflowId} have run`);

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

      this.logger.notice(
        `Making a ${operation.operation.toUpperCase()} call to ${operation.url}`,
      );

      if (this.retryAfter) await sleep(this.retryAfter * 1000);

      console.log(`fetching: ${url}`);
      console.log(options);
      const response = await fetch(url, options);

      if (response.headers.has("retry-after")) {
        // assume seconds for now
        // this.retryAfter = response.headers.get("retry-after");
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        if (retryAfter !== null) {
          this.retryAfter = retryAfter;
        }
      }

      this.addParamsToContext(response.headers, "headers", "response");
      this.expression.addToContext("statusCode", response.status);

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
        console.log("did it pass criteria", passedSuccessCriteria);
        if (passedSuccessCriteria) {
          if (this.currentRetryRule) {
            if (this.retryContext.doNotDeleteRetryLimits) {
              console.log("running", this.retryLimits);
              this.retryLimits[this.currentRetryRule] = 0;
              console.log("now", this.retryLimits[this.currentRetryRule]);
            }
          }

          await this.dealWithPassedRule(response);
        } else {
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
    for (const criteriaObject of this.step.successCriteria) {
      if (criteriaObject?.type) {
      } else {
        const hasPassedCheck = this.expression.checkSimpleExpression(
          criteriaObject.condition,
        );
        if (hasPassedCheck) hasPassed.push(true);
      }
    }

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

    console.log("checking onSuccess rules");
    const whatNext = this.workflow.rules.runRules(true);
    console.log(whatNext);
    if (whatNext.endWorkflow) {
      this.workflowIndex += 1;
      // const index = this.workflowIndex + 1;

      console.log("ending workflow");
      this.abortWorkflowController.abort();
      throw new DOMException("Aborted", "AbortError");
      console.log("still here though");
      // this.abortStep = new AbortController();
      // this.abortSignal = this.abortStep.signal;

      // this.startWorkflows(index);
      // this.abortSignal.addEventListener("abort", () => {
      //   console.log("in the listener");
      // });
      // console.log(this.abortSignal.aborted);
      // console.log("back here");
    } else if (whatNext.goto) {
      console.log("goto command onSuccess");
      await this.gotoRule(whatNext);
      console.log("onSuccess");
      // if (whatNext.stepId) {
      //   // const stepIndex = this.workflow.steps.findIndex(
      //   //   (step) => step.stepId === whatNext.stepId,
      //   // );

      //   // if (stepIndex === -1) {
      //   //   throw new Error(`goto Step does not exist within current workflow`);
      //   // }
      //   const stepIndex = this.findStepIndexInWorkflowByStepId(whatNext.stepId);

      //   await this.runSteps(stepIndex);
      // } else {
      //   // const workflowId = this.expression.resolveExpression(
      //   //   whatNext.workflowId,
      //   // );

      //   // const workflowIndex = this.workflows.findIndex(
      //   //   (workflow) => workflow.workflowId === workflowId,
      //   // );

      //   // if (workflowIndex === -1) {
      //   //   throw new Error(
      //   //     `goto Workflow does not exist within current workflows`,
      //   //   );
      //   // }
      //   const workflowIndex = this.findWorkflowIndexByWorkflowId(
      //     whatNext.workflowId,
      //   );
      //   console.log("skipping to ", workflowIndex);
      //   await this.runWorkflow(workflowIndex);
      //   console.log("back at goto onSuccess");
      // }
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

    console.log("checking onFailed rules");
    const whatNext = this.workflow.rules.runRules();
    if (whatNext.endWorkflow) {
      this.workflowIndex += 1;
      // const index = this.workflowIndex + 1;

      console.log("ending workflow");
      this.abortWorkflowController.abort();
      throw new DOMException("Aborted", "AbortError");
      console.log("still here though");
    } else if (whatNext.goto) {
      console.log("goto command onFailure");
      await this.gotoRule(whatNext);
      console.log("onFailure");
      // if (whatNext.stepId) {
      //   // const stepIndex = this.workflow.steps.findIndex(
      //   //   (step) => step.stepId === whatNext.stepId,
      //   // );

      //   // if (stepIndex === -1) {
      //   //   throw new Error(`goto Step does not exist within current workflow`);
      //   // }
      //   //
      //   const stepIndex = this.findStepIndexInWorkflowByStepId(whatNext.stepId);

      //   await this.runSteps(stepIndex);
      // } else {
      //   const workflowIndex = this.findWorkflowIndexByWorkflowId(
      //     whatNext.workflowId,
      //   );
      //   console.log("skipping to ", workflowIndex);
      //   await this.runWorkflow(workflowIndex);
      //   console.log("back at goto onFailure");
      // }
    } else {
      console.log("we retry");
      await this.retryProcessing(whatNext);
    }
  }

  /**
   * @private
   * @param {*} gotoRule
   */
  async gotoRule(gotoRule) {
    if (gotoRule.stepId) {
      console.log("goto stepId");
      this.abortWorkflowController.abort();

      // Attach goto to the error so we can handle it
      const abortError = new DOMException("Aborted", "AbortError");
      abortError.goto = gotoRule;
      throw abortError;

      // const stepIndex = this.workflow.steps.findIndex(
      //   (step) => step.stepId === whatNext.stepId,
      // );

      // if (stepIndex === -1) {
      //   throw new Error(`goto Step does not exist within current workflow`);
      // }

      // comment at 8:11am 12 Jan
      // const stepIndex = this.findStepIndexInWorkflowByStepId(gotoRule.stepId);
      // console.log("skipping to step", stepIndex);
      // await this.runSteps(stepIndex);

      // this.abortStepsController.abort();
      // throw new DOMException("Aborted", "AbortError");
      // this.abortStepsController.abort();
      // throw new DOMException("Aborted", "AbortError");

      // comment at 8:11am 12 Jan
      // console.log("back at goto step");
    } else {
      const abortError = new DOMException("Aborted", "AbortError");
      abortError.goto = gotoRule;
      throw abortError;

      // const workflowId = this.expression.resolveExpression(
      //   whatNext.workflowId,
      // );

      // const workflowIndex = this.workflows.findIndex(
      //   (workflow) => workflow.workflowId === workflowId,
      // );

      // if (workflowIndex === -1) {
      //   throw new Error(
      //     `goto Workflow does not exist within current workflows`,
      //   );
      // }

      // comment at 8:11am 12 Jan
      // const workflowIndex = this.findWorkflowIndexByWorkflowId(
      //   gotoRule.workflowId,
      // );
      // console.log("skipping to workflow", workflowIndex);
      // await this.runWorkflow(workflowIndex);

      // this.abortStepsController.abort();
      // throw new DOMException("Aborted", "AbortError");
      // this.abortWorkflowController.abort();
      // throw new DOMException("Aborted", "AbortError");

      // comment at 8:11am 12 Jan
      // console.log("back at goto workflow");
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
    console.log(whatNext);
    this.retryContext = {
      doNotDeleteRetryLimits: true,
    };

    let shouldRunRule = true;
    this.currentRetryRule = whatNext.name;

    if (this.retrySet.has(whatNext.name)) {
      console.log("we are currently retrying this", whatNext.name);
      shouldRunRule = false;
    } else {
      console.log("never retried this", whatNext.name);
      this.retrySet.add(whatNext.name);
    }

    if (shouldRunRule) {
      Object.assign(this.retryLimits, {
        [whatNext.name]: whatNext.retryLimit,
      });

      if (whatNext.stepId || whatNext.workflowId) {
        console.log("need to run a workflow or step first");
        this.retryContext.doNotDeleteRetryLimits = false;
        if (whatNext.stepId) {
          console.log("need to run a step first");
          const stepIndex = this.findStepIndexInWorkflowByStepId(
            whatNext.stepId,
          );

          await this.runStep(stepIndex);
          console.log("step has run");
        } else {
          const workflowIndex = this.findWorkflowIndexByWorkflowId(
            whatNext.workflowId,
          );

          console.log("need to run a workflow first");
          await this.runWorkflow(workflowIndex);
          console.log("workflow has run");
        }
      }

      // this.retryContext.doNotDeleteRetryLimits = true;

      if (!this.retryAfter && whatNext.retryAfter)
        this.retryAfter = whatNext.retryAfter;

      // for (let i = 0; i < whatNext.retryLimit; i++) {
      do {
        console.log("retrying", this.retryLimits[whatNext.name]);
        let count = this.retryLimits[whatNext.name];
        console.log("calling runStep");
        await this.runStep(this.stepIndex);
        console.log("I am back here");

        if (this.retryLimits[whatNext.name] !== 0) {
          count--;
          this.retryLimits[whatNext.name] = count;
        }
      } while (this.retryLimits[whatNext.name] > 0);
      // }
    }

    if (this.retryLimits[whatNext.name] === 0)
      this.retrySet.delete(whatNext.name);

    console.log("I need to return here after retrying");
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
      // console.log(operationDetailParam);
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
        console.log("run the workflow we just found");
        await this.runWorkflowById(workflowIdArr.at(0));
      } else {
        this.sourceDescription.runWorkflowById(flowIdArr.at(-1));
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
      console.log("i am here");
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
    // console.log(this.expression.context)
    // this.expression.addToContext('sourceDescriptions', sourceDescriptions)
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
    console.log("i got back here");
  }
}

module.exports = Arazzo;
