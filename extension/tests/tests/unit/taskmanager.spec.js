import Utils from '../../../background/utils/utils'
import TASKMANAGER_CONSTANTS from '../../../background/utils/TASKMANAGER_CONSTANTS'

// Note: the test specs are old and probably not perfect

function Tasks() {
  this.counter = 0;
  this.add_count = () =>{
    this.counter++;
  };
  this.add_slow_count = async() =>{
    await Utils.wait(200);
    this.counter++;
  };
}

fdescribe('TaskManager', ()=>{
  it('in delayed mode should work', async()=>{
    const refTask = new Tasks()
    const delayedTaskManager = new window.Background.TaskManager.DelayedTask(100);

    // ASK
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.ASK, refTask.add_count);

    await Utils.wait(50);
    expect(refTask.counter).toBe(0) // Else: "Didn't wait with simple ask"

    await Utils.wait(60);
    expect(refTask.counter).toBe(1) // Else: "Didn't do the task after delay"

    // CANCEL
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.ASK, refTask.add_count);
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.CANCEL, refTask.add_count);

    await Utils.wait(110);
    expect(refTask.counter).toBe(1) // Else: "Didn't cancel task"

    // FORCE
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.ASK, refTask.add_count);
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.FORCE, refTask.add_count);

    expect(refTask.counter).toBe(2) // Else: "Didn't force task"

    await Utils.wait(110);
    expect(refTask.counter).toBe(2) // Else: "Didn't cancel task after forcing"

    // ASK -> replace previous
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.ASK, refTask.add_count);
    delayedTaskManager.manage(TASKMANAGER_CONSTANTS.ASK, refTask.add_count);

    await Utils.wait(110);
    expect(refTask.counter).toBe(3) // Else: "Didn't cancel task after reasking
  })

  it('in repeated mode should work', async()=>{
    const refTask = new Tasks()
    let repeatedTaskManager = new window.Background.TaskManager.RepeatedTask(100);

    // Done immediately and not done again
    repeatedTaskManager.add(refTask.add_count);
    await Utils.wait(10);
    expect(refTask.counter).toBe(1) // Else: "Didn't do the task immediately"

    await Utils.wait(100);
    expect(refTask.counter).toBe(1) // Else: "Did it again when don't have to"

    // Done again after delay if asked
    repeatedTaskManager.add(refTask.add_count);
    repeatedTaskManager.add(refTask.add_count);

    await Utils.wait(10);
    expect(refTask.counter).toBe(2) // Else: "Didn't do the task immediately"

    await Utils.wait(110);
    expect(refTask.counter).toBe(3) // Else: "Didn't do the task in queue"

    await Utils.wait(100);

    // Manage overdelay
    repeatedTaskManager.add(refTask.add_slow_count);
    repeatedTaskManager.add(refTask.add_slow_count);

    await Utils.wait(110);
    expect(refTask.counter).toBe(3) // Else: "Did the overdelay task too early"

    await Utils.wait(100);
    expect(refTask.counter).toBe(4) // Else:  "Didn't do the overdelay task"

    await Utils.wait(210);
    expect(refTask.counter).toBe(5) // Else: "Didn't do the task in queue after overdelay"

    // Force
    repeatedTaskManager = new window.Background.TaskManager.RepeatedTask(100);
    repeatedTaskManager.add(refTask.add_count);
    await Utils.wait(10);
    repeatedTaskManager.add(refTask.add_count, true);
    await Utils.wait(10);
    expect(refTask.counter).toBe(7) // Else: "Didn't do the task forced"

    repeatedTaskManager.add(refTask.add_count);
    expect(refTask.counter).toBe(7) // Else: "Didn't respect the time"

    await Utils.wait(100);
    expect(refTask.counter).toBe(8) // Else: "Didn't do the task in queue after force"
  })
})