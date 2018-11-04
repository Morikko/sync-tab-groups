import DelayedTaskManager from './delayedtaskmanager'
import RepeatedTaskManager from './repeatedtaskmanager'

const TaskManager = {
  ...DelayedTaskManager,
  ...RepeatedTaskManager,
}

export default TaskManager