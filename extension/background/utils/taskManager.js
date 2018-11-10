import DelayedTaskManager from './delayedtaskmanager'
import RepeatedTaskManager from './repeatedtaskmanager'

const TaskManager = {
  DelayedTask: DelayedTaskManager,
  RepeatedTask: RepeatedTaskManager,
}
window.TaskManager = TaskManager;

export default TaskManager