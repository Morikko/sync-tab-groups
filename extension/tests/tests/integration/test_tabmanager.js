describe("TabManager", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

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
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.firstIndex].active).toBe(true);
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
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.firstIndex].active).toBe(true);
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
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.firstIndex].active).toBe(true);
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
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function(){
          await TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function(){
          await TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await TabManager.getTabsInWindowId(this.windowId);
          expect(tabs[this.firstIndex].active).toBe(true);
        });
      });

    });
  });

  describe("Select Tab and Switch (Open): ", ()=>{
    beforeAll(function(){
      jasmine.addMatchers(tabGroupsMatchers);
      this.length = 4;
      this.groups = [];

      TestManager.changeSomeOptions({
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

      TestManager.changeSomeOptions({
        "groups-discardedOpen": true,
      })

    });

    afterAll(async function(){
      await TestManager.removeGroups(this.groupIds)
    });

    it("On 4 tabs in 1 window", async function(){
      if ( !Utils.isChrome()) {
        return;
      }
      try {
        this.windowIds = await WindowManager.openGroupInNewWindow(this.groups[0].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let expectedTabs = Utils.getCopy(this.groups[0].tabs);
        expectedTabs.forEach((tab)=>{
          tab.url = Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });

        await TabManager.undiscardAll();

        console.log("Undiscard done")

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
      if ( !Utils.isChrome()) {
        return;
      }
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

        await TabManager.undiscardAll();

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
      if ( !Utils.isChrome()) {
        return;
      }
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

        await TabManager.undiscardAll(0, ()=>{
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
      if ( !Utils.isChrome()) {
        return;
      }
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

        await TabManager.undiscardAll(0, ()=>{
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
