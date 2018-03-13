// TODO: put in a special file for tests Initialization
TestManager.TIMEOUT = 30000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = TestManager.TIMEOUT;

describe("Tabs Creation/Deletion - ", ()=>{

  beforeAll(async function(){
    // Create Window
    OptionManager.updateOption("groups-syncNewWindow", false);
    jasmine.addMatchers(tabGroupsMatchers);
    this.windowId = (await browser.windows.create()).id;
    await TestManager.splitOnHalfScreen(this.windowId);
  });

  afterAll(async function(){
    // Close Window
    await browser.windows.remove(this.windowId);
  });

  beforeEach(async function() {
    this.previousTabs = await TabManager.getTabsInWindowId(
      this.windowId,{
        withPinned: true,
      });
  });

  describe("Normal tabs - ", ()=>{
    describe("openListOfTabs - ", ()=>{
      it("Do not open again, if only new tab", async function(){
        let tabId = this.previousTabs[0].id;

        await TabManager.openListOfTabs(
          [],
          this.windowId,{
            openAtLeastOne: true,
        });
        await Utils.wait(3000)

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(this.previousTabs);
        expect(resultingTabs[0].id).toEqual(tabId);
      });

      it("Open List of Tabs in Window", async function(){
        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 0,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = tabs.concat(this.previousTabs);
        TestManager.resetIndexProperties(expectedTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(resultingTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it("Open List of Tabs in last position", async function(){
        let tabs = Session.createTabs({
          tabsLength: 3,
          pinnedTabs: 0,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId,{
            inLastPos: true,
        });

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = this.previousTabs.concat(tabs);
        expectedTabs.forEach((tab, index)=>{
          tab.index = index;
        })

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it("Open At Least One New Tab", async function(){
        let new_tab  = await TabManager.openListOfTabs(
          [],
          this.windowId,{
            inLastPos: true,
            openAtLeastOne: true,
        });

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = this.previousTabs.concat(new_tab);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetIndexProperties(expectedTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });
    });

    describe("removeTabsInWindow - ", ()=>{
      it("Remove tabs and let only First Tab", async function(){
        let new_tabs = await browser.tabs.query({
          windowId: this.windowId,
          title: "New Tab",
        });

        await browser.tabs.remove(new_tabs.map(tab => tab.id));

        let survivorTab = await TabManager.removeTabsInWindow(
          this.windowId
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        survivorTab.url = Utils.extractTabUrl(survivorTab.url);
        survivorTab = [survivorTab];

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(survivorTab);

        expect(resultingTabs).toEqualTabs(survivorTab);
      });

      it("Remove tabs and let only New Tab", async function(){
        let new_tab = await TabManager.removeTabsInWindow(
          this.windowId,{
            openBlankTab: true,
          });
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        new_tab.index=0;
        expect(resultingTabs).toEqualTabs([new_tab]);
      });
    });
  });

  describe("Pinned tabs -", ()=>{
    describe("openListOfTabs - ", ()=>{
      it("Open List of Tabs with some Pinned Tabs", async function(){
        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId,
        );

        await browser.tabs.remove(this.previousTabs.map(tab => tab.id));

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        tabs[tabs.length-1].active = true;
        expect(resultingTabs).toEqualTabs(tabs);
      });

      it("Open List of Tabs with some Pinned Tabs with already some in the Window", async function(){
        let tabs = Session.createTabs({
          tabsLength: 4,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId,
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expectedTabs = Utils.getCopy(this.previousTabs);

        let offset = expectedTabs.filter(tab=>tab.pinned).length;
        for (let i=0; i<tabs.length; i++) {
          expectedTabs.splice(offset+i, 0, tabs[i]);
        }

        // Reset active
        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetIndexProperties(expectedTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });
    });

    describe("removeTabsInWindow - ", ()=>{
      it("Remove all tabs and let only pinned", async function(){
        OptionManager.updateOption("pinnedTab-sync", false);

        let survivorTab = await TabManager.removeTabsInWindow(
          this.windowId,
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expectedTabs = this.previousTabs.filter(tab=>tab.pinned);

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        expect(resultingTabs).toEqualTabs(expectedTabs);
        expect(survivorTab).toBeUndefined();
      });

      it("Remove all tabs and let only first pinned", async function(){
        OptionManager.updateOption("pinnedTab-sync", true);

        let survivorTab = await TabManager.removeTabsInWindow(
          this.windowId,
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expectedTabs = [this.previousTabs[0]];
        survivorTab.url = Utils.extractTabUrl(survivorTab.url);
        survivorTab = [survivorTab];

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(survivorTab);
        expect(resultingTabs).toEqualTabs(survivorTab);
        expect(survivorTab).toEqualTabs(expectedTabs);
      });
    });
  });

  describe("Active support - ", ()=>{
    it("Open list Tabs and keeping only one active", async function(){
      // Close all except blank
      let survivorTab = await TabManager.removeTabsInWindow(
        this.windowId,{
          openBlankTab: true,
          remove_pinned: true,
        });
      OptionManager.updateOption("groups-discardedOpen", true);

      let tabs = Session.createTabs({
        tabsLength: 5,
        pinnedTabs: 0,
        privilegedLength: 0,
        extensionUrlLength: 0,
      });
      tabs[2].active = true;

      await TabManager.openListOfTabs(
        tabs,
        this.windowId,{
          pendingTab: survivorTab,
      });
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      let resultingTabs = await TabManager.getTabsInWindowId(
        this.windowId,{
          withPinned: true,
        });

      let resultingTabsWithFancy = await TabManager.getTabsInWindowId(
        this.windowId,{
          withPinned: true,
        });

      let nbrNotDiscarded = resultingTabsWithFancy.filter(tab => tab.url.includes(Utils.LAZY_PAGE_URL)).length;

      expect(resultingTabs).toEqualTabs(tabs);
      expect(nbrNotDiscarded).toEqual(4);
    });
  })
});

describe("Switch Group - ", ()=>{

  beforeAll(function(){
    jasmine.addMatchers(tabGroupsMatchers);
  });

  describe("Basic", ()=>{
    beforeAll( async function(){
      OptionManager.updateOption("groups-syncNewWindow", false);
      jasmine.addMatchers(tabGroupsMatchers);
      this.windowId = (await browser.windows.create()).id;
      await TestManager.splitOnHalfScreen(this.windowId);
      this.length = 7;
      this.groups = [];
      for( let i=0; i<3; i++) {
        let id, group;
        [id, group] = Session.createGroup({
            tabsLength: this.length,
            global: true,
            pinnedTabs: 0,
            active: 5,
            title: "Debug WindowManager.OpenGroupInNewWindow"
          });
        this.groups.push({
          id: id,
          group: group,
          groupIndex: GroupManager.getGroupIndexFromGroupId(id)
        });
      }
    });

    afterAll(async function(){
      // Close Window
      await browser.windows.remove(this.windowId);
      // Remove Group
      for (let group of this.groups ) {
        await GroupManager.removeGroupFromId(group.id);
      }
    });

    it("From Not Group To Group - ", async function(){
      // Open
      let previousLength = GroupManager.groups.length;
      let previoustabs = Utils.getCopy(GroupManager.groups[this.groups[0].groupIndex].tabs);

      await WindowManager.switchGroup(this.groups[0].id);
      await Utils.wait(1000);

      let currentTabs = await TabManager.getTabsInWindowId(this.windowId);
      TestManager.resetIndexProperties(currentTabs);

      //No new window
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(this.windowId);
      // Tabs correspond
      expect(currentTabs).toEqualTabs(previoustabs);
    }, TestManager.TIMEOUT);

    it("From Group To Group - ", async function (){
      // Open
      let previousLength = GroupManager.groups.length;
      let previoustabs = Utils.getCopy(GroupManager.groups[this.groups[1].groupIndex].tabs);

      await WindowManager.switchGroup(this.groups[1].id);
      await Utils.wait(1000);

      let currentTabs = await TabManager.getTabsInWindowId(this.windowId);
      TestManager.resetIndexProperties(currentTabs);

      //No new window
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(GroupManager.groups[this.groups[1].groupIndex].windowId).toEqual(this.windowId);
      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
      // Tabs correspond
      expect(currentTabs).toEqualTabs(previoustabs);
    }, TestManager.TIMEOUT);
  });

  describe("Keep order", ()=>{


    /**
     ** Groups without pinned tabs
     * 1. Group 1
     * 2. Go to group 2
     * 3. Back to group 1
     ** One group with pinned tabs
     * Idem...
     ** Two groups with pinned tabs
     *
     */
    describe("[Pin included]From groups with pinned tabs - ", ()=>{
      beforeAll(function(){
        this.previousOptions = TestManager.swapOptions({
          "pinnedTab-sync": true,
        })
      });

      afterAll(function(){
        TestManager.swapOptions(this.previousOptions);
      });

      describe("To Groups with pinned tabs", function(){
        beforeAll( async function(){
          [this.groupIds, this.groups] = Session.createArrayGroups({
            groupsLength: 3,
            tabsLength: 7,
            pinnedTabs: 3,
            lazyMode: false,
            global: true,
            title:"Keep Order Included Without",
          })

          this.windowId = await WindowManager.openGroupInNewWindow(
            this.groupIds[0]);
          await TestManager.splitOnHalfScreen(this.windowId);
        });

        afterAll(async function(){
          await TestManager.closeWindows(this.windowId);
          await TestManager.removeGroups(this.groupIds)
        });

        it("Not pinned tab active keep his position", async function(){
          let targetGroupIndex = 1,
              targetTabIndex = 5; // Not pinned

          let previousTabs = Utils.getCopy(TestManager.getGroup(
            GroupManager.groups,
            this.groupIds[targetGroupIndex]
          ).tabs)

          await TabManager.selectTab(targetTabIndex, this.groupIds[targetGroupIndex], false);

          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

          let resultingTabs = await TabManager.getTabsInWindowId(
            this.windowId,{
              withPinned: true,
            });

          TestManager.setActiveProperties(previousTabs, targetTabIndex);

          expect(resultingTabs).toEqualTabs(previousTabs)
        }, TestManager.TIMEOUT);

        it("Pinned tab active keep his position", async function(){
          let targetGroupIndex = 2,
              targetTabIndex = 1; // pinned

          let previousTabs = Utils.getCopy(TestManager.getGroup(
            GroupManager.groups,
            this.groupIds[targetGroupIndex]
          ).tabs)

          await TabManager.selectTab(targetTabIndex, this.groupIds[targetGroupIndex]);

          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

          let resultingTabs = await TabManager.getTabsInWindowId(
            this.windowId,{
              withPinned: true,
            });

          TestManager.setActiveProperties(previousTabs, targetTabIndex);

          expect(resultingTabs).toEqualTabs(previousTabs)
        }, TestManager.TIMEOUT);
      });

      describe("To Groups without pinned tabs", function(){
        beforeAll( async function(){
          [this.groupIds, this.groups] = Session.createArrayGroups({
            groupsLength: 2,
            tabsLength: 7,
            pinnedTabs: [3,0],
            lazyMode: false,
            global: true,
            title:"Keep Order",
          })

          this.windowId = await WindowManager.openGroupInNewWindow(
            this.groupIds[0]);
          await TestManager.splitOnHalfScreen(this.windowId);
        });

        afterAll(async function(){
          await TestManager.closeWindows(this.windowId);
          await TestManager.removeGroups(this.groupIds)
        });

        it("Not pinned tab active keep his position", async function(){
          let targetGroupIndex = 1,
              targetTabIndex = 5; // Not pinned

          let previousTabs = Utils.getCopy(TestManager.getGroup(
            GroupManager.groups,
            this.groupIds[targetGroupIndex]
          ).tabs)

          await TabManager.selectTab(targetTabIndex, this.groupIds[targetGroupIndex], false);

          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

          let resultingTabs = await TabManager.getTabsInWindowId(
            this.windowId,{
              withPinned: true,
            });

          TestManager.setActiveProperties(previousTabs, targetTabIndex);

          expect(resultingTabs).toEqualTabs(previousTabs)
        }, TestManager.TIMEOUT);
      });
    });
  });

});

describe("WindowManager: ", ()=>{

  describe("Integration", ()=>{

    describe(" Normal Window: ", ()=>{
      beforeAll(async function(){
        jasmine.addMatchers(tabGroupsMatchers);
        OptionManager.updateOption("groups-syncNewWindow", false);
        [this.id, this.group] = Session.createGroup({
            tabsLength: 5,
            global: true,
            pinnedTabs: 0,
            active: -1,
            title: "Debug Integration"
          });
          this.groupIndex = GroupManager.getGroupIndexFromGroupId(this.id);

         this.windowId = await WindowManager.openGroupInNewWindow(this.id);
         await TestManager.splitOnHalfScreen(this.windowId);

         await Utils.wait(500);
      }, TestManager.TIMEOUT);

      afterAll(async function(){
        if ( this.windowId )
          await browser.windows.remove(this.windowId);
        if ( GroupManager.getGroupIndexFromGroupId(this.id, {error: false}) >= 0 )
          await GroupManager.removeGroupFromId(this.id);
      });

      it("Desassociate Windows", async function(){
        let previousLength = GroupManager.groups.length;

        await GroupManager.removeGroupFromId(this.id);

        let tabs = await TabManager.getTabsInWindowId(this.windowId);

        TestManager.resetActiveProperties(tabs);
        TestManager.resetActiveProperties(this.group.tabs);

        expect(previousLength).toEqual(GroupManager.groups.length+1);
        expect(GroupManager.getGroupIndexFromGroupId(this.id, {error: false})).toEqual(-1);
        expect(tabs).toEqualTabs(this.group.tabs);

        this.id = undefined;
      });

      it("Associate Windows", async function(){
        let previousLength = GroupManager.groups.length;

        let id = await WindowManager.integrateWindow(this.windowId, {even_new_one: true});
        expect(id).toBeGreaterThan(-1);

        let groupIndex = GroupManager.getGroupIndexFromGroupId(id, {error: false});
        expect(groupIndex).not.toEqual(-1);

        let tabs = Utils.getCopy(GroupManager.groups[groupIndex].tabs);

        TestManager.resetActiveProperties(tabs);

        expect(previousLength).toEqual(GroupManager.groups.length-1);
        expect(tabs).toEqualTabs(this.group.tabs);

        await GroupManager.removeGroupFromId(id);
      });
    });

    describe(" Private Window: ", ()=>{
      beforeAll(async function(){
        jasmine.addMatchers(tabGroupsMatchers);
        OptionManager.updateOption("privateWindow-sync", false);

        [this.id, this.group] = Session.createGroup({
            tabsLength: 5,
            global: true,
            pinnedTabs: 0,
            active: -1,
            incognito: true,
            title: "Debug Integration"
          });
          this.groupIndex = GroupManager.getGroupIndexFromGroupId(this.id);

         this.windowId = await WindowManager.openGroupInNewWindow(this.id);
         await TestManager.splitOnHalfScreen(this.windowId);

         await Utils.wait(500);
      }, TestManager.TIMEOUT);

      afterAll(async function(){
        if ( await WindowManager.isWindowIdOpen(this.windowId) )
          await browser.windows.remove(this.windowId);
      });

      it("Desassociate Windows", async function(){
        let previousLength = GroupManager.groups.length;

        await GroupManager.removeGroupFromId(this.id);

        let tabs = await TabManager.getTabsInWindowId(this.windowId);

        TestManager.resetActiveProperties(tabs);
        TestManager.resetActiveProperties(this.group.tabs);

        expect(previousLength).toEqual(GroupManager.groups.length+1);
        expect(GroupManager.getGroupIndexFromGroupId(this.id, {error: false})).toEqual(-1);
        expect(tabs).toEqualTabs(this.group.tabs);

        this.id = undefined;
      });

      it("Associate Windows", async function(){
        let previousLength = GroupManager.groups.length;

        let id = await WindowManager.integrateWindow(this.windowId, {even_new_one: true});
        expect(id).toBeGreaterThan(-1);

        let groupIndex = GroupManager.getGroupIndexFromGroupId(id, {error: false});
        expect(groupIndex).not.toEqual(-1);

        let tabs = Utils.getCopy(GroupManager.groups[groupIndex].tabs);

        TestManager.resetActiveProperties(tabs);

        expect(GroupManager.groups[groupIndex].incognito).toBe(true);
        expect(previousLength).toEqual(GroupManager.groups.length-1);
        expect(tabs).toEqualTabs(this.group.tabs);

        await GroupManager.removeGroupFromId(id);
      });
    });
  });

  describe("OnNewWindowOpen: ", ()=>{

    beforeEach(function() {
      this.windowId = browser.windows.WINDOW_ID_NONE;
    });

    afterEach(async function() {
      if ( this.windowId !== browser.windows.WINDOW_ID_NONE ) {
        let id;
        if ( (id = GroupManager.getGroupIdInWindow(this.windowId, {error: false})) >= 0 ) { // Remove group
          await GroupManager.removeGroupFromId(id);
        }
        // Close window
        await browser.windows.remove(this.windowId);
      }
    });

    describe("Normal Window", function(){

      it("Visible", async function(){
        OptionManager.updateOption("groups-syncNewWindow", true);
        OptionManager.updateOption("privateWindow-sync", true);
        let previousLength = GroupManager.groups.length;

        this.windowId = (await browser.windows.create()).id;
        await Utils.wait(1200);

        expect(GroupManager.groups.length).toEqual(previousLength+1);
        let lastGroup = GroupManager.groups[GroupManager.groups.length-1];
        expect(lastGroup.title).toBe("");
        expect(lastGroup.tabs.length).toBe(1);
      });

      it("Invisible", async function(){
        OptionManager.updateOption("privateWindow-sync", true);
        OptionManager.updateOption("groups-syncNewWindow", false);
        let previousLength = GroupManager.groups.length;

        this.windowId = (await browser.windows.create()).id;
        await Utils.wait(1200);

        expect(GroupManager.groups.length).toEqual(previousLength);
      });
    });

    describe("Private Window", function(){
      it("Private", async function(){
        OptionManager.updateOption("privateWindow-sync", true);
        OptionManager.updateOption("groups-syncNewWindow", true);
        let previousLength = GroupManager.groups.length;

        this.windowId = (await browser.windows.create({
          incognito:true,
        })).id;
        await Utils.wait(1200);

        expect(GroupManager.groups.length).toEqual(previousLength+1);
        let lastGroup = GroupManager.groups[GroupManager.groups.length-1];
        expect(lastGroup.title).toBe("");
        expect(lastGroup.incognito).toBe(true);
        expect(lastGroup.tabs.length).toBe(1);
      });

      it("Invisible", async function(){
        OptionManager.updateOption("privateWindow-sync", false);
        OptionManager.updateOption("groups-syncNewWindow", true);
        let previousLength = GroupManager.groups.length;

        this.windowId = (await browser.windows.create({
          incognito:true,
        })).id;
        await Utils.wait(1200);

        expect(GroupManager.groups.length).toEqual(previousLength);
      });
    });
  });

  describe("OpenGroupInNewWindow: ", ()=>{

    beforeEach( function(){
      // Create Group
      this.length = 7;
      [this.id, this.group] = Session.createGroup({
          tabsLength: this.length,
          global: true,
          pinnedTabs: 0,
          active: 5,
          title: "Debug WindowManager.OpenGroupInNewWindow"
        });
      this.groupIndex = GroupManager.getGroupIndexFromGroupId(this.id);
    });

    afterEach(async function(){
      // Close Window
      await WindowManager.closeWindowFromGroupId(this.id);
      // Remove Group
      await GroupManager.removeGroupFromId(this.id)
    });

    it("Window is well associated with group", async function(){
      // Open
      let previousLength = GroupManager.groups.length;
      this.windowId = await WindowManager.openGroupInNewWindow(this.id);

      //No new window
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(GroupManager.groups[this.groupIndex].windowId).toEqual(this.windowId);
    })

  });

})

describe("Select Groups - ", ()=>{
  beforeAll(async function(){
    OptionManager.updateOption("groups-syncNewWindow", false);
    this.length = 3;
    this.groups = [];
    for( let i=0; i<4; i++) {
      let id, group;
      [id, group] = Session.createGroup({
          tabsLength: this.length,
          global: true,
          pinnedTabs: 0,
          active: 5,
          title: "Debug Select Groups " + i
        });
      this.groups.push({
        id: id,
        group: group,
        groupIndex: GroupManager.getGroupIndexFromGroupId(id)
      });
    }

    this.windowId = await WindowManager.openGroupInNewWindow(this.groups[0].id);
    await TestManager.splitOnHalfScreen(this.windowId);

    this.windowId_bis = (await browser.windows.create()).id;
    await TestManager.splitOnHalfScreen(this.windowId_bis);
  }, TestManager.TIMEOUT);

  afterAll(async function(){
    // Close Window
    if ( this.windowId )
      await browser.windows.remove(this.windowId);
    if ( this.windowId_bis )
      await browser.windows.remove(this.windowId_bis);
    // Remove Group
    for (let group of this.groups ) {
      await GroupManager.removeGroupFromId(group.id);
    }
  });

  describe("Basic", ()=>{

    it("Switch with Opening", async function(){
      let previousLength = GroupManager.groups.length;

      await WindowManager.selectGroup(this.groups[1].id);

      //No new window
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(GroupManager.groups[this.groups[1].groupIndex].windowId).toEqual(this.windowId_bis);
    }, TestManager.TIMEOUT);

    it("Switch with Change Focus of Window", async function(){
      let previousLength = GroupManager.groups.length;

      await WindowManager.selectGroup(this.groups[0].id);

      let currentWindow = await browser.windows.getLastFocused();
      // group is associated with OPEN window
      expect(currentWindow.id).toEqual(GroupManager.groups[this.groups[0].groupIndex].windowId);
    }, TestManager.TIMEOUT);

  });

  describe("Next Group", ()=>{

    beforeAll(function (){
      this.lastSorting = OptionManager.options.groups.sortingType;
      OptionManager.updateOption("groups-sortingType", OptionManager.SORT_OLD_RECENT);
    });

    afterAll(function (){
      OptionManager.updateOption("groups-sortingType", this.lastSorting);
    });

    it("Switch To Next Open", async function(){
      await WindowManager.selectNextGroup({
        direction: 1,
        open: true,
        refGroupId: this.groups[0].id
      });

      let currentWindow = await browser.windows.getLastFocused();

      expect(currentWindow.id).toEqual(GroupManager.groups[this.groups[1].groupIndex].windowId);
    });

    it("Switch To Previous Open", async function(){
      let nextGroupId = await WindowManager.selectNextGroup({
        direction: -1,
        open: true,
        refGroupId: this.groups[1].id
      });

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.groups[0].id);
      expect(currentWindow.id).toEqual(GroupManager.groups[this.groups[0].groupIndex].windowId);
    });

    // Select Next Unopen
    it("Switch To Next Unopen", async function(){
      let nextGroupId = await WindowManager.selectNextGroup({
        refGroupId: this.groups[0].id
      });

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.groups[2].id);
      expect(GroupManager.groups[this.groups[2].groupIndex].windowId).toEqual(currentWindow.id);
    }, TestManager.TIMEOUT);

    // Select Previous Unopen
    it("Switch To Previous Unopen", async function(){
      await WindowManager.selectNextGroup({
        direction: -1,
        refGroupId: this.groups[2].id
      });

      let currentWindow = await browser.windows.getLastFocused();

      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(currentWindow.id);
    }, TestManager.TIMEOUT);

  });
});

describe("End of Groups - ", ()=>{
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


describe("Session: ", ()=>{
  describe("addTabToGroup: ", ()=>{
    beforeAll(async function(){
      // Create Group
      this.length = 7;
      [this.id, this.group] = Session.createGroup({
          tabsLength: this.length,
          global: true,
          pinnedTabs: 0,
          active: 5,
          title: "Debug Session.addTabToGroup"
        });
      this.groupIndex = GroupManager.getGroupIndexFromGroupId(this.id);
      // Open
      this.windowId = await WindowManager.openGroupInNewWindow(this.id);
    });

    afterAll(async function() {
      // Close Window
      await WindowManager.closeWindowFromGroupId(this.id);
      // Remove Group
      await GroupManager.removeGroupFromId(this.id)
    });


    it("Add Normal Tab To Open Group", async function(){
      let tab = Session.getRandomNormalTab();

      let group = GroupManager.groups[this.groupIndex];
      let previousLength = group.tabs.length;

      await Session.addTabToGroup(this.id, tab);

      expect(group.tabs.length).toEqual(previousLength+1);
      expect(group.tabs[group.tabs.length-1].url).toEqual(tab.url);
    });

    it("Add Pinned Tab To Open Group", async function(){
      OptionManager.updateOption("pinnedTab-sync", true);
      let tab = Session.getRandomNormalTab();
      tab.pinned = true;

      let group = GroupManager.groups[this.groupIndex];
      let previousLength = group.tabs.length;

      await Session.addTabToGroup(this.id, tab);

      let pinnedTabs = group.tabs.filter(tab => tab.pinned);

      expect(group.tabs.length).toEqual(previousLength+1);
      expect(pinnedTabs[pinnedTabs.length-1].url).toEqual(tab.url);
    });
  });
});

describe("TabManager", ()=>{
  describe("Select Tab: ", ()=>{

    beforeAll(async function(){
      // Create Group
      this.length = 7;
      [this.id, this.group] = Session.createGroup({
          tabsLength: this.length,
          global: true,
          pinnedTabs: 0,
          active: 5,
          title: "Debug Select Tab"
        });
      this.lastIndex = this.length-1;
      this.middleIndex = parseInt(this.length/2);
      this.firstIndex = 0;
      this.groupIndex = GroupManager.getGroupIndexFromGroupId(this.id);
      // Open
      this.windowId = await WindowManager.openGroupInNewWindow(this.id);

    });

    afterAll(async function() {
      // Close Window
      await WindowManager.closeWindowFromGroupId(this.id);
      // Remove Group
      await GroupManager.removeGroupFromId(this.id)
    });

    describe("Group With No Pinned Tab", ()=>{

      describe("and Included Pinned Tabs: ", ()=>{

        beforeAll(function(){
          // Set option: Pinned tab Included
          OptionManager.updateOption("pinnedTab-sync", true);
        });

        it("Select last...", async function(){
          await TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.firstIndex].active).toBe(true);
        });
      });

      describe("and Excluded Pinned Tabs: ", ()=>{
        beforeAll(function(){
          // Set option: Pinned tab Excluded
          OptionManager.updateOption("pinnedTab-sync", false);
        });

        it("Select last...", async function(){
          await TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.firstIndex].active).toBe(true);
        });
      });

    });

    describe("Group With 2 Pinned Tabs", ()=>{

      beforeAll(async function(){
        // Add 2 Pinned Tabs
        await Session.addTabToGroup(
          this.id,
          Session.getRandomNormalTab({
            pinned:true,
          })
        );
        await Session.addTabToGroup(
          this.id,
          Session.getRandomNormalTab({
            pinned:true,
          })
        );
        await Utils.wait(400);
      });

      describe("Without Pinned Tabs (Excluded): ", ()=>{
        beforeAll(function(){
          // Set option: Pinned tab Excluded
          OptionManager.updateOption("pinnedTab-sync", false);
        });

        it("Select last...", async function(){
          await TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.firstIndex].active).toBe(true);
        });
      });

      describe("With Pinned Tabs Included: ", function(){
        beforeAll(async function(){
          // Set option: Pinned tab Excluded
          OptionManager.updateOption("pinnedTab-sync", true);
          this.length = 9;
          this.lastIndex = this.length-1;
          this.middleIndex = parseInt(this.length/2);
          this.firstIndex = 0;
          await Utils.wait(400);
        });

        it("Select last...", async function(){
          await TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await Utils.wait(400);
          expect(GroupManager.groups[this.groupIndex].tabs[this.firstIndex].active).toBe(true);
        });
      });

    });
  });

  describe("Select Tab and Switch (Open): ", ()=>{
    beforeAll(function(){
      jasmine.addMatchers(tabGroupsMatchers);
      this.length = 4;
      this.groups = [];

      this.previousOptions = TestManager.swapOptions({
        "groups-discardedOpen": true,
      });

      this.discardedOption = OptionManager.ma

      for( let i=0; i<2; i++) {
        let id, group;
        [id, group] = Session.createGroup({
            tabsLength: this.length,
            global: true,
            pinnedTabs: 0,
            active: -1,
            lazyMode: true,
            title: "Debug Select Tab and Switch " + i
          });
        this.groups.push({
          id: id,
          group: group,
          groupIndex: GroupManager.getGroupIndexFromGroupId(id)
        });
      }
    });

    afterAll(async function(){
      if ( TestManager.getGroupDeprecated(this.groups, 1).windowId >= 0 ) {
        await browser.windows.remove(TestManager.getGroupDeprecated(this.groups, 1).windowId);
      }
      for (let group of this.groups ) {
        if ( GroupManager.getGroupIndexFromGroupId(group.id, {error: false}) >= 0 )
          await GroupManager.removeGroupFromId(group.id);
      }
      TestManager.swapOptions(this.previousOptions);
    });

    it("Open In New Window", async function(){
      let tabIndex = Math.round(this.length/2);
      await TabManager.selectTab(
        tabIndex,
        this.groups[0].id,
        true,
      );

      expect(TestManager.getGroupDeprecated(this.groups, 0).windowId).not.toEqual(browser.windows.WINDOW_ID_NONE);

      await TestManager.splitOnHalfTopScreen(TestManager.getGroupDeprecated(this.groups, 0).windowId);
      let tabs = await TabManager.getTabsInWindowId(TestManager.getGroupDeprecated(this.groups, 0).windowId);

      let nbrDiscarded = TestManager.countDiscardedTabs(tabs);

      expect(tabs[tabIndex].active).toBe(true);
      expect(nbrDiscarded).toEqual(this.length-1);
    });

    it("Switch in current Window", async function(){
      let tabIndex = Math.round(this.length/2);
      await TabManager.selectTab(
        tabIndex,
        this.groups[1].id,
        false,
      );

      expect(TestManager.getGroupDeprecated(this.groups, 1).windowId).not.toEqual(browser.windows.WINDOW_ID_NONE);
      expect(TestManager.getGroupDeprecated(this.groups, 0).windowId).toEqual(browser.windows.WINDOW_ID_NONE);

      let tabs = await TabManager.getTabsInWindowId(TestManager.getGroupDeprecated(this.groups, 1).windowId);

      let nbrDiscarded = TestManager.countDiscardedTabs(tabs);

      expect(tabs[tabIndex].active).toBe(true);
      expect(nbrDiscarded).toEqual(this.length-1);
    });
  });

  describe("Move Tab: ", ()=>{

    describe("Normal Tab", ()=>{
      beforeAll(async function(){
        OptionManager.updateOption("groups-syncNewWindow", false);
        OptionManager.updateOption("pinnedTab-sync", true);
        jasmine.addMatchers(tabGroupsMatchers);
        this.length = 3;
        this.groups = [];
        for( let i=0; i<4; i++) {
          let id, group;
          [id, group] = Session.createGroup({
              tabsLength: this.length,
              global: true,
              pinnedTabs: 0,
              active: 1,
              title: "Debug Move Tabs " + i
            });
          this.groupIndex =
          this.groups.push({
            id: id,
            group: group,
            groupIndex: GroupManager.getGroupIndexFromGroupId(id)
          });
        }

        this.windowId = await WindowManager.openGroupInNewWindow(this.groups[0].id);
        await TestManager.splitOnHalfTopScreen(this.windowId);

        this.windowId_bis = await WindowManager.openGroupInNewWindow(this.groups[1].id);
        await TestManager.splitOnHalfBottomScreen(this.windowId_bis);

        this.getGroup = (id)=>{
          return GroupManager.groups[this.groups[id].groupIndex];
        };
        this.getRandomIndex = (tabs, inPlace=true, pinned=false)=>{
          return TestManager.getRandom(
            pinned?0:tabs.filter(tab=>tab.pinned).length,
            pinned?tabs.filter(tab=>tab.pinned)-inPlace.length:tabs.length-inPlace
          );
        };
      }, TestManager.TIMEOUT);

      afterAll(async function(){
        // Close Window
        if ( this.windowId )
          await browser.windows.remove(this.windowId);
        if ( this.windowId_bis )
          await browser.windows.remove(this.windowId_bis);
        // Remove Group
        for (let group of this.groups ) {
          if ( GroupManager.getGroupIndexFromGroupId(group.id, {error: false}) >= 0 )
            await GroupManager.removeGroupFromId(group.id);
        }
      });

      describe("Sync to Sync: ", ()=>{

        it("Open To Open", async function(){
          // Source Index
          let sourceIndex = this.getRandomIndex(this.getGroup(0).tabs, true, false);
          // Target Index
          let targetIndex = this.getRandomIndex(this.getGroup(1).tabs, false, false);

          let tabId = this.getGroup(0).tabs[sourceIndex].id;
          let tabUrl = this.getGroup(0).tabs[sourceIndex].url;
          let previousLengthSource = this.getGroup(0).tabs.length;
          let previousLengthTarget = this.getGroup(1).tabs.length;

          await TabManager.moveTabBetweenGroups(
            this.groups[0].id,
            sourceIndex,
            this.groups[1].id,
            targetIndex,
          );

          await TabManager.updateTabsInGroup(this.getGroup(0).windowId);
          await TabManager.updateTabsInGroup(this.getGroup(1).windowId);

          let hasSourceTabId = this.getGroup(0).tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId =
            Utils.extractTabUrl(this.getGroup(1).tabs[targetIndex].url) ===
            Utils.extractTabUrl(tabUrl);

          expect(previousLengthSource).toEqual(this.getGroup(0).tabs.length+1);
          expect(previousLengthTarget).toEqual(this.getGroup(1).tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it("Open To Close", async function(){

          // Source Index (Open)
          let sourceIndex = this.getRandomIndex(this.getGroup(1).tabs, true, false);
          // Target Index
          let targetIndex = this.getRandomIndex(this.getGroup(2).tabs, false, false);

          let tabId = this.getGroup(1).tabs[sourceIndex].id;
          let previousLengthSource = this.getGroup(1).tabs.length;
          let previousLengthTarget = this.getGroup(2).tabs.length;

          await TabManager.moveTabBetweenGroups(
            this.groups[1].id,
            sourceIndex,
            this.groups[2].id,
            targetIndex,
          );

          await TabManager.updateTabsInGroup(this.getGroup(1).windowId);

          let hasSourceTabId = this.getGroup(1).tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId = this.getGroup(2).tabs.reduce((acc, tab, index)=>{
            return (tab.id === tabId && index === targetIndex)?true:acc;
          }, false);

          expect(previousLengthSource).toEqual(this.getGroup(1).tabs.length+1);
          expect(previousLengthTarget).toEqual(this.getGroup(2).tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it("Close To Open", async function(){
          // Source Index (Open)
          let sourceIndex = this.getRandomIndex(this.getGroup(2).tabs, true, false);
          // Target Index
          let targetIndex = this.getRandomIndex(this.getGroup(1).tabs, false, false);

          // Id for tabs are not created with Session !!!, set special one
          this.getGroup(2).tabs[sourceIndex].id = -1;
          let tabUrl = this.getGroup(2).tabs[sourceIndex].url;
          let previousLengthSource = this.getGroup(2).tabs.length;
          let previousLengthTarget = this.getGroup(1).tabs.length;

          await TabManager.moveTabBetweenGroups(
            this.groups[2].id,
            sourceIndex,
            this.groups[1].id,
            targetIndex,
          );

          await TabManager.updateTabsInGroup(this.getGroup(1).windowId);

          let hasSourceTabId = this.getGroup(2).tabs.reduce((acc, tab)=>{
            return tab.id === -1?true:acc;
          }, false);

          expect(previousLengthSource).toEqual(this.getGroup(2).tabs.length+1);
          expect(previousLengthTarget).toEqual(this.getGroup(1).tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(Utils.extractTabUrl(this.getGroup(1).tabs[targetIndex].url))
            .toEqual(Utils.extractTabUrl(tabUrl));
        });

        it("Close To Close", async function(){
          // Source Index (Open)
          let sourceIndex = this.getRandomIndex(this.getGroup(3).tabs, true, false);
          // Target Index
          let targetIndex = this.getRandomIndex(this.getGroup(2).tabs, false, false);

          this.getGroup(3).tabs[sourceIndex].id = -1;
          let previousLengthSource = this.getGroup(3).tabs.length;
          let previousLengthTarget = this.getGroup(2).tabs.length;

          await TabManager.moveTabBetweenGroups(
            this.groups[3].id,
            sourceIndex,
            this.groups[2].id,
            targetIndex,
          );

          let hasSourceTabId = this.getGroup(3).tabs.reduce((acc, tab)=>{
            return tab.id === -1?true:acc;
          }, false);

          let hasTargetTabId = this.getGroup(2).tabs[targetIndex].id === -1;

          // Reset index
          this.getGroup(2).tabs[targetIndex].id = 0;

          expect(previousLengthSource).toEqual(this.getGroup(3).tabs.length+1);
          expect(previousLengthTarget).toEqual(this.getGroup(2).tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it("Sync To New", async function(){

          let sourceIndex = this.getRandomIndex(this.getGroup(2).tabs, true, false);
          let previousLengthSource = this.getGroup(2).tabs.length;

          this.getGroup(2).tabs[sourceIndex].id = -1;
          let tabUrl = this.getGroup(2).tabs[sourceIndex].url;

          let newId = await TabManager.moveTabToNewGroup(
            this.groups[2].id,
            sourceIndex,
          );

          let newGroupIndex = GroupManager.getGroupIndexFromGroupId(newId);

          let hasSourceTabId = this.getGroup(2).tabs.reduce((acc, tab)=>{
            return tab.id === -1?true:acc;
          }, false);
          let hasTargetTabId =
            Utils.extractTabUrl(GroupManager.groups[newGroupIndex].tabs[0].url) === Utils.extractTabUrl(tabUrl);

          expect(previousLengthSource).toEqual(this.getGroup(2).tabs.length+1);
          expect(GroupManager.groups[newGroupIndex].tabs.length).toEqual(1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);

          await GroupManager.removeGroupFromId(newId);
        });

      });

      describe("UnSync to Sync: ", ()=>{
        beforeAll(async function(){
          // Unsync window ...
          await WindowManager.desassociateGroupIdToWindow(this.windowId_bis);
        });

        it("Unsync To Open", async function(){
          // Source Index (Open)
          let tabs = await TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          let sourceIndex = this.getRandomIndex(
            tabs,
            true, false);
          // Target Index
          let targetIndex = this.getRandomIndex(this.getGroup(0).tabs, false, false);

          let tabId = tabs[sourceIndex].id;
          let tabUrl = tabs[sourceIndex].url;
          let previousLengthSource = tabs.length;
          let previousLengthTarget = this.getGroup(0).tabs.length;

          await TabManager.moveUnFollowedTabToGroup(
            tabId,
            this.groups[0].id,
          );

          tabs = await TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          await TabManager.updateTabsInGroup(this.getGroup(0).windowId);

          let hasSourceTabId = tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId =
            Utils.extractTabUrl(this.getGroup(0).tabs[this.getGroup(0).tabs.length-1].url) === Utils.extractTabUrl(tabUrl);

          expect(previousLengthSource).toEqual(tabs.length+1);
          expect(previousLengthTarget).toEqual(this.getGroup(0).tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it("Unsync To Close", async function(){
          // Source Index (Open)
          let tabs = await TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          let sourceIndex = this.getRandomIndex(
            tabs,
            true, false);
          // Target Index
          let targetIndex = this.getRandomIndex(this.getGroup(2).tabs, false, false);

          let tabId = tabs[sourceIndex].id;
          let previousLengthSource = tabs.length;
          let previousLengthTarget = this.getGroup(2).tabs.length;

          await TabManager.moveUnFollowedTabToGroup(
            tabId,
            this.groups[2].id,
          );

          await Utils.wait(500); // Chrome don't wait for remove

          tabs = await TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });

          let hasSourceTabId = tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId =
              this.getGroup(2).tabs[this.getGroup(2).tabs.length-1].id === tabId;

          expect(previousLengthSource).toEqual(tabs.length+1);
          expect(previousLengthTarget).toEqual(this.getGroup(2).tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it("Unsync To New", async function(){
          // Source Index (Open)
          let tabs = await TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          let sourceIndex = this.getRandomIndex(
            tabs,
            true, false);

          let tabId = tabs[sourceIndex].id;
          let tabUrl = tabs[sourceIndex].url;
          let previousLengthSource = tabs.length;

          let newId = await TabManager.moveUnFollowedTabToNewGroup(
            tabId
          );

          await Utils.wait(500);

          let newGroupIndex = GroupManager.getGroupIndexFromGroupId(newId);
          tabs = await TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });

          let hasSourceTabId = tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          expect(previousLengthSource).toEqual(tabs.length+1);
          expect(GroupManager.groups[newGroupIndex].tabs.length).toEqual(1);
          expect(hasSourceTabId).toBe(false);
          expect(Utils.extractTabUrl(GroupManager.groups[newGroupIndex].tabs[0].url))
            .toEqual(Utils.extractTabUrl(tabUrl));

          await GroupManager.removeGroupFromId(newId);
        });
      });
    });

    describe("Special Cases", ()=>{
      beforeAll(async function(){
        OptionManager.updateOption("pinnedTab-sync", true);
        jasmine.addMatchers(tabGroupsMatchers);
        this.length = 7;
        this.groups = [];
        for( let i=0; i<4; i++) {
          let id, group;
          [id, group] = Session.createGroup({
              tabsLength: this.length,
              global: true,
              pinnedTabs: (i===3)?0:2,
              active: 3,
              title: "Debug Move Tabs " + i
            });
          this.groupIndex =
          this.groups.push({
            id: id,
            group: group,
            groupIndex: GroupManager.getGroupIndexFromGroupId(id)
          });
        }
        this.getGroup = (id)=>{
          return GroupManager.groups[this.groups[id].groupIndex];
        };
        this.getRandomIndex = (tabs, inPlace=true, pinned=false)=>{
          return TestManager.getRandom(
            pinned?0:tabs.filter(tab=>tab.pinned).length,
            pinned?tabs.filter(tab=>tab.pinned).length-inPlace:tabs.length-inPlace
          );
        };
      }, TestManager.TIMEOUT);

      afterAll(async function(){
        for (let group of this.groups ) {
          if ( GroupManager.getGroupIndexFromGroupId(this.groups[1].id, {error: false}) >= 0 )
            await GroupManager.removeGroupFromId(group.id);
        }
      });

      it("Normal Tab Before Pinned", async function(){
        // Source Index (Open)
        let sourceIndex = this.getRandomIndex(this.getGroup(0).tabs, true, false);
        // Target Index
        let targetIndex = this.getRandomIndex(this.getGroup(1).tabs, true, true);

        this.getGroup(0).tabs[sourceIndex].id = -1;
        let previousLengthSource = this.getGroup(0).tabs.length;
        let previousLengthTarget = this.getGroup(1).tabs.length;

        await TabManager.moveTabBetweenGroups(
          this.groups[0].id,
          sourceIndex,
          this.groups[1].id,
          targetIndex,
        );

        let hasSourceTabId = this.getGroup(0).tabs.reduce((acc, tab)=>{
          return tab.id === -1?true:acc;
        }, false);

        let realPos = this.getGroup(1).tabs.filter(tab=>tab.pinned).length;

        let hasTargetTabId = this.getGroup(1).tabs[realPos].id === -1;

        // Reset index
        this.getGroup(1).tabs[realPos].id = 0;

        expect(previousLengthSource).toEqual(this.getGroup(0).tabs.length+1);
        expect(previousLengthTarget).toEqual(this.getGroup(1).tabs.length-1);
        expect(hasSourceTabId).toBe(false);
        expect(hasTargetTabId).toBe(true);
      });

      it("Pinned Tab after Normal", async function(){
        // Source Index (Open)
        let sourceIndex = this.getRandomIndex(this.getGroup(0).tabs, true, true);
        // Target Index
        let targetIndex = this.getRandomIndex(this.getGroup(1).tabs, true, false)+1;

        this.getGroup(0).tabs[sourceIndex].id = -1;
        let previousLengthSource = this.getGroup(0).tabs.length;
        let previousLengthTarget = this.getGroup(1).tabs.length;

        await TabManager.moveTabBetweenGroups(
          this.groups[0].id,
          sourceIndex,
          this.groups[1].id,
          targetIndex,
        );

        let hasSourceTabId = this.getGroup(0).tabs.reduce((acc, tab)=>{
          return tab.id === -1?true:acc;
        }, false);

        let realPos = this.getGroup(1).tabs.filter(tab=>tab.pinned).length-1;

        let hasTargetTabId = this.getGroup(1).tabs[realPos].id === -1;

        // Reset index
        this.getGroup(1).tabs[realPos].id = 0;

        expect(previousLengthSource).toEqual(this.getGroup(0).tabs.length+1);
        expect(previousLengthTarget).toEqual(this.getGroup(1).tabs.length-1);
        expect(hasSourceTabId).toBe(false);
        expect(hasTargetTabId).toBe(true);
      });

      it("Same Group: Before -> After", async function(){
        // Source Index (Open)
        let sourceIndex = 1;
        // Target Index
        let targetIndex = this.getGroup(3).tabs.length;

        this.getGroup(3).tabs[sourceIndex].id = -1;
        let previousLengthSource = this.getGroup(3).tabs.length;

        await TabManager.moveTabBetweenGroups(
          this.groups[3].id,
          sourceIndex,
          this.groups[3].id,
          targetIndex,
        );

        let hasSourceTabId = this.getGroup(3).tabs[sourceIndex].id === -1;
        let hasTargetTabId = this.getGroup(3).tabs[targetIndex-1].id === -1;

        // Reset index
        this.getGroup(3).tabs[targetIndex-1].id = 0;

        expect(previousLengthSource).toEqual(this.getGroup(3).tabs.length);
        expect(hasSourceTabId).toBe(false);
        expect(hasTargetTabId).toBe(true);
      });

      it("Same Group: After -> Before", async function(){
        // Source Index (Open)
        let sourceIndex = this.getGroup(3).tabs.length-1;
        // Target Index
        let targetIndex = 1;

        this.getGroup(3).tabs[sourceIndex].id = -1;
        let previousLengthSource = this.getGroup(3).tabs.length;

        await TabManager.moveTabBetweenGroups(
          this.groups[3].id,
          sourceIndex,
          this.groups[3].id,
          targetIndex,
        );

        let hasSourceTabId = this.getGroup(3).tabs[sourceIndex].id === -1;
        let hasTargetTabId = this.getGroup(3).tabs[targetIndex].id === -1;

        // Reset index
        this.getGroup(3).tabs[targetIndex].id = 0;

        expect(previousLengthSource).toEqual(this.getGroup(3).tabs.length);
        expect(hasSourceTabId).toBe(false);
        expect(hasTargetTabId).toBe(true);
      });

      it("Last Pos for Normal Tab: ", async function(){
        // Source Index First Not Pinned
        let sourceIndex = this.getGroup(2).tabs
                                .map((tab, index)=> {
                                  if(!tab.pinned) return index;
                                }).filter(i => i)[0];
        // Target Index
        let targetIndex = -1;

        this.getGroup(2).tabs[sourceIndex].id = -1;
        let previousLengthSource = this.getGroup(2).tabs.length;

        await TabManager.moveTabBetweenGroups(
          this.groups[2].id,
          sourceIndex,
          this.groups[2].id,
          targetIndex,
        );

        targetIndex = this.getGroup(2).tabs.length - 1;
        let hasSourceTabId = this.getGroup(2).tabs[sourceIndex].id !== -1;
        let hasTargetTabId = this.getGroup(2).tabs[targetIndex].id === -1;

        // Reset index
        this.getGroup(2).tabs[targetIndex].id = 0;

        expect(previousLengthSource).toEqual(this.getGroup(2).tabs.length);
        expect(hasSourceTabId).toBe(false);
        expect(hasTargetTabId).toBe(true);
      });

      it("Last Pos for Pinned Tab: ", async function(){
        // Source Index First Not Pinned
        let sourceIndex = 0;
        // Target Index
        let targetIndex = -1;

        this.getGroup(2).tabs[sourceIndex].id = -1;
        let previousLengthSource = this.getGroup(2).tabs.length;

        await TabManager.moveTabBetweenGroups(
          this.groups[2].id,
          sourceIndex,
          this.groups[2].id,
          targetIndex,
        );

        targetIndex = this.getGroup(2).tabs.filter(t=>t.pinned).length - 1;
        let hasSourceTabId = this.getGroup(2).tabs[sourceIndex].id !== -1;
        let hasTargetTabId = this.getGroup(2).tabs[targetIndex].id === -1;

        // Reset index
        this.getGroup(2).tabs[targetIndex].id = 0;

        expect(previousLengthSource).toEqual(this.getGroup(2).tabs.length);
        expect(hasSourceTabId).toBe(false);
        expect(hasTargetTabId).toBe(true);
      });
    });
  });

  describe("Undiscard home made method - ", ()=>{
    beforeAll(function(){
      // Add tabs and groups matchers
      jasmine.addMatchers(tabGroupsMatchers);

      // Create Groups
      [this.groupIds, this.groups] = Session.createArrayGroups({
        groupsLength: 5,
        tabsLength: [4,3,3,3,4],
        lazyMode: false,
        global: true,
        active: -1,
        title:"Undiscard",
      })

      this.previousOptions = TestManager.swapOptions({
        "groups-discardedOpen": true,
      })

    });

    afterAll(async function(){
      await TestManager.removeGroups(this.groupIds)

      TestManager.swapOptions(this.previousOptions);
    });

    it("On 4 tabs in 1 window", async function(){
      try {
        this.windowIds = await WindowManager.openGroupInNewWindow(this.groups[0].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let expectedTabs = Utils.getCopy(this.groups[0].tabs);
        expectedTabs.forEach((tab)=>{
          tab.url = Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });

        await Controller.undiscardAll();

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds);
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowIds,{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(expectedTabs);

      } catch(e) {
        console.error(e);
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

    it("On 6 tabs in 2 window", async function(){
      try {
        let group1 = 1, group2 = 2;
        let expectedTabs = [], resultingTabs = [];
        this.windowIds = [0];

        this.windowIds[0] = await WindowManager.openGroupInNewWindow(this.groups[group1].id);
        this.windowIds[1] = await WindowManager.openGroupInNewWindow(this.groups[group2].id);

        await TestManager.splitOnHalfScreen(this.windowIds[0]);
        await TestManager.splitOnHalfScreen(this.windowIds[1]);

        expectedTabs[0] = Utils.getCopy(this.groups[group1].tabs);
        expectedTabs[0].forEach((tab)=>{
          tab.url = Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });
        expectedTabs[1] = Utils.getCopy(this.groups[group2].tabs);
        expectedTabs[1].forEach((tab)=>{
          tab.url = Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });

        await Controller.undiscardAll();

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds[0]);
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds[1]);
        resultingTabs[0] = await TabManager.getTabsInWindowId(
          this.windowIds[0],{
            withoutRealUrl: false,
            withPinned: true,
          });
        resultingTabs[1] = await TabManager.getTabsInWindowId(
          this.windowIds[1],{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs[0]).toEqualTabs(expectedTabs[0]);
        expect(resultingTabs[1]).toEqualTabs(expectedTabs[1]);

      } catch(e) {
        console.error(e);
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

    it("Add new discarded tabs while undiscarding", async function(){
      try {
        this.windowIds = await WindowManager.openGroupInNewWindow(this.groups[3].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let newTab = Session.getRandomNormalTab();

        let expectedTabs = Utils.getCopy(this.groups[3].tabs);
        expectedTabs.push(newTab);
        expectedTabs.forEach((tab, index)=>{
          tab.url = Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
          tab.index = index;
        });

        await Controller.undiscardAll(0, ()=>{
          TabManager.openListOfTabs(
            [newTab],
            this.windowIds,{
              inLastPos: true,
          });
        });

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds);
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowIds,{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(expectedTabs);

      } catch(e) {
        console.error(e);
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

    it("While undiscarding, a tab in the queue is removed", async function(){
      try {
        this.windowIds = await WindowManager.openGroupInNewWindow(this.groups[4].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let newTab = Session.getRandomNormalTab();

        let expectedTabs = Utils.getCopy(this.groups[4].tabs);
        expectedTabs.splice(this.groups[4].tabs.length-2, 1);
        expectedTabs.forEach((tab, index)=>{
          tab.url = Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
          tab.index = index;
        });

        await Controller.undiscardAll(0, ()=>{
          GroupManager.removeTabFromIndexInGroupId(
            this.groups[4].id,
            this.groups[4].tabs.length-2
          );
        });

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds);
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowIds,{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(expectedTabs);

      } catch(e) {
        console.error(e);
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

  });
});
