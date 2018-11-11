import TestManager from '../../utils/TestManager'
import Session from '../../examples/session'
import OPTION_CONSTANTS from '../../../background/core/OPTION_CONSTANTS'

describe("When Hidden Closing State is enabled, ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function() {
    window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
    this.windowId = await TestManager.openWindow();
  });

  // Keep test session clean in between :)
  afterEach(async function() {
    if (!window.Background.Utils.hasHideFunction()) return;
    await TestManager.clearWindow(this.windowId);
  });

  beforeEach(async function() {
    if (!window.Background.Utils.hasHideFunction()) return;
    window.Background.OptionManager.updateOption("groups-closingState", OPTION_CONSTANTS.CLOSE_HIDDEN);
    window.Background.OptionManager.updateOption("groups-discardedHide", false);
    await TestManager.clearWindow(this.windowId);
  });

  describe("window.Background.TabHidden.hideTab", ()=>{
    it(" hides a tab if it is possible and return true", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength,
        active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;

      const isHidden = await window.Background.TabHidden.hideTab(targetTabId);

      const targetTab = await browser.tabs.get(targetTabId);

      expect(targetTab.hidden).toBe(true);
      expect(isHidden).toBe(true);
      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength)

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).length).toBe(tabsLength-1);
    });

    it(" does nothing if it is impossible to hide and return false", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength,
        active: tabsLength-1,
        pinnedTabs: 1});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[0].id;

      const isHidden = await window.Background.TabHidden.hideTab(targetTabId);

      const targetTab = await browser.tabs.get(targetTabId);

      expect(targetTab.hidden).toBe(false);
      expect(isHidden).toBe(false);
      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength)

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).length).toBe(tabsLength);
    });
  });

  describe("window.Background.TabHidden.showTab", ()=>{
    it(" shows a tab if it is possible and return true", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength,
        active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;
      let targetTab;

      await browser.tabs.hide(targetTabId);
      targetTab = await browser.tabs.get(targetTabId);

      expect(targetTab.hidden).toBe(true);

      const isShown = await window.Background.TabHidden.showTab(targetTabId, this.windowId);
      targetTab = await browser.tabs.get(targetTabId);

      expect(targetTab.hidden).toBe(false);
      expect(isShown).toBe(true);
    });

    it(" does nothing if it is impossible to show and return false", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength,
        active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;
      let targetTab;

      await browser.tabs.hide(targetTabId);
      targetTab = await browser.tabs.get(targetTabId);

      expect(targetTab.hidden).toBe(true);

      await TestManager.removeTabs(targetTabId);

      const isShown = await window.Background.TabHidden.showTab(targetTabId, this.windowId);

      expect(isShown).toBe(false);
    });
  });

  describe("window.Background.TabManager.openListOfTabs", ()=>{
    it(" shows tabs previously hidden", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      });
      await window.Background.TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      await window.Background.TabManager.openListOfTabs(tabsToHide, this.windowId);

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).length).toBe(0)

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).length).toBe(tabsLength);

      const finalTabs = (await browser.tabs.query({windowId: this.windowId}))
        .map(tab => tab.id);
      tabsToHide.forEach(({id}) => {
        expect(finalTabs.indexOf(id)).not.toBe(-1);
      });
    });

    it(" shows tabs previously hidden and opens missing tabs", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: true,
      });
      await window.Background.TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      await window.Background.TabManager.openListOfTabs(tabsToHide, this.windowId);

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).length).toBe(0)

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).length).toBe(tabsLength);

      const finalTabs = (await browser.tabs.query({windowId: this.windowId}))
        .map(tab => tab.id);
      tabsToHide.forEach(({id}) => {
        expect(finalTabs.indexOf(id)).toBe(-1);
      });
    });
  });

  describe("window.Background.TabManager.removeTabs", ()=>{
    it(" hides tabs in the window", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      });

      await window.Background.TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).length).toBe(tabsLength-1)

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).length).toBe(1);
    });

    it(" hides tabs in the group and closes failing tabs", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: true,
      });

      await window.Background.TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength-1)

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).length).toBe(0);
    });
  });

  describe("window.Background.WindowManager.switchGroupInCurrentWindow", () => {

    beforeEach(async function() {
      [this.ids, this.groups] = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: 4,
        global: true,
        active: 1,
        title: "Debug switch Groups with hidden",
      });
      this.groups = this.ids.map((id) => window.Background.GroupManager.groups[
        window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: true})
      ]);
    });

    afterEach(async function() {
      for (let id of this.ids) {
        if (window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0)
          await window.Background.GroupManager.removeGroupFromId(id);
      }
    });

    it("should open the group and close the previous tabs.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      await TestManager.waitWindowToBeFocused(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      });

      expect(previousTabs.length).toBe(0);
    });

    it("should close a group by hidding current tabs.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      await TestManager.waitWindowToBeFocused(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousGroupTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const currentHiddenTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).map(tab => tab.id);

      expect(currentHiddenTabIds.length).toBe(previousGroupTabs.length);
      previousGroupTabs.forEach(tab => {
        expect(currentHiddenTabIds.indexOf(tab.id)).not.toBe(-1);
      });
    });

    it("should open a group by showing hidden tabs.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      await TestManager.waitWindowToBeFocused(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousGroupTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const currentTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).map(tab => tab.id);

      expect(currentTabIds.length).toBe(previousGroupTabs.length);
      previousGroupTabs.forEach(tab => {
        expect(currentTabIds.indexOf(tab.id)).not.toBe(-1);
      });
    });
  });

  describe("[Close] window.Background.TabHidden.", () => {
    beforeEach(async function() {
      [this.ids, this.groups] = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: 4,
        global: true,
        active: 1,
        title: "Debug switch Groups with hidden",
      });
      this.groups = this.ids.map((id) => window.Background.GroupManager.groups[
        window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: true})
      ]);
    });

    afterEach(async function() {
      for (let id of this.ids) {
        if (window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0)
          await window.Background.GroupManager.removeGroupFromId(id);
      }
    });

    it(".closeAllHiddenTabsInGroups should close all hidden tabs in the groups", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }

      await TestManager.waitWindowToBeFocused(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(this.ids[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      expect(TestManager.countHiddenTabsInGroups(window.Background.GroupManager.groups)).toBe(window.Background.GroupManager.groups[
        window.Background.GroupManager.getGroupIndexFromGroupId(this.ids[0], {error: true})
      ].tabs.length);

      await window.Background.TabHidden.closeAllHiddenTabsInGroups();

      const currentHiddenTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      }));

      expect(currentHiddenTabIds.length).toBe(0);
      expect(TestManager.countHiddenTabsInGroups(window.Background.GroupManager.groups)).toBe(0);
    });

    it(".closeUnknownHiddenTabs should close all hidden tabs NOT in the groups", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsInGroupLength = 4;
      // 1. Create hidden tabs in groups
      const [groupIds] = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: tabsInGroupLength,
        global: true,
        active: 1,
        title: "Debug switch Groups with hidden",
      });

      const indexGroup0 = window.Background.GroupManager.getGroupIndexFromGroupId(groupIds[0]);
      const indexGroup1 = window.Background.GroupManager.getGroupIndexFromGroupId(groupIds[1]);


      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const hiddenTabIdsFirstTime = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      }));

      expect(hiddenTabIdsFirstTime.length).toBe(tabsInGroupLength);
      expect(hiddenTabIdsFirstTime.map(tab => tab.id)).toEqual(
        window.Background.GroupManager.groups[indexGroup0].tabs.map(tab => tab.id)
      )

      // 2. Create hidden tabs NOT in groups
      const tabsLength = 5;
      await TestManager.waitWindowToBeFocused(this.windowId);

      const listTabs = Session.createTabs({tabsLength,
        active: -2});
      const openTabs = await window.Background.TabManager.openListOfTabs(listTabs, this.windowId);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const tabIdsToHide = openTabs.map(tab => tab.id);
      await browser.tabs.hide(tabIdsToHide)

      const hiddenTabIdsSecondTime = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).map(tab => tab.id);
      const visibleTabIdsSecondTime = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      })).map(tab => tab.id);

      expect(hiddenTabIdsSecondTime.length).toBe(
        tabIdsToHide.length + hiddenTabIdsFirstTime.length
      )
      tabIdsToHide.forEach(tabId => {
        expect(hiddenTabIdsSecondTime).toContain(tabId)
      });

      expect(visibleTabIdsSecondTime).toEqual(
        window.Background.GroupManager.groups[indexGroup1].tabs.map(tab => tab.id)
      )

      await window.Background.TabHidden.closeUnknownHiddenTabs();

      await window.Background.TabManager.waitTabsToBeClosed(tabIdsToHide);

      const currentHiddenTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      })).map(tab => tab.id);
      await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      expect(currentHiddenTabIds.length).toBe(tabsInGroupLength);
      expect(TestManager.countHiddenTabsInGroups(window.Background.GroupManager.groups)).toBe(tabsInGroupLength);
      tabIdsToHide.forEach(tabId =>{
        expect(currentHiddenTabIds).not.toContain(tabId)
      });

      expect(currentHiddenTabIds).toEqual(
        window.Background.GroupManager.groups[indexGroup0].tabs.map(tab => tab.id)
      )

      expect(visibleTabIdsSecondTime).toEqual(
        window.Background.GroupManager.groups[indexGroup1].tabs.map(tab => tab.id)
      )

      TestManager.removeGroups(groupIds)
    });

    it(".closeHiddenTabs should close some hidden tabs specified.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const tabsLength = 7;
      const hiddenTabsToRemoveNumber = 4;
      await TestManager.waitWindowToBeFocused(this.windowId);

      const listTabs = Session.createTabs({tabsLength,
        active: 0});
      await window.Background.TabManager.openListOfTabs(listTabs, this.windowId);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const tabIdsToHide = (await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      })).map(tab => tab.id);
      await browser.tabs.hide(tabIdsToHide)

      const beforeHiddenTabIds = (await browser.tabs.query({
        hidden: true,
      }));

      expect(beforeHiddenTabIds.length).toBe(tabIdsToHide.length);


      const hiddenTabIdsToClose = tabIdsToHide.slice(0,4);
      await window.Background.TabHidden.closeHiddenTabs(hiddenTabIdsToClose);

      const currentHiddenTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      }));

      expect(currentHiddenTabIds.length)
        .toBe(tabsLength-hiddenTabsToRemoveNumber);
    });

    it(".removeAllHiddenTabs should close all hidden tabs.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const listTabs = Session.createTabs({tabsLength: 4,
        active: 0});
      await window.Background.TabManager.openListOfTabs(listTabs, this.windowId);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const windowId_bis = await TestManager.openWindow();
      const listTabs_bis = Session.createTabs({tabsLength: 4,
        active: 0});
      await window.Background.TabManager.openListOfTabs(listTabs_bis, windowId_bis);
      await TestManager.waitAllTabsToBeLoadedInWindowId(windowId_bis);

      const tabIdsToHide = (await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      }))
        .concat(
          await browser.tabs.query({
            windowId: windowId_bis,
            active: false,
          })
        )
        .map(tab => tab.id);
      await browser.tabs.hide(tabIdsToHide)

      const beforeHiddenTabIds = (await browser.tabs.query({
        hidden: true,
      }));

      expect(beforeHiddenTabIds.length).toBe(tabIdsToHide.length);

      await window.Background.TabHidden.removeAllHiddenTabs();

      const currentHiddenTabIds = (await browser.tabs.query({
        hidden: true,
      }));

      expect(currentHiddenTabIds.length).toBe(0);

      await TestManager.closeWindows(windowId_bis);
    });
  });

  describe("[Reference] window.Background.TabHidden.", () => {
    it("onStartInitialization should bind back the hidden tabs with the groups.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const [groupIds] = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: 4,
        global: true,
        active: 1,
        title: "Debug switch Groups with hidden",
      });

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const indexGroup0 = window.Background.GroupManager.getGroupIndexFromGroupId(groupIds[0]);
      const initialIds = window.Background.GroupManager.groups[indexGroup0].tabs
        .map(tab => tab.id);

      await Promise.all(
        window.Background.GroupManager.groups[indexGroup0].tabs.map(async(tab) => {
          const previousId = tab.id;
          tab.id += 1000;
          // Map the wrong id to the good tab
          await browser.sessions.setTabValue(
            previousId,
            window.Background.TabHidden.TABHIDDEN_SESSION_KEY,
            tab.id,
          );
          return;
        })
      );

      await window.Background.TabHidden.onStartInitialization();

      expect(
        window.Background.GroupManager.groups[indexGroup0].tabs.map(tab => tab.id)
      ).toEqual(initialIds);

      expect(
        window.Background.GroupManager.groups[indexGroup0].tabs.map(tab => tab.hidden)
      ).toEqual(Array(4).fill(true));

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const currentTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      }));

      expect(currentTabIds.map(tab => tab.id))
        .toEqual(initialIds);
      TestManager.removeGroups(groupIds)
    })

    it("onStartInitialization should change hidden property to false for tabs that didn't find back.", async function() {
      if (!window.Background.Utils.hasHideFunction()) {
        pending("No hidden functionality.")
        return;
      }
      const [groupIds] = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: 4,
        global: true,
        active: 1,
        title: "Debug switch Groups with hidden",
      });

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const indexGroup0 = window.Background.GroupManager.getGroupIndexFromGroupId(groupIds[0]);
      const initialIds = window.Background.GroupManager.groups[indexGroup0].tabs
        .map(tab => tab.id);

      await Promise.all(
        window.Background.GroupManager.groups[indexGroup0].tabs.map(async(tab) => {
          const previousId = tab.id;
          tab.id += 1000;
          // Map the wrong id to the good tab
          await browser.sessions.setTabValue(
            previousId,
            window.Background.TabHidden.TABHIDDEN_SESSION_KEY,
            tab.id,
          );
          return;
        })
      );

      const size = 2;
      const tabIdsToBeClose = initialIds.slice(0, size);

      await TestManager.removeTabs(tabIdsToBeClose);

      await window.Background.TabHidden.onStartInitialization();

      expect(
        window.Background.GroupManager.groups[indexGroup0].tabs
          .slice(0, size)
          .map(tab => tab.hidden)
      ).toEqual([false, false]);

      expect(
        window.Background.GroupManager.groups[indexGroup0].tabs
          .slice(size)
          .map(tab => tab.id)
      ).toEqual(initialIds.slice(size));

      await window.Background.WindowManager.switchGroupInCurrentWindow(groupIds[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      expect(
        window.Background.GroupManager.groups[indexGroup0].tabs
          .slice(0, size)
          .map(tab => tab.hidden)
      ).not.toEqual(initialIds.slice(0, size));

      expect(
        window.Background.GroupManager.groups[indexGroup0].tabs
          .slice(size)
          .map(tab => tab.id)
      ).toEqual(initialIds.slice(size));
      TestManager.removeGroups(groupIds)
    })
  })

});
