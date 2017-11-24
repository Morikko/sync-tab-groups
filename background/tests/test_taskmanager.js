/** Tests:
* TaskManager.DelayedTask - TestManager.delayedtask
* TaskManager.RepeatedTask - TestManager.repeatedtask
*/

var TestManager = TestManager || {};

TestManager.delayedtask = function() {
  this.title = "DelayedTask tester";
  this.delay = new TaskManager.DelayedTask(100);
  this.counter = 0;
  this.add_count = () =>{
    this.counter++;
  };

  this.return_result = function ( code, msg="" ) {
    return TestManager.Results(
      code,
      this.title,
      msg,
      !code? {
        delay: this.delay,
        counter: this.counter
      }: {}
    )
  };

  this.test = async function( ) {
    try {
      // ASK action
      this.delay.manage(TaskManager.ASK, this.add_count);

      await Utils.wait(50);
      if ( this.counter !== 0 ) {
        return this.return_result(TestManager.ERROR, "Didn't wait with simple ask");
      }

      await Utils.wait(60);
      if ( this.counter !== 1 ) {
        return this.return_result(TestManager.ERROR, "Didn't do the task after delay");
      }

      // CANCEL
      this.delay.manage(TaskManager.ASK, this.add_count);
      this.delay.manage(TaskManager.CANCEL, this.add_count);

      await Utils.wait(110);
      if ( this.counter !== 1 ) {
        return this.return_result(TestManager.ERROR, "Didn't cancel task");
      }

      // FORCE
      this.delay.manage(TaskManager.ASK, this.add_count);
      this.delay.manage(TaskManager.FORCE, this.add_count);
      if ( this.counter !== 2 ) {
        return this.return_result(TestManager.ERROR, "Didn't force task");
      }
      await Utils.wait(110);
      if ( this.counter !== 2 ) {
        return this.return_result(TestManager.ERROR, "Didn't cancel task after forcing");
      }

      // ASK -> replace previous
      this.delay.manage(TaskManager.ASK, this.add_count);
      this.delay.manage(TaskManager.ASK, this.add_count);

      await Utils.wait(110);
      if ( this.counter !== 3 ) {
        return this.return_result(TestManager.ERROR, "Didn't cancel task after reasking");
      }

      return this.return_result(TestManager.DONE);
    } catch ( e ) {
      return this.return_result(TestManager.ERROR, "Error in function: " + e);
    }
  }
}

TestManager.repeatedtask = function() {
  this.title = "RepeatedTask tester";
  this.delay = new TaskManager.RepeatedTask(100);
  this.counter = 0;
  this.add_count = () =>{
    this.counter++;
  };
  this.add_slow_count = async() =>{
    await Utils.wait(200);
    this.counter++;
  };

  this.return_result = function ( code, msg="" ) {
    return TestManager.Results(
      code,
      this.title,
      msg,
      !code? {
        delay: this.delay,
        counter: this.counter
      }: {}
    )
  };

  this.test = async function( ) {
    try {
      // Done immediately and not done again
      this.delay.add(this.add_count);
      await Utils.wait(10);
      if ( this.counter !== 1 ) {
        return this.return_result(TestManager.ERROR, "Didn't do the task immediately");
      }

      await Utils.wait(100);
      if ( this.counter !== 1 ) {
        return this.return_result(TestManager.ERROR, "Did it again when don't have to");
      }

      // Done again after delay if asked
      this.delay.add(this.add_count);
      this.delay.add(this.add_count);

      await Utils.wait(10);
      if ( this.counter !== 2 ) {
        return this.return_result(TestManager.ERROR, "Didn't do the task immediately");
      }
      await Utils.wait(110);
      if ( this.counter !== 3 ) {
        return this.return_result(TestManager.ERROR, "Didn't do the task in queue");
      }
      // Wait tempo
      await Utils.wait(100);

      // Manage overdelay
      this.delay.add(this.add_slow_count);
      this.delay.add(this.add_slow_count);

      await Utils.wait(110);
      if ( this.counter !== 3 ) {
        return this.return_result(TestManager.ERROR, "Did the overdelay task to early");
      }
      await Utils.wait(100);
      if ( this.counter !== 4 ) {
        return this.return_result(TestManager.ERROR, "Didn't do the overdelay task");
      }
      await Utils.wait(210);
      if ( this.counter !== 5 ) {
        return this.return_result(TestManager.ERROR, "Didn't do the task in queue after overdelay");
      }


      return this.return_result(TestManager.DONE);
    } catch ( e ) {
      return this.return_result(TestManager.ERROR, "Error in function: " + e);
    }
  }
}

TestManager.allTests.push(TestManager.delayedtask);
TestManager.allTests.push(TestManager.repeatedtask);
