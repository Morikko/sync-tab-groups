describe("End of Groups - ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function(){
    OptionManager.updateOption("groups-syncNewWindow", false);
    OptionManager.updateOption("pinnedTab-sync", true);
    jasmine.addMatchers(tabGroupsMatchers);
    this.length = 3;
    this.groups = [];
    for( let i=0; i<2; i++) {
      let id, group;
      [id, group] = Session.createGroup({
          tabsLength: this.length,
          global: true,
          pinnedTabs: i,
          active: 5,
          title: "Debug Select Groups " + i
        });
      this.groupIndex =
      this.groups.push({
        id: id,
        group: group,
        groupIndex: GroupManager.getGroupIndexFromGroupId(id)
      });
    }

    this.windowId = await WindowManager.openGroupInNewWindow(this.groups[0].id);
    await TestManager.splitOnHalfScreen(this.windowId);
  }, TestManager.TIMEOUT);

  afterAll(async function(){
    // Close Window
    if ( await WindowManager.isWindowIdOpen(this.windowId) )
      await browser.windows.remove(this.windowId);
    // Remove Group
    for (let group of this.groups ) {
      if ( GroupManager.getGroupIndexFromGroupId(group.id, {error: false}) >= 0 )
        await GroupManager.removeGroupFromId(group.id);
    }
  });

  describe("Closing - ", ()=>{

    it("Current Window", async function(){
      let previousLength = GroupManager.groups.length;
      await WindowManager.closeGroup(this.groups[0].id);

      let tabs = await TabManager.getTabsInWindowId(this.windowId);

      let blank = [Session.createTab(Session.newTab)];

      TestManager.resetActiveProperties(tabs);
      TestManager.resetIndexProperties(blank);

      expect(tabs).toEqualTabs(blank);
      expect(previousLength).toEqual(GroupManager.groups.length);
      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
    });

    it("Another Window", async function(){
      let windowId = await WindowManager.openGroupInNewWindow(this.groups[0].id);
      await TestManager.splitOnHalfScreen(windowId);

      let previousLength = GroupManager.groups.length;
      let windowsNumber = (await browser.windows.getAll()).length;

      try {
        await browser.windows.update(this.windowId, {
          focused: true,
        });
        await Utils.wait(500);

        await WindowManager.closeGroup(this.groups[0].id);
        await Utils.wait(500);
      } catch ( e ) {
        let msg = "Closing Another Window failed on window " + windowId + " and " + e;
        console.error(msg);
      }

      expect(previousLength).toEqual(GroupManager.groups.length);
      expect(windowsNumber).toEqual((await browser.windows.getAll()).length+1);
      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
    }, TestManager.TIMEOUT);

    // With Pinned Tabs not to close ..
    it("With Pinned Tabs To Keep", async function(){
      let previousLength = GroupManager.groups.length;

      OptionManager.updateOption("pinnedTab-sync", false);

      let pinnedTab = [GroupManager.groups[this.groups[1].groupIndex].tabs[0]];

      await WindowManager.switchGroup(this.groups[1].id);
      await WindowManager.closeGroup(this.groups[1].id);

      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
      let tabs = await TabManager.getTabsInWindowId(this.windowId, {
        withPinned: true,
      });

      TestManager.resetActiveProperties(tabs);
      TestManager.resetActiveProperties(pinnedTab);

      OptionManager.updateOption("pinnedTab-sync", true);

      expect(tabs).toEqualTabs(pinnedTab);
      expect(previousLength).toEqual(GroupManager.groups.length);
      expect(GroupManager.groups[this.groups[1].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
    });
  });

  describe("Removing - ", ()=>{
    it("Current Window", async function(){
      let previousLength = GroupManager.groups.length;

      try {
        await browser.windows.update(this.windowId, {
          focused: true,
        });
        await Utils.wait(500);

        await WindowManager.switchGroup(this.groups[0].id);
        await WindowManager.removeGroup(this.groups[0].id);
      } catch ( e ) {
        let msg = "Removing Current Window failed on window " + windowId + " and " + e;
        console.error(msg);
      }

      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)
      let tabs = await TabManager.getTabsInWindowId(this.windowId);

      let blank = [Session.createTab(Session.newTab)];

      TestManager.resetActiveProperties(tabs);
      TestManager.resetIndexProperties(blank);

      expect(tabs).toEqualTabs(blank);
      expect(previousLength).toEqual(GroupManager.groups.length+1);
      expect(GroupManager.getGroupIndexFromGroupId(this.groups[0].id, {error: false})).toEqual(-1);
    }, TestManager.TIMEOUT);

    it("Another Window", async function(){
      let windowId = await WindowManager.openGroupInNewWindow(this.groups[1].id);
      await TestManager.splitOnHalfScreen(windowId);
      let previousLength = GroupManager.groups.length;
      let windowsNumber = (await browser.windows.getAll()).length;

      try {
        await browser.windows.update(this.windowId, {
          focused: true,
        });
        await Utils.wait(500);

        await WindowManager.removeGroup(this.groups[1].id);
      } catch ( e ) {
        let msg = "Removing Another Window failed on window " + windowId + " and " + e;
        console.error(msg);
      }
      expect(previousLength).toEqual(GroupManager.groups.length+1);
      expect(windowsNumber).toEqual((await browser.windows.getAll()).length+1);
      expect(GroupManager.getGroupIndexFromGroupId(this.groups[1].id, {error: false})).toEqual(-1);

      if ( await WindowManager.isWindowIdOpen(windowId) ) {
        await browser.windows.remove(windowId);
      }

    }, TestManager.TIMEOUT);
  });
});
