/**
 *
 */
var DelayedTasks = DelayedTasks || {};

DelayedTasks.timeoutDelay = 10000;

// In object: {actionRef: {id: timeoutfunction} }
DelayedTasks.init = function() {
  DelayedTasks.delayedTasks = new Object();
  DelayedTasks.delayedTasks[DelayedTasks.CLOSE_REFERENCE] = new Object();
  DelayedTasks.delayedTasks[DelayedTasks.REMOVE_REFERENCE] = new Object();
}

/**
 * Manage all the process of adding, removing or forcing a delayed taskRef
 * @param {String} taskRef - ASK, CANCEL or FORCE
 * @param {String} actionRef - see utils.js
 * @param {Number} groupId - ref inside the action group
 * @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
 */
DelayedTasks.manageDelayedTask = function(taskRef, actionRef, groupId, delayedFunction) {
  switch (taskRef) {
    case DelayedTasks.ASK:
      DelayedTasks.addDelayedTask(actionRef, groupId, delayedFunction);
      break;
    case DelayedTasks.CANCEL:
      DelayedTasks.removeDelayedTask(actionRef, groupId);
      break;
    case DelayedTasks.FORCE:
      DelayedTasks.removeDelayedTask(actionRef, groupId);
      delayedFunction();
      break;
  }
};

/**
* Add a delayed task for an a action with a specific id.
* If a task already exists, it is aborted.
* @param {String} actionRef - see utils.js
* @param {Number} groupId - ref inside the action group
* @param {Fucntion} delayedFunction- the delayed function to execute (without parameter)
*/
DelayedTasks.addDelayedTask = function(actionRef, groupId, delayedFunction) {
  DelayedTasks.removeDelayedTask(actionRef, groupId);

  DelayedTasks.delayedTasks[actionRef][groupId] = setTimeout(() => {
    delayedFunction();
    DelayedTasks.removeDelayedTask(actionRef, groupId);
  }, DelayedTasks.timeoutDelay);
};

/**
* If a task already exists, it is aborted.
* @param {String} actionRef - see utils.js
* @param {Number} groupId - ref inside the action group
*/
DelayedTasks.removeDelayedTask =
function(actionRef, groupId) {
  if (DelayedTasks.delayedTasks[actionRef][groupId] !== undefined) {
    clearTimeout(DelayedTasks.delayedTasks[actionRef][groupId]);
    delete(DelayedTasks.delayedTasks[actionRef][groupId]);
  }
};
