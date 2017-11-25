/** Tests: Change group
* Option: sync pinned
  1. Normal -> Normal
  2. Normal -> Pinned
  3. Pinned -> Pinned
  4. Pinned -> Normal
* Option: sync pinned
  1. Normal -> Normal
  2. Normal -> Pinned
  3. Pinned -> Pinned
  4. Pinned -> Normal
*/
var TestManager = TestManager || {};

// TODO: not working properly
TestManager.switchgroup_pinnedsync = function() {
  this.title = "Switch Group with Pin Sync tester";
  this.groups = GroupManager.groups;
  this.windowId = browser.windows.WINDOW_ID_NONE;

  this.return_result = function(code, msg = "") {
    return TestManager.Results(
      code,
      this.title,
      msg, {
        groups: GroupManager.groups
      }
    )
  };

  this.test = async function() {
    try {
      await this.set();

      let group_ref = TestManager.GroupWithoutPinned_1();
      GroupManager.groups.push(TestManager.GroupWithoutPinned_1());
      await WindowManager.selectGroup(group_ref.id);
      await Utils.wait(2000);

      if ( ! (await TestManager.isWindowWithGoodTabs(this.windowId,
        (TestManager.GroupWithoutPinned_1()).tabs))
      ) {
        return this.return_result(TestManager.ERROR, "Can't swith: Normal -> Normal");
      }

      return this.return_result(TestManager.DONE);
    } catch (e) {
      return this.return_result(TestManager.ERROR, "Error in function: " + e);
    }
  }

  this.set = async function() {
    OptionManager.updateOption("pinnedTab-sync", true);
    this.windowId = await WindowManager.OnlyOneNewWindow();
    GroupManager.removeUnopenGroups();
  }
}

TestManager.allTests.push(TestManager.switchgroup_pinnedsync);
TestManager.currentTests.push(TestManager.switchgroup_pinnedsync);
