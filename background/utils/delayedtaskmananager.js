/**
 * Class for managing a delayed task.
 * Allow to cancel a pending task and do it immediately
 * There is two modes for delaying task:
 *  1. Overwritten: the previous task is forbidden and never done
 *  2. Limited: a next task is not delayed if a previous one is already waiting
 *    ---> 1 task done / Time out
 *
 * Don't use refId if single task (default: 0)
 */

var DelayedTasks = DelayedTasks || {};

DelayedTasks.DelayedTasks = function(timeoutDelay = 10000) {
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
DelayedTasks.DelayedTasks.prototype.manageDelayedTask = function(taskAction, delayedFunction, refId=0) {
  switch (taskAction) {
    case DelayedTasks.ASK:
      this.addDelayedTask(delayedFunction, true, refId);
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
* If a task already exists, it is aborted if Overwritten mode else nothing is done.
* @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
* @param {boolean} overwrite - true -> Overwritten mode else false -> Limited mode
* @param {Number} refId (default:0) - ref inside the action group
*/
DelayedTasks.DelayedTasks.prototype.addDelayedTask = function(delayedFunction, overwrite=false, refId=0) {
  this.removeDelayedTask(refId);

  this.delayedTasks[refId] = setTimeout(() => {
    delayedFunction();
    this.removeDelayedTask(refId);
  }, this.timeoutDelay);
};

/**
* If a task already exists, it is aborted.
* @param {Number} refId (default:0) - ref inside the action group
*/
DelayedTasks.DelayedTasks.prototype.removeDelayedTask = function(refId=0) {
  if (this.delayedTasks[refId] !== undefined) {
    clearTimeout(this.delayedTasks[refId]);
    delete(this.delayedTasks[refId]);
  }
};
