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
    if ( !Utils.hasHideFunction() ) return;
    await TestManager.clearWindow(this.windowId);
  });
  beforeEach(async function() {
    if ( !Utils.hasHideFunction() ) return;
    OptionManager.updateOption("groups-closingState", OptionManager.CLOSE_HIDDEN);
    await TestManager.clearWindow(this.windowId);
  });

  describe("TabHidden.hideTab", ()=>{
    it(" hides a tab if it is possible and return true", async function(){
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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

  describe("WindowManager.switchGroupInCurrentWindow", () => {
    
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      });

      expect(previousTabs.length).toBe(0);
    });

    it("should close a group by hidding current tabs.", async function(){
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousGroupTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      await WindowManager.switchGroupInCurrentWindow(this.ids[1]);
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
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
      await TestManager.waitWindowToBeFocused(this.windowId);

      await WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      const previousGroupTabs = await browser.tabs.query({
        windowId: this.windowId,
        hidden: false,
      });

      await WindowManager.switchGroupInCurrentWindow(this.ids[1]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await WindowManager.switchGroupInCurrentWindow(this.ids[0]);
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

  describe("[Close] TabHidden.", () => {
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

    it(".closeAllHiddenTabsInGroups should close all hidden tabs in the groups", async function(){
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
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

      await WindowManager.switchGroupInCurrentWindow(this.ids[0]);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      await WindowManager.switchGroupInCurrentWindow(this.ids[1]);
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

    fit(".closeHiddenTabs should close some hidden tabs specified.", async function(){
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
      const tabsLength = 7;
      const hiddenTabsToRemoveNumber = 4;
      // Open hidden tabs in window 1
      await TestManager.waitWindowToBeFocused(this.windowId);

      const listTabs = Session.createTabs({tabsLength: 7, active: 0});
      await TabManager.openListOfTabs(listTabs, this.windowId);
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
      await TabHidden.closeHiddenTabs(hiddenTabIdsToClose);

      const currentHiddenTabIds = (await browser.tabs.query({
        windowId: this.windowId,
        hidden: true,
      }));

      expect(currentHiddenTabIds.length)
        .toBe(tabsLength-hiddenTabsToRemoveNumber);
    });

    fit(".removeAllHiddenTabs should close all hidden tabs.", async function(){
      if ( !Utils.hasHideFunction() ){
          pending("No hidden functionality.")
          return;
      }
      // Open hidden tabs in window 1
      const listTabs = Session.createTabs({tabsLength: 4, active: 0});
      await TabManager.openListOfTabs(listTabs, this.windowId);
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      // Open hidden tabs in window 2
      const windowId_bis = await TestManager.openWindow();
      const listTabs_bis = Session.createTabs({tabsLength: 4, active: 0});
      await TabManager.openListOfTabs(listTabs_bis, windowId_bis);
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

      await TabHidden.removeAllHiddenTabs();

      const currentHiddenTabIds = (await browser.tabs.query({
        hidden: true,
      }));

      expect(currentHiddenTabIds.length).toBe(0);

      await TestManager.closeWindows(windowId_bis);
    });
  });

});
