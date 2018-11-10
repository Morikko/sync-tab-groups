import TestManager from '../../utils/TestManager'
import tabGroupsMatchers from '../../utils/tabGroupsMatchers'
import Session from '../../examples/session'

describe("End of Groups - ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function() {
    window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
    window.Background.OptionManager.updateOption("pinnedTab-sync", true);
    jasmine.addMatchers(tabGroupsMatchers);
    this.length = 3;
    this.groups = [];
    for (let i=0; i<2; i++) {
      let id, group;
      [id, group] = Session.createGroup({
        tabsLength: this.length,
        global: true,
        pinnedTabs: i,
        active: 5,
        title: "Debug Select Groups " + i,
      });
      this.groupIndex =
      this.groups.push({
        id: id,
        group: group,
        groupIndex: window.Background.GroupManager.getGroupIndexFromGroupId(id),
      });
    }

    this.windowId = await window.Background.WindowManager.openGroupInNewWindow(this.groups[0].id);
    await TestManager.splitOnHalfScreen(this.windowId);
  }, TestManager.TIMEOUT);

  afterAll(async function() {
    // Close Window
    if (await window.Background.WindowManager.isWindowIdOpen(this.windowId))
      await browser.windows.remove(this.windowId);
    // Remove Group
    for (let group of this.groups) {
      if (window.Background.GroupManager.getGroupIndexFromGroupId(group.id, {error: false}) >= 0)
        await window.Background.GroupManager.removeGroupFromId(group.id);
    }
  });

  describe("Closing - ", ()=>{

    it("Current Window", async function() {
      let previousLength = window.Background.GroupManager.groups.length;
      await window.Background.WindowManager.closeGroup(this.groups[0].id);

      let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

      let blank = [Session.createTab(Session.newTab)];

      TestManager.resetActiveProperties(tabs);
      TestManager.resetIndexProperties(blank);

      expect(tabs).toEqualTabs(blank);
      expect(previousLength).toEqual(window.Background.GroupManager.groups.length);
      expect(window.Background.GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
    });

    it("Another Window", async function() {
      let windowId = await window.Background.WindowManager.openGroupInNewWindow(this.groups[0].id);
      await TestManager.splitOnHalfScreen(windowId);

      let previousLength = window.Background.GroupManager.groups.length;
      let windowsNumber = (await browser.windows.getAll()).length;

      try {
        await browser.windows.update(this.windowId, {
          focused: true,
        });
        await window.Background.Utils.wait(500);

        await window.Background.WindowManager.closeGroup(this.groups[0].id);
        await window.Background.Utils.wait(500);
      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      }

      expect(previousLength).toEqual(window.Background.GroupManager.groups.length);
      expect(windowsNumber).toEqual((await browser.windows.getAll()).length+1);
      expect(window.Background.GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
    }, TestManager.TIMEOUT);

    // With Pinned Tabs not to close ..
    it("With Pinned Tabs To Keep", async function() {
      let previousLength = window.Background.GroupManager.groups.length;

      window.Background.OptionManager.updateOption("pinnedTab-sync", false);

      let pinnedTab = [window.Background.GroupManager.groups[this.groups[1].groupIndex].tabs[0]];

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.groups[1].id);
      await window.Background.WindowManager.closeGroup(this.groups[1].id);

      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
      let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId, {
        withPinned: true,
      });

      TestManager.resetActiveProperties(tabs);
      TestManager.resetActiveProperties(pinnedTab);

      window.Background.OptionManager.updateOption("pinnedTab-sync", true);

      expect(tabs).toEqualTabs(pinnedTab);
      expect(previousLength).toEqual(window.Background.GroupManager.groups.length);
      expect(window.Background.GroupManager.groups[this.groups[1].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
    });
  });

  describe("Removing - ", ()=>{
    it("Current Window", async function() {
      let previousLength = window.Background.GroupManager.groups.length;

      try {
        await browser.windows.update(this.windowId, {
          focused: true,
        });
        await window.Background.Utils.wait(500);

        await window.Background.WindowManager.switchGroupInCurrentWindow(this.groups[0].id);
        await window.Background.WindowManager.removeGroup(this.groups[0].id);
      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      }

      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)
      let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

      let blank = [Session.createTab(Session.newTab)];

      TestManager.resetActiveProperties(tabs);
      TestManager.resetIndexProperties(blank);

      expect(tabs).toEqualTabs(blank);
      expect(previousLength).toEqual(window.Background.GroupManager.groups.length+1);
      expect(window.Background.GroupManager.getGroupIndexFromGroupId(this.groups[0].id, {error: false})).toEqual(-1);
    }, TestManager.TIMEOUT);

    it("Another Window", async function() {
      let windowId = await window.Background.WindowManager.openGroupInNewWindow(this.groups[1].id);
      await TestManager.splitOnHalfScreen(windowId);
      let previousLength = window.Background.GroupManager.groups.length;
      let windowsNumber = (await browser.windows.getAll()).length;

      try {
        await browser.windows.update(this.windowId, {
          focused: true,
        });
        await window.Background.Utils.wait(500);

        await window.Background.WindowManager.removeGroup(this.groups[1].id);
      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      }
      expect(previousLength).toEqual(window.Background.GroupManager.groups.length+1);
      expect(windowsNumber).toEqual((await browser.windows.getAll()).length+1);
      expect(window.Background.GroupManager.getGroupIndexFromGroupId(this.groups[1].id, {error: false})).toEqual(-1);

      if (await window.Background.WindowManager.isWindowIdOpen(windowId)) {
        await browser.windows.remove(windowId);
      }

    }, TestManager.TIMEOUT);
  });
});
