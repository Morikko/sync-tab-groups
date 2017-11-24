/**
 * Class for managing a delayed task.
 * Allow to cancel a pending task and do it immediately
 * There is two modes for delaying task:
 *   1. DONE_AFTER_TIME: task is done after the delay, if a task is asked
     again, the previous one is canceled and replaced
 *   2. DONE_ONCE_PER_TIME: do the task at most 1 per delay, do it
     immediately when asked; wait the end of the previous task before doing the next one
 *
 * Don't use refId if single task (default: 0)
 */

var DelayedTasks = DelayedTasks || {};

DelayedTasks.DONE_AFTER_TIME = false;
DelayedTasks.DONE_ONCE_PER_TIME = true;

DelayedTasks.DelayedTasks = function(timeoutDelay = 10000, mode = DelayedTasks.DONE_AFTER_TIME) {
  this.delayedTasks = {};
  this.timeoutDelay = timeoutDelay;
  this.queuing = false;
  this.mode = mode;
}

// In object: {actionRef: {id: timeoutfunction} }

/**
 * Manage all the process of adding, removing or forcing a delayed taskRef
 * @param {String} taskAction - ASK, CANCEL or FORCE
 * @param {String} actionRef - see utils.js
 * @param {Number} groupId - ref inside the action group
 * @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
 */
DelayedTasks.DelayedTasks.prototype.manageDelayedTask = function(taskAction, delayedFunction, refId = 0) {
  switch (taskAction) {
    case DelayedTasks.ASK:
      this.addDelayedTask(delayedFunction,
        refId);
      break;
    case DelayedTasks.CANCEL:
      this.removeDelayedTask(refId);
      break;
    case DelayedTasks.FORCE:
      this.removeDelayedTask(refId);
      delayedFunction();
      break;
  }
};

/**
 * Add a delayed task for an a action with a specific id.
 * @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
 * @param {Number} refId (default:0) - ref inside the action group
 */
DelayedTasks.DelayedTasks.prototype.addDelayedTask = async function(delayedFunction, refId = 0) {

  if ( this.mode === DelayedTasks.DONE_AFTER_TIME) {
    this.addTimeoutTask(delayedFunction, refId);
  } else if ( this.mode === DelayedTasks.DONE_ONCE_PER_TIME) {
    this.addIntervalTask(delayedFunction, refId);
  }

};

/*
 * Add a task
 *  - Do the task at most 1 per delay, do it immediately when asked if delay already ended;
 *  - Wwait the end of the previous task before doing the next one
 */
DelayedTasks.DelayedTasks.prototype.addIntervalTask = async function(delayedFunction, refId = 0) {
  // Free: do it
  if (this.delayedTasks[refId] === undefined) {
    this.delayedTasks[refId] = 0;
    let a = performance.now();
    await delayedFunction();
    let total_time = performance.now() - a;

    let delay = this.timeoutDelay - total_time;
    delay = (delay<0) ? 0 : delay;

    // Wait the delay at least before allowing new task / redoing one
    this.delayedTasks[refId] = setTimeout(async() => {
      // If asked while waiting, do it now
      if (this.queuing) {
        this.queuing = false;
        this.removeDelayedTask(refId);
        this.addIntervalTask(delayedFunction);
      } else {
        this.removeDelayedTask(refId);
      }
    }, delay);

    // Already done; add it to the queue
  } else {
    this.queuing = true;
  }
}

/*
 * Add a task
 Task is done after the delay, if a task is asked
     again, the previous one is canceled and replaced
 */
DelayedTasks.DelayedTasks.prototype.addTimeoutTask = async function(delayedFunction, refId = 0) {
  // Already a task; remove it
  this.removeDelayedTask(refId);

  this.delayedTasks[refId] = setTimeout(async() => {
    await delayedFunction();
    this.removeDelayedTask(refId);
  }, this.timeoutDelay);
}

/**
 * If a task already exists, it is aborted.
 * @param {Number} refId (default:0) - ref inside the action group
 */
DelayedTasks.DelayedTasks.prototype.removeDelayedTask = function(refId = 0) {
  if (this.delayedTasks[refId] !== undefined) {
    if ( this.mode === DelayedTasks.DONE_AFTER_TIME ) {
      clearTimeout(this.delayedTasks[refId]);
    } else if ( this.mode === DelayedTasks.DONE_ONCE_PER_TIME ) {
      clearTimeout(this.delayedTasks[refId]);
    }
    delete(this.delayedTasks[refId]);
    this.queuing = false;
  }
};
