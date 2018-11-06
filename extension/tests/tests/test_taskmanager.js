/** Tests:
* TODO deprecated: To write for jasmine
* TASKMANAGER_CONSTANTS.DelayedTask - TestManager.delayedtask
* TASKMANAGER_CONSTANTS.RepeatedTask - TestManager.repeatedtask
*/

var TestConfig = TestConfig || {};

TestConfig.delayedtask = function() {
  this.title = "DelayedTask tester";
  this.delay = new TASKMANAGER_CONSTANTS.DelayedTask(100);
  this.counter = 0;
  this.add_count = () =>{
    this.counter++;
  };

  this.return_result = function ( code, msg="" ) {
    return TestConfig.Results(
      code,
      this.title,
      msg,
      {
        delay: this.delay,
        counter: this.counter
      }
    )
  };

  this.test = async function( ) {
    try {
      // ASK action
      this.delay.manage(TASKMANAGER_CONSTANTS.ASK, this.add_count);

      await Utils.wait(50);
      if ( this.counter !== 0 ) {
        return this.return_result(TestConfig.ERROR, "Didn't wait with simple ask");
      }

      await Utils.wait(60);
      if ( this.counter !== 1 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task after delay");
      }

      // CANCEL
      this.delay.manage(TASKMANAGER_CONSTANTS.ASK, this.add_count);
      this.delay.manage(TASKMANAGER_CONSTANTS.CANCEL, this.add_count);

      await Utils.wait(110);
      if ( this.counter !== 1 ) {
        return this.return_result(TestConfig.ERROR, "Didn't cancel task");
      }

      // FORCE
      this.delay.manage(TASKMANAGER_CONSTANTS.ASK, this.add_count);
      this.delay.manage(TASKMANAGER_CONSTANTS.FORCE, this.add_count);
      if ( this.counter !== 2 ) {
        return this.return_result(TestConfig.ERROR, "Didn't force task");
      }
      await Utils.wait(110);
      if ( this.counter !== 2 ) {
        return this.return_result(TestConfig.ERROR, "Didn't cancel task after forcing");
      }

      // ASK -> replace previous
      this.delay.manage(TASKMANAGER_CONSTANTS.ASK, this.add_count);
      this.delay.manage(TASKMANAGER_CONSTANTS.ASK, this.add_count);

      await Utils.wait(110);
      if ( this.counter !== 3 ) {
        return this.return_result(TestConfig.ERROR, "Didn't cancel task after reasking");
      }

      return this.return_result(TestConfig.DONE);
    } catch ( e ) {
      return this.return_result(TestConfig.ERROR, "Error in function: " + e);
    }
  }
}

TestConfig.repeatedtask = function() {
  this.title = "RepeatedTask tester";
  this.delay = new TASKMANAGER_CONSTANTS.RepeatedTask(100);
  this.counter = 0;
  this.add_count = () =>{
    this.counter++;
  };
  this.add_slow_count = async() =>{
    await Utils.wait(200);
    this.counter++;
  };

  this.return_result = function ( code, msg="" ) {
    return TestConfig.Results(
      code,
      this.title,
      msg,
      {
        delay: this.delay,
        counter: this.counter
      }
    )
  };

  this.test = async function( ) {
    try {
      this.delay = new TASKMANAGER_CONSTANTS.RepeatedTask(100);
      // Done immediately and not done again
      this.delay.add(this.add_count);
      await Utils.wait(10);
      if ( this.counter !== 1 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task immediately");
      }

      await Utils.wait(100);
      if ( this.counter !== 1 ) {
        return this.return_result(TestConfig.ERROR, "Did it again when don't have to");
      }

      // Done again after delay if asked
      this.delay.add(this.add_count);
      this.delay.add(this.add_count);

      await Utils.wait(10);
      if ( this.counter !== 2 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task immediately");
      }
      await Utils.wait(110);
      if ( this.counter !== 3 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task in queue");
      }
      // Wait tempo
      await Utils.wait(100);

      // Manage overdelay
      this.delay.add(this.add_slow_count);
      this.delay.add(this.add_slow_count);

      await Utils.wait(110);
      if ( this.counter !== 3 ) {
        return this.return_result(TestConfig.ERROR, "Did the overdelay task to early");
      }
      await Utils.wait(100);
      if ( this.counter !== 4 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the overdelay task");
      }
      await Utils.wait(210);
      if ( this.counter !== 5 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task in queue after overdelay");
      }

      // Force
      this.delay = new TASKMANAGER_CONSTANTS.RepeatedTask(100);
      this.delay.add(this.add_count);
      await Utils.wait(10);
      this.delay.add(this.add_count, force=true);
      await Utils.wait(10);
      if ( this.counter !== 7 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task forced");
      }

      this.delay.add(this.add_count);
      if ( this.counter !== 7 ) {
        return this.return_result(TestConfig.ERROR, "Didn't respect the time");
      }
      await Utils.wait(100);
      if ( this.counter !== 8 ) {
        return this.return_result(TestConfig.ERROR, "Didn't do the task in queue after force");
      }

      return this.return_result(TestConfig.DONE);
    } catch ( e ) {
      return this.return_result(TestConfig.ERROR, "Error in function: " + e);
    }
  }
}
