/**
 * Class for managing a delayed task.
 * Allow to cancel a pending task and do it immediately
 * Task is done after the delay, if a task is asked
     again, the previous one is canceled and replaced
 *
 * Don't use refId if single task (default: 0)
 */

const TaskManager = {};

TaskManager.DelayedTask = function(timeoutDelay = 10000) {
  this.delayedTasks = {};
  this.timeoutDelay = timeoutDelay;
}

// In object: {actionRef: {id: timeoutfunction} }

/**
 * Manage all the process of adding, removing or forcing a delayed taskRef
 * @param {String} taskAction - ASK, CANCEL or FORCE
 * @param {String} actionRef - see utils.js
 * @param {Number} groupId - ref inside the action group
 * @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
 */
TaskManager.DelayedTask.prototype.manage = async function(taskAction, delayedFunction, refId = 0) {
  switch (taskAction) {
    case TaskManager.ASK:
      this.add(delayedFunction,
        refId);
      break;
    case TaskManager.CANCEL:
      this.remove(refId);
      break;
    case TaskManager.FORCE:
      this.remove(refId);
      await delayedFunction();
      break;
  }
};

/**
* Add a delayed task for an a action with a specific id.
Task is done after the delay, if a task is asked
    again, the previous one is canceled and replaced
 * @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
 * @param {Number} refId (default:0) - ref inside the action group
 */
TaskManager.DelayedTask.prototype.add = async function(delayedFunction, refId = 0) {

  // Already a task; remove it
  this.remove(refId);

  this.delayedTasks[refId] = setTimeout(async() => {
    await delayedFunction();
    this.remove(refId);
  }, this.timeoutDelay);

};

/**
 * If a task already exists, it is aborted.
 * @param {Number} refId (default:0) - ref inside the action group
 */
TaskManager.DelayedTask.prototype.remove = function(refId = 0) {
  if (this.delayedTasks[refId] !== undefined) {
    clearTimeout(this.delayedTasks[refId]);
    delete(this.delayedTasks[refId]);
    this.queuing = false;
  }
};

export default TaskManager