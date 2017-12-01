/** Tests: Move Tabs
 Pinned Tab
  1. Close -> Open
  2. Close -> Close
  3. Open -> Close
  4. Open -> Open
  5. Unfollow -> Open
  6. Unfollow -> Close
 Normal Tab
  1. Close -> Open
  2. Close -> Close
  3. Open -> Close
  4. Open -> Open
  5. Unfollow -> Open
  6. Unfollow -> Close
*/
var TestManager = TestManager || {};

TestManager.movetabs = function() {
  this.title = "Move tabs between groups";
  this.groups = GroupManager.groups;
  this.window_unsync = browser.windows.WINDOW_ID_NONE;
  this.window_sync = browser.windows.WINDOW_ID_NONE;
  this.window_sync_2 = browser.windows.WINDOW_ID_NONE;

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

      /*
      await TabManager.moveTabToGroup(
        GroupManager.groups(this.groupId_open).tabs[
            GroupManager.groups(this.groupId_open).tabs.length-1
        ],
        this.groupId_close
     );
     await Utils.wait(500);

     if ( ! (await TestManager.isWindowWithGoodTabs(this.windowId,
       (TestManager.GroupWithoutPinned_1()).tabs))
     ) {
       return this.return_result(TestManager.ERROR, "Can't swith: Normal -> Normal");
     }
     */

      return this.return_result(TestManager.DONE);
    } catch (e) {
      return this.return_result(TestManager.ERROR, "Error in function: " + e);
    }
  }

  this.set = async function() {
    // 2 groups: 1 open / 1 close
    // 2 windows: 1 sync/ 1 unsync
    this.window_unsync = await WindowManager.OnlyOneNewWindow(false);
    GroupManager.removeUnopenGroups();
    GroupManager.addGroups(Examples.move_tab_group);
    GroupManager.addGroups(Examples.move_tab_group);
    this.groupId_close = GroupManager.groups[1].id;
    this.groupId_open = GroupManager.groups[0].id;
    this.groupId_close_2 = GroupManager.groups[3].id;
    this.groupId_open_2 = GroupManager.groups[2].id;
    this.window_sync = await WindowManager.openGroupInNewWindow(GroupManager.groups[0].id);
    await TabManager.openListOfTabs(
      [
        TestManager.createTab("https://www.khanacademy.org/", "Khan Academy"),
        TestManager.createTab("https://www.coursera.org/", "Coursera"),
      ],
      this.window_unsync,
      true
    );
  }
}
