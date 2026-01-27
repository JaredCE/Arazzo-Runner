class ExecutionContext {
  constructor(type, id, workflowIndex, stepIndex, workflowId, stepId, workflow) {
    this.type = type; // 'workflow' or 'step'
    this.id = id;
    this.workflowIndex = workflowIndex;
    this.stepIndex = stepIndex;
    this.workflowId = workflowId;
    this.stepId = stepId;
    this.timestamp = Date.now();
    this.retryCount = 0;
    this.isRetrying = false;
    this.workflow = workflow;
  }
}

module.exports = ExecutionContext;
