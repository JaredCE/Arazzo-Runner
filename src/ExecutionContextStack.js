class ExecutionContextStack {
  constructor() {
    this.stack = [];
    this.contextMap = new Map(); // Quick lookup by stepId or workflowId
  }

  push(context) {
    this.stack.push(context);
    this.contextMap.set(context.id, context);
    return context;
  }

  pop() {
    const context = this.stack.pop();
    if (context) {
      this.contextMap.delete(context.id);
    }
    return context;
  }

  peek() {
    return this.stack[this.stack.length - 1];
  }

  get current() {
    return this.peek();
  }

  get depth() {
    return this.stack.length;
  }

  // Find the context where we should return after retry completes
  findRetryOrigin() {
    // Walk backwards to find the first context that initiated a retry
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i].isRetrying) {
        return this.stack[i];
      }
    }
    return null;
  }

  // Get all contexts of a specific type
  getContextsByType(type) {
    return this.stack.filter(ctx => ctx.type === type);
  }

  // Check if we're already executing a specific workflow/step (prevent infinite loops)
  isAlreadyExecuting(type, id) {
    return this.stack.some(ctx => ctx.type === type && ctx.id === id);
  }

  clear() {
    this.stack = [];
    this.contextMap.clear();
  }

  // Serialize for debugging or persistence
  toJSON() {
    return this.stack.map(ctx => ({
      type: ctx.type,
      id: ctx.id,
      workflowIndex: ctx.workflowIndex,
      stepIndex: ctx.stepIndex,
      workflowId: ctx.workflowId,
      stepId: ctx.stepId,
      retryCount: ctx.retryCount,
      isRetrying: ctx.isRetrying,
      timestamp: ctx.timestamp
    }));
  }
}

module.exports = ExecutionContextStack;
