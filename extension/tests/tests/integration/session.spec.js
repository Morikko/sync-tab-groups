import TestManager from '../../utils/TestManager'
import Session from '../../examples/session'
import TestUtils from '../../utils/TestUtils';

describe("Session: ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  describe("addTabToGroup: ", ()=>{
    beforeAll(async function() {
      // Create Group
      this.length = 7;
      [this.id, this.group] = Session.createGroup({
        tabsLength: this.length,
        global: true,
        pinnedTabs: 0,
        active: 5,
        title: "Debug Session.addTabToGroup",
      });
      this.groupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(this.id);
      // Open
      this.windowId = await window.Background.WindowManager.openGroupInNewWindow(this.id);
    });

    afterAll(async function() {
      // Close Window
      await window.Background.WindowManager.closeWindowFromGroupId(this.id);
      // Remove Group
      await window.Background.GroupManager.removeGroupFromId(this.id)
    });


    it("Add Normal Tab To Open Group", async function() {
      let tab = Session.getFakeTab();

      let group = window.Background.GroupManager.groups[this.groupIndex];
      let previousLength = group.tabs.length;

      await Session.addTabToGroup(this.id, tab);
      await TestUtils.waitAllTabsToBeLoadedInWindowId(this.windowId)

      expect(group.tabs.length).toEqual(previousLength+1);
      expect(group.tabs[group.tabs.length-1].url).toEqual(tab.url);
    });

    it("Add Pinned Tab To Open Group", async function() {
      window.Background.OptionManager.updateOption("pinnedTab-sync", true);
      let tab = Session.getFakeTab();
      tab.pinned = true;

      let group = window.Background.GroupManager.groups[this.groupIndex];
      let previousLength = group.tabs.length;

      await Session.addTabToGroup(this.id, tab);
      await TestUtils.waitAllTabsToBeLoadedInWindowId(this.windowId)

      let pinnedTabs = group.tabs.filter(tab => tab.pinned);

      expect(group.tabs.length).toEqual(previousLength+1);
      expect(pinnedTabs[pinnedTabs.length-1].url).toEqual(tab.url);
    });
  });
});
