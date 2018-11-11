import TestHelper from '../../utils/TestHelper'
import TestConfig from '../../utils/TestConfig'
import tabGroupsMatchers from '../../utils/tabGroupsMatchers'
import Session from '../../examples/session'
import TestUtils from '../../utils/TestUtils';

describe("window.Background.WindowManager: ", ()=>{

  // Keep previous states
  beforeAll(TestHelper.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestHelper.initIntegrationAfterAll());

  describe("Integration", ()=>{

    describe(" Normal Window: ", ()=>{
      beforeAll(async function() {
        jasmine.addMatchers(tabGroupsMatchers);
        window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
        [this.id, this.group] = Session.createGroup({
          tabsLength: 5,
          global: true,
          pinnedTabs: 0,
          active: -1,
          title: "Debug Integration",
        });
        this.groupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(this.id);

        this.windowId = await window.Background.WindowManager.openGroupInNewWindow(this.id);
        await TestUtils.splitOnHalfScreen(this.windowId);

        await window.Background.Utils.wait(500);
      }, TestConfig.TIMEOUT);

      afterAll(async function() {
        if (this.windowId)
          await browser.windows.remove(this.windowId);
        if (window.Background.GroupManager.getGroupIndexFromGroupId(this.id, {error: false}) >= 0)
          await window.Background.GroupManager.removeGroupFromId(this.id);
      });

      it("Desassociate Windows", async function() {
        let previousLength = window.Background.GroupManager.groups.length;

        await window.Background.GroupManager.removeGroupFromId(this.id);
        await TestUtils.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

        TestUtils.resetActiveProperties(tabs);
        TestUtils.resetActiveProperties(this.group.tabs);

        expect(previousLength).toEqual(window.Background.GroupManager.groups.length+1);
        expect(window.Background.GroupManager.getGroupIndexFromGroupId(this.id, {error: false})).toEqual(-1);
        expect(tabs).toEqualTabs(this.group.tabs);

        this.id = undefined;
      });

      it("Associate Windows", async function() {
        let previousLength = window.Background.GroupManager.groups.length;

        let id = await window.Background.WindowManager.integrateWindow(this.windowId, {even_new_one: true});

        expect(id).toBeGreaterThan(-1);

        let groupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false});

        expect(groupIndex).not.toEqual(-1);

        let tabs = window.Background.Utils.getCopy(window.Background.GroupManager.groups[groupIndex].tabs);

        TestUtils.resetActiveProperties(tabs);

        expect(previousLength).toEqual(window.Background.GroupManager.groups.length-1);
        expect(tabs).toEqualTabs(this.group.tabs);

        await window.Background.GroupManager.removeGroupFromId(id);
      });
    });
  });

  describe("OnNewWindowOpen: ", ()=>{

    beforeEach(function() {
      this.windowId = browser.windows.WINDOW_ID_NONE;
    });

    afterEach(async function() {
      if (this.windowId !== browser.windows.WINDOW_ID_NONE) {
        let id;
        if ((id = window.Background.GroupManager.getGroupIdInWindow(this.windowId, {error: false})) >= 0) { // Remove group
          await window.Background.GroupManager.removeGroupFromId(id);
        }
        // Close window
        await browser.windows.remove(this.windowId);
      }
    });

    describe("Normal Window", function() {

      it("Visible", async function() {
        window.Background.OptionManager.updateOption("groups-syncNewWindow", true);
        window.Background.OptionManager.updateOption("privateWindow-sync", true);
        let previousLength = window.Background.GroupManager.groups.length;

        this.windowId = (await browser.windows.create()).id;
        await window.Background.Utils.wait(1200);

        expect(window.Background.GroupManager.groups.length).toEqual(previousLength+1);
        let lastGroup = window.Background.GroupManager.groups[window.Background.GroupManager.groups.length-1];

        expect(lastGroup.title).toBe("");
        expect(lastGroup.tabs.length).toBe(1);
      });

      it("Invisible", async function() {
        window.Background.OptionManager.updateOption("privateWindow-sync", true);
        window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
        let previousLength = window.Background.GroupManager.groups.length;

        this.windowId = (await browser.windows.create()).id;
        await window.Background.Utils.wait(1200);

        expect(window.Background.GroupManager.groups.length).toEqual(previousLength);
      });
    });

  });

  describe("OpenGroupInNewWindow: ", ()=>{

    beforeEach(function() {
      window.Background.OptionManager.updateOption("groups-syncNewWindow", true);

      // Create Group
      this.length = 7;
      [this.id, this.group] = Session.createGroup({
        tabsLength: this.length,
        global: true,
        pinnedTabs: 0,
        active: 5,
        title: "Debug window.Background.WindowManager.OpenGroupInNewWindow",
      });
      this.groupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(this.id);
    });

    afterEach(async function() {
      // Close Window
      await window.Background.WindowManager.closeWindowFromGroupId(this.id);
      // Remove Group
      await window.Background.GroupManager.removeGroupFromId(this.id)
    });

    it("Window is well associated with group", async function() {
      // Open
      let previousLength = window.Background.GroupManager.groups.length;
      this.windowId = await window.Background.WindowManager.openGroupInNewWindow(this.id);

      //No new window
      expect(window.Background.GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(window.Background.GroupManager.groups[this.groupIndex].windowId).toEqual(this.windowId);
    })

  });

})
