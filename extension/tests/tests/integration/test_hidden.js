describe("When Hidden Closing State is enabled, ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function(){
    OptionManager.updateOption("groups-syncNewWindow", false);
    this.windowId = await TestManager.openWindow();
  });

  // Keep test session clean in between :)
  afterEach(async function() {
    await TestManager.clearWindow(this.windowId);
  });
  beforeEach(async function() {
    OptionManager.updateOption("groups-closingState", OptionManager.CLOSE_HIDDEN);
    await TestManager.clearWindow(this.windowId);
  });

  describe("TabHidden.hideTab", ()=>{
    it(" hides a tab if it is possible and return true", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength, active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;

      const isHidden = await TabHidden.hideTab(targetTabId);

      const targetTab = await browser.tabs.get(targetTabId);

      expect( targetTab.hidden ).toBe(true);
      expect( isHidden ).toBe(true);
      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength-1);
    });

    it(" does nothing if it is impossible to hide and return false", async function(){
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength, active: tabsLength-1, pinnedTabs: 1});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[0].id;

      const isHidden = await TabHidden.hideTab(targetTabId);

      const targetTab = await browser.tabs.get(targetTabId);

      expect( targetTab.hidden ).toBe(false);
      expect( isHidden ).toBe(false);
      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength);
    });
  });

  describe("TabHidden.showTab", ()=>{
    it(" shows a tab if it is possible and return true", async function(){
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength, active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;
      let targetTab;

      await browser.tabs.hide(targetTabId);
      targetTab = await browser.tabs.get(targetTabId);
      expect( targetTab.hidden ).toBe(true);

      const isShown = await TabHidden.showTab(targetTabId, this.windowId);
      targetTab = await browser.tabs.get(targetTabId);
      expect( targetTab.hidden ).toBe(false);
      expect( isShown ).toBe(true);
    });

    it(" does nothing if it is impossible to show and return false", async function(){
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength, active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;
      let targetTab;

      await browser.tabs.hide(targetTabId);
      targetTab = await browser.tabs.get(targetTabId);
      expect( targetTab.hidden ).toBe(true);

      await TestManager.removeTabs(targetTabId);

      const isShown = await TabHidden.showTab(targetTabId, this.windowId);
      expect( isShown ).toBe(false);
    });
  });

  describe("TabManager.openListOfTabs", ()=>{
    it(" shows tabs previously hidden", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      });
      await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      await TabManager.openListOfTabs(tabsToHide, this.windowId);

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(0)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength);

      const finalTabs = (await browser.tabs.query({windowId: this.windowId}))
            .map(tab => tab.id);
      tabsToHide.forEach(({id}) => {
        expect(finalTabs.indexOf(id)).not.toBe(-1);
      });
    });

    it(" shows tabs previously hidden and opens missing tabs", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: true,
      });
      await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      await TabManager.openListOfTabs(tabsToHide, this.windowId);

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(0)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength);

      const finalTabs = (await browser.tabs.query({windowId: this.windowId}))
            .map(tab => tab.id);
      tabsToHide.forEach(({id}) => {
        expect(finalTabs.indexOf(id)).toBe(-1);
      });
    });
  });

  describe("TabManager.removeTabs", ()=>{
    it(" hides tabs in the window", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      });

      const isHidden = await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(tabsLength-1)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(1);
    });

    it(" hides tabs in the group and closes failing tabs", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: true,
      });

      const isHidden = await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      expect((await browser.tabs.query({
        windowId: this.windowId
      })).length).toBe(tabsLength-1)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(0);
    });
  });

  describe("WindowManager.switchGroup", () => {
    beforeEach(async function(){
      [this.ids, this.groups] = Session.createArrayGroups({
          groupsLength: 2,
          tabsLength: 4,
          global: true,
          active: 1,
          title: "Debug switch Groups with hidden"
        });
      this.groups = this.ids.map( (id) => GroupManager.groups[
        GroupManager.getGroupIndexFromGroupId(id, {error: true})
      ]);
    });

    afterEach(async function(){
      for (let id of this.ids ) {
        if ( GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0 )
          await GroupManager.removeGroupFromId(id);
      }
    });

    it("should open the group and close the previous tabs.", async function(){
      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroup(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      });

      expect(previousTabs.length).toBe(0);
    });

    it("should close a group by hidding current tabs.", async function(){
      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroup(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousGroupTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      await WindowManager.switchGroup(this.ids[1]);
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

    it("should open a group by showing hidden tabs.", async function(){
      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroup(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousGroupTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      await WindowManager.switchGroup(this.ids[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await WindowManager.switchGroup(this.ids[0]);
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

  fdescribe("WindowManager.switchGroup", () => {
    beforeEach(async function(){
      [this.ids, this.groups] = Session.createArrayGroups({
          groupsLength: 2,
          tabsLength: 4,
          global: true,
          active: 1,
          title: "Debug switch Groups with hidden"
        });
      this.groups = this.ids.map( (id) => GroupManager.groups[
        GroupManager.getGroupIndexFromGroupId(id, {error: true})
      ]);
    });

    afterEach(async function(){
      for (let id of this.ids ) {
        if ( GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0 )
          await GroupManager.removeGroupFromId(id);
      }
    });

    it("should switch from hidden to normal closing and close all hidden tabs in the groups", async function(){
      const countHiddenTabsInGroups = (groups) => {
        return groups.reduce((acc, group) => {
            acc += group.tabs.reduce((acc, tab) => {
              if ( tab.hidden ) {
                acc++;
              }
              return acc;
            }, 0);
            return acc;
        }, 0);
      }

      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroup(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await WindowManager.switchGroup(this.ids[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      expect(countHiddenTabsInGroups(GroupManager.groups)).toBe(GroupManager.groups[
        GroupManager.getGroupIndexFromGroupId(this.ids[0], {error: true})
      ].tabs.length);

      await TabHidden.closeAllHiddenTabsInGroups();

      const currentHiddenTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      }));

      expect(currentHiddenTabIds.length).toBe(0);
      expect(countHiddenTabsInGroups(GroupManager.groups)).toBe(0);
    });
  });

});
