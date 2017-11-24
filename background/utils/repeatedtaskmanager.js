/**
 * Class for managing a delayed task.
 * Allow to cancel a pending task and do it immediately
 * There is two modes for delaying task:
 *   1. DONE_AFTER_TIME: task is done after the delay, if a task is asked
     again, the previous one is canceled and replaced
 *   2. DONE_ONCE_PER_TIME: do the task at most 1 per delay, do it
     immediately when asked; wait the end of the previous task before doing the next one
 *
 * Value for refId is:
    - undefinned: nothing in process
    - >= 0: timeout waiting
    - -1: specific action in process
 * Don't use refId if single task (default: 0)
 */

var TaskManager = TaskManager || {};

TaskManager.RepeatedTask = function(timeoutDelay = 10000) {
  this.delayedTasks = {};
  this.timeoutDelay = timeoutDelay;
  this.queuing = false;
}

// In object: {actionRef: {id: timeoutfunction} }

/**
 * Add a task
 *  - Do the task at most 1 per delay, do it immediately when asked if delay already ended;
 *  - Wwait the end of the previous task before doing the next one
 * @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
 * @param {Number} refId (default:0) - ref inside the action group
 */
TaskManager.RepeatedTask.prototype.add = async function(delayedFunction, force = false, refId = 0) {

  try {
    // Free: do it OR Force to do it
    if (this.delayedTasks[refId] === undefined ||
      (this.delayedTasks[refId] >= 0 && force)) {

      // Force to do
      if (this.delayedTasks[refId] >= 0 && force) {
        this.remove(refId);
      }

      this.delayedTasks[refId] = -1;
      let a = performance.now();
      await delayedFunction();
      let total_time = performance.now() - a;

      let delay = this.timeoutDelay - total_time;
      delay = (delay < 0) ? 0 : delay;

      // Wait the delay at least before allowing new task / redoing one
      this.delayedTasks[refId] = setTimeout(async() => {
        // If asked while waiting, do it now
        if (this.queuing) {
          this.queuing = false;
          this.remove(refId);
          this.add(delayedFunction);
        } else {
          this.remove(refId);
        }
      }, delay);
      // Already done; add it to the queue
    } else {
      this.queuing = true;
    }
  } catch (e) {
    this.remove(refId);
    let msg = "DelayedTask.DelayedTask.prototype.addIntervalTask failed on " + delayedFunction + " with error: " + e;
    console.error(msg);
    return msg;
  }
};

/**
 * If a task already exists, it is aborted.
 * @param {Number} refId (default:0) - ref inside the action group
 */
TaskManager.RepeatedTask.prototype.remove = function(refId = 0) {
  if (this.delayedTasks[refId] !== undefined) {
    clearTimeout(this.delayedTasks[refId]);
    delete(this.delayedTasks[refId]);
    this.queuing = false;
  }
};
