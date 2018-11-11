import TestManager from '../../utils/TestManager'
import tabGroupsMatchers from '../../utils/tabGroupsMatchers'
import Session from '../../examples/session'

describe("window.Background.TabManager", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  describe("Select Tab: ", ()=>{

    beforeAll(async function() {
      // Create Group
      this.length = 7;
      [this.id, this.group] = Session.createGroup({
        tabsLength: this.length,
        global: true,
        pinnedTabs: 0,
        active: 5,
        title: "Debug Select Tab",
      });
      this.lastIndex = this.length-1;
      this.middleIndex = parseInt(this.length/2);
      this.firstIndex = 0;
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

    describe("Group With No Pinned Tab", ()=>{

      describe("and Included Pinned Tabs: ", ()=>{

        beforeAll(function() {
          // Set option: Pinned tab Included
          window.Background.OptionManager.updateOption("pinnedTab-sync", true);
        });

        it("Select last...", async function() {
          await window.Background.TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function() {
          await window.Background.TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function() {
          await window.Background.TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.firstIndex].active).toBe(true);
        });
      });

      describe("and Excluded Pinned Tabs: ", ()=>{
        beforeAll(function() {
          // Set option: Pinned tab Excluded
          window.Background.OptionManager.updateOption("pinnedTab-sync", false);
        });

        it("Select last...", async function() {
          await window.Background.TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function() {
          await window.Background.TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function() {
          await window.Background.TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.firstIndex].active).toBe(true);
        });
      });

    });

    describe("Group With 2 Pinned Tabs", ()=>{

      beforeAll(async function() {
        // Add 2 Pinned Tabs
        await Session.addTabToGroup(
          this.id,
          Session.getFakeTab({
            pinned: true,
          })
        );
        await Session.addTabToGroup(
          this.id,
          Session.getFakeTab({
            pinned: true,
          })
        );
        await window.Background.Utils.wait(400);
      });

      describe("Without Pinned Tabs (Excluded): ", ()=>{
        beforeAll(function() {
          // Set option: Pinned tab Excluded
          window.Background.OptionManager.updateOption("pinnedTab-sync", false);
        });

        it("Select last...", async function() {
          await window.Background.TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function() {
          await window.Background.TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function() {
          await window.Background.TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.firstIndex].active).toBe(true);
        });
      });

      describe("With Pinned Tabs Included: ", function() {
        beforeAll(async function() {
          // Set option: Pinned tab Excluded
          window.Background.OptionManager.updateOption("pinnedTab-sync", true);
          this.length = 9;
          this.lastIndex = this.length-1;
          this.middleIndex = parseInt(this.length/2);
          this.firstIndex = 0;
          await window.Background.Utils.wait(400);
        });

        it("Select last...", async function() {
          await window.Background.TabManager.selectTab(
            this.lastIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.lastIndex].active).toBe(true);
        });

        it("Select Middle...", async function() {
          await window.Background.TabManager.selectTab(
            this.middleIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.middleIndex].active).toBe(true);
        });

        it("Select first...", async function() {
          await window.Background.TabManager.selectTab(
            this.firstIndex,
            this.id
          );
          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
          const tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId);

          expect(tabs[this.firstIndex].active).toBe(true);
        });
      });

    });
  });

  describe("Select Tab and Switch (Open): ", ()=>{
    beforeAll(function() {
      jasmine.addMatchers(tabGroupsMatchers);
      this.length = 4;
      this.groups = [];

      TestManager.changeSomeOptions({
        "groups-discardedOpen": true,
      });

      this.discardedOption = window.Background.OptionManager.ma

      for (let i=0; i<2; i++) {
        let id, group;
        [id, group] = Session.createGroup({
          tabsLength: this.length,
          global: true,
          pinnedTabs: 0,
          active: -1,
          lazyMode: true,
          title: "Debug Select Tab and Switch " + i,
        });
        this.groups.push({
          id: id,
          group: group,
          groupIndex: window.Background.GroupManager.getGroupIndexFromGroupId(id),
        });
      }
    });

    afterAll(async function() {
      if (TestManager.getGroupDeprecated(this.groups, 1).windowId >= 0) {
        await browser.windows.remove(TestManager.getGroupDeprecated(this.groups, 1).windowId);
      }
      for (let group of this.groups) {
        if (window.Background.GroupManager.getGroupIndexFromGroupId(group.id, {error: false}) >= 0)
          await window.Background.GroupManager.removeGroupFromId(group.id);
      }
    });

    it("Open In New Window", async function() {
      let tabIndex = Math.round(this.length/2);
      await window.Background.TabManager.selectTab(
        tabIndex,
        this.groups[0].id,
        true,
      );

      expect(TestManager.getGroupDeprecated(this.groups, 0).windowId).not.toEqual(browser.windows.WINDOW_ID_NONE);

      await TestManager.splitOnHalfTopScreen(TestManager.getGroupDeprecated(this.groups, 0).windowId);
      let tabs = await window.Background.TabManager.getTabsInWindowId(TestManager.getGroupDeprecated(this.groups, 0).windowId);

      let nbrDiscarded = TestManager.countDiscardedTabs(tabs);

      expect(tabs[tabIndex].active).toBe(true);
      expect(nbrDiscarded).toEqual(this.length-1);
    });

    it("Switch in current Window", async function() {
      let tabIndex = Math.round(this.length/2);
      await window.Background.TabManager.selectTab(
        tabIndex,
        this.groups[1].id,
        false,
      );

      expect(TestManager.getGroupDeprecated(this.groups, 1).windowId).not.toEqual(browser.windows.WINDOW_ID_NONE);
      expect(TestManager.getGroupDeprecated(this.groups, 0).windowId).toEqual(browser.windows.WINDOW_ID_NONE);

      let tabs = await window.Background.TabManager.getTabsInWindowId(TestManager.getGroupDeprecated(this.groups, 1).windowId);

      let nbrDiscarded = TestManager.countDiscardedTabs(tabs);

      expect(tabs[tabIndex].active).toBe(true);
      expect(nbrDiscarded).toEqual(this.length-1);
    });
  });

  describe(".Move", ()=>{

    describe(" between windows a normal tab", ()=>{
      beforeAll(async function() {
        window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
        window.Background.OptionManager.updateOption("pinnedTab-sync", true);
        jasmine.addMatchers(tabGroupsMatchers);

        this.windowId = (await browser.windows.create()).id;
        await TestManager.splitOnHalfTopScreen(this.windowId);

        this.windowId_bis = (await browser.windows.create()).id;
        await TestManager.splitOnHalfBottomScreen(this.windowId_bis);

        this.getGroup = (id)=>{
          return window.Background.GroupManager.groups[this.groups[id].groupIndex];
        };
      }, TestManager.TIMEOUT);

      afterAll(async function() {
        // Close Window
        if (this.windowId)
          await browser.windows.remove(this.windowId);
        if (this.windowId_bis)
          await browser.windows.remove(this.windowId_bis);
      });

      // Keep test session clean in between :)
      beforeEach(async function() {
        await TestManager.clearWindow(this.windowId);
        await TestManager.clearWindow(this.windowId_bis);

        [this.ids, this.groups] = Session.createArrayGroups({
          groupsLength: 4,
          tabsLength: 4,
          global: true,
          pinnedTabs: 0,
          active: 1,
          title: "Debug Move Tabs ",
        });

        this.indexes = this.ids.map(id => window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}));

        this.group_open_1 = window.Background.GroupManager.groups[this.indexes[0]];
        this.group_open_2 = window.Background.GroupManager.groups[this.indexes[1]];
        this.group_close_1 = window.Background.GroupManager.groups[this.indexes[2]];
        this.group_close_2 = window.Background.GroupManager.groups[this.indexes[3]];

        await window.Background.WindowManager.openGroupInWindow(this.ids[0], this.windowId);
        await window.Background.WindowManager.openGroupInWindow(this.ids[1], this.windowId_bis);
      });

      afterEach(async function() {
        // Remove Group
        for (let id of this.ids) {
          if (window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0)
            await window.Background.GroupManager.removeGroupFromId(id);
        }

        await TestManager.clearWindow(this.windowId);
        await TestManager.clearWindow(this.windowId_bis);
      });

      describe(" from a Group", ()=>{

        it(" Open to another Open Group", async function() {
          // Source Index
          let sourceIndex = TestManager.getRandomIndex(this.group_open_1.tabs, true, false);
          // Target Index
          let targetIndex = TestManager.getRandomIndex(this.group_open_2.tabs, false, false);

          let tabId = this.group_open_1.tabs[sourceIndex].id;
          let tabUrl = this.group_open_1.tabs[sourceIndex].url;
          let previousLengthSource = this.group_open_1.tabs.length;
          let previousLengthTarget = this.group_open_2.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_open_1.id,
            sourceIndex,
            this.group_open_2.id,
            targetIndex,
          );

          await window.Background.TabManager.updateTabsInGroup(this.group_open_1.windowId);
          await window.Background.TabManager.updateTabsInGroup(this.group_open_2.windowId);

          let hasSourceTabId = this.group_open_1.tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId =
            window.Background.Utils.extractTabUrl(this.group_open_2.tabs[targetIndex].url) ===
            window.Background.Utils.extractTabUrl(tabUrl);

          expect(previousLengthSource).toEqual(this.group_open_1.tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_open_2.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" Open to a Closed Group", async function() {

          // Source Index (Open)
          let sourceIndex = TestManager.getRandomIndex(this.group_open_1.tabs, true, false);
          // Target Index
          let targetIndex = TestManager.getRandomIndex(this.group_close_1.tabs, false, false);

          let tabId = this.group_open_1.tabs[sourceIndex].id,
            tabUrl = this.group_open_1.tabs[sourceIndex].url;
          let previousLengthSource = this.group_open_1.tabs.length;
          let previousLengthTarget = this.group_close_1.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_open_1.id,
            sourceIndex,
            this.group_close_1.id,
            targetIndex,
          );

          await window.Background.TabManager.updateTabsInGroup(this.group_open_1.windowId);

          let hasSourceTabId = this.group_open_1.tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId = this.group_close_1.tabs.reduce((acc, tab, index)=>{
            return (tab.url === tabUrl && index === targetIndex)?true:acc;
          }, false);

          expect(previousLengthSource).toEqual(this.group_open_1.tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_close_1.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" Closed to an Open Group", async function() {
          // Source Index (Open)
          let sourceIndex = TestManager.getRandomIndex(this.group_close_1.tabs, true, false);
          // Target Index
          let targetIndex = TestManager.getRandomIndex(this.group_open_1.tabs, false, false);

          // Id for tabs are not created with Session !!!, set special one
          this.group_close_1.tabs[sourceIndex].id = -1;
          let tabUrl = this.group_close_1.tabs[sourceIndex].url;
          let previousLengthSource = this.group_close_1.tabs.length;
          let previousLengthTarget = this.group_open_1.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_close_1.id,
            sourceIndex,
            this.group_open_1.id,
            targetIndex,
          );

          await window.Background.TabManager.updateTabsInGroup(this.group_open_1.windowId);

          let hasSourceTabId = this.group_close_1.tabs.reduce((acc, tab)=>{
            return tab.id === -1?true:acc;
          }, false);

          expect(previousLengthSource).toEqual(this.group_close_1.tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_open_1.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(window.Background.Utils.extractTabUrl(this.group_open_1.tabs[targetIndex].url))
            .toEqual(window.Background.Utils.extractTabUrl(tabUrl));
        });

        it(" Closed to another Closed Group", async function() {
          // Source Index (Open)
          let sourceIndex = TestManager.getRandomIndex(this.group_close_1.tabs, true, false);
          // Target Index
          let targetIndex = TestManager.getRandomIndex(this.group_close_2.tabs, false, false);

          let tabId = this.group_close_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_close_1.tabs.length;
          let previousLengthTarget = this.group_close_2.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_close_1.id,
            sourceIndex,
            this.group_close_2.id,
            targetIndex,
          );

          let hasSourceTabId = this.group_close_1.tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId = this.group_close_2.tabs[targetIndex].id === tabId;

          expect(previousLengthSource).toEqual(this.group_close_1.tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_close_2.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" Open to a New Group", async function() {

          let sourceIndex = TestManager.getRandomIndex(this.group_open_1.tabs, true, false);
          let previousLengthSource = this.group_open_1.tabs.length;

          let tabId = this.group_open_1.tabs[sourceIndex].id;
          let tabUrl = this.group_open_1.tabs[sourceIndex].url;

          let newId = await window.Background.TabManager.moveTabToNewGroup(
            this.group_open_1.id,
            sourceIndex,
          );
          await window.Background.TabManager.updateTabsInGroup(this.group_open_1.windowId);

          let newGroupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(newId);

          let hasSourceTabId = this.group_open_1.tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);
          let hasTargetTabId =
            window.Background.Utils.extractTabUrl(window.Background.GroupManager.groups[newGroupIndex].tabs[0].url) === window.Background.Utils.extractTabUrl(tabUrl);

          expect(previousLengthSource).toEqual(this.group_open_1.tabs.length+1);
          expect(window.Background.GroupManager.groups[newGroupIndex].tabs.length).toEqual(1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);

          await window.Background.GroupManager.removeGroupFromId(newId);
        });

      });

      describe(" from an ungrouped window", ()=>{
        beforeAll(async function() {
          // Unsync window ...
          await window.Background.WindowManager.desassociateGroupIdToWindow(this.windowId_bis);
        });

        it(" to an Open Group", async function() {
          // Source Index (Open)
          let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          let sourceIndex = TestManager.getRandomIndex(
            tabs,
            true, false);
          // Target Index
          TestManager.getRandomIndex(this.group_open_1.tabs, false, false);

          let tabId = tabs[sourceIndex].id;
          let tabUrl = tabs[sourceIndex].url;
          let previousLengthSource = tabs.length;
          let previousLengthTarget = this.group_open_1.tabs.length;

          await window.Background.TabManager.moveUnFollowedTabToGroup(
            tabId,
            this.group_open_1.id,
          );

          tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          await window.Background.TabManager.updateTabsInGroup(this.group_open_1.windowId);

          let hasSourceTabId = tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId =
            window.Background.Utils.extractTabUrl(this.group_open_1.tabs[this.group_open_1.tabs.length-1].url) === window.Background.Utils.extractTabUrl(tabUrl);

          expect(previousLengthSource).toEqual(tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_open_1.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" to a closed Group", async function() {
          // Source Index (Open)
          let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          let sourceIndex = TestManager.getRandomIndex(
            tabs,
            true, false);
          // Target Index
          TestManager.getRandomIndex(this.group_close_1.tabs, false, false);

          let tabId = tabs[sourceIndex].id;
          let tabUrl = tabs[sourceIndex].url;
          let previousLengthSource = tabs.length;
          let previousLengthTarget = this.group_close_1.tabs.length;

          await window.Background.TabManager.moveUnFollowedTabToGroup(
            tabId,
            this.group_close_1.id,
          );

          await window.Background.TabManager.waitTabsToBeClosed([tabId]);

          tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });

          let hasSourceTabId = tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let hasTargetTabId =
              this.group_close_1.tabs[this.group_close_1.tabs.length-1].url === tabUrl;

          expect(previousLengthSource).toEqual(tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_close_1.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" to a new Group", async function() {
          // Source Index (Open)
          let tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });
          let sourceIndex = TestManager.getRandomIndex(
            tabs,
            true, false);

          let tabId = tabs[sourceIndex].id;
          let tabUrl = tabs[sourceIndex].url;
          let previousLengthSource = tabs.length;

          let newId = await window.Background.TabManager.moveUnFollowedTabToNewGroup(
            tabId
          );

          await window.Background.TabManager.waitTabsToBeClosed([tabId]);

          let newGroupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(newId);
          tabs = await window.Background.TabManager.getTabsInWindowId(this.windowId_bis, {
            withPinned: true,
          });

          let hasSourceTabId = tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          expect(previousLengthSource).toEqual(tabs.length+1);
          expect(window.Background.GroupManager.groups[newGroupIndex].tabs.length).toEqual(1);
          expect(hasSourceTabId).toBe(false);
          expect(window.Background.Utils.extractTabUrl(window.Background.GroupManager.groups[newGroupIndex].tabs[0].url))
            .toEqual(window.Background.Utils.extractTabUrl(tabUrl));

          await window.Background.GroupManager.removeGroupFromId(newId);
        });
      });
    });

    describe("Special Cases", ()=>{

      beforeEach(async function() {
        [this.ids, this.groups] = Session.createArrayGroups({
          groupsLength: 3,
          tabsLength: 7,
          pinnedTabs: [2,2,0],
          global: true,
          active: 1,
          title: "Debug Move Tabs ",
        });

        this.indexes = this.ids.map(id => window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}));

        this.group_pinned_1 = window.Background.GroupManager.groups[this.indexes[0]];
        this.group_pinned_2 = window.Background.GroupManager.groups[this.indexes[1]];
        this.group_without_pinned_1 = window.Background.GroupManager.groups[this.indexes[2]];
      });

      afterEach(async function() {
        // Remove Group
        for (let id of this.ids) {
          if (window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0)
            await window.Background.GroupManager.removeGroupFromId(id);
        }
      });

      describe(" in the same group", ()=>{
        it(" from before to after position", async function() {
          // Source Index
          let sourceIndex = 1;
          // Target Index
          let targetIndex = this.group_without_pinned_1.tabs.length;

          let tabId = this.group_without_pinned_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_without_pinned_1.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_without_pinned_1.id,
            sourceIndex,
            this.group_without_pinned_1.id,
            targetIndex,
          );

          let hasSourceTabId = this.group_without_pinned_1.tabs[sourceIndex].id === tabId;
          let hasTargetTabId = this.group_without_pinned_1.tabs[targetIndex-1].id === tabId;

          expect(previousLengthSource).toEqual(this.group_without_pinned_1.tabs.length);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" from after to before position", async function() {
          // Source Index
          let sourceIndex = this.group_without_pinned_1.tabs.length-1;
          // Target Index
          let targetIndex = 1;

          let tabId = this.group_without_pinned_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_without_pinned_1.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_without_pinned_1.id,
            sourceIndex,
            this.group_without_pinned_1.id,
            targetIndex,
          );

          let hasSourceTabId = this.group_without_pinned_1.tabs[sourceIndex].id === tabId;
          let hasTargetTabId = this.group_without_pinned_1.tabs[targetIndex].id === tabId;

          expect(previousLengthSource).toEqual(this.group_without_pinned_1.tabs.length);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });
      });

      describe(" while respectiong pinned constraint", ()=>{
        it(" so a normal tab can't move before a pinned tab", async function() {
          // Source Index (Open)
          let sourceIndex = TestManager.getRandomIndex(this.group_pinned_1.tabs, true, false);
          // Target Index
          let targetIndex = TestManager.getRandomIndex(this.group_pinned_2.tabs, true, true);

          let tabId = this.group_pinned_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_pinned_1.tabs.length;
          let previousLengthTarget = this.group_pinned_2.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_pinned_1.id,
            sourceIndex,
            this.group_pinned_2.id,
            targetIndex,
          );

          let hasSourceTabId = this.group_pinned_1.tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let realPos = this.group_pinned_2.tabs.filter(tab=>tab.pinned).length;

          let hasTargetTabId = this.group_pinned_2.tabs[realPos].id === tabId;

          expect(previousLengthSource).toEqual(this.group_pinned_1.tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_pinned_2.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" so a pinned tab can't move after a normal tab", async function() {
          // Source Index (Open)
          let sourceIndex = TestManager.getRandomIndex(this.group_pinned_1.tabs, true, true);
          // Target Index
          let targetIndex = TestManager.getRandomIndex(this.group_pinned_2.tabs, true, false)+1;

          let tabId = this.group_pinned_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_pinned_1.tabs.length;
          let previousLengthTarget = this.group_pinned_2.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_pinned_1.id,
            sourceIndex,
            this.group_pinned_2.id,
            targetIndex,
          );

          let hasSourceTabId = this.group_pinned_1.tabs.reduce((acc, tab)=>{
            return tab.id === tabId?true:acc;
          }, false);

          let realPos = this.group_pinned_2.tabs.filter(tab=>tab.pinned).length-1;

          let hasTargetTabId = this.group_pinned_2.tabs[realPos].id === tabId;

          expect(previousLengthSource).toEqual(this.group_pinned_1.tabs.length+1);
          expect(previousLengthTarget).toEqual(this.group_pinned_2.tabs.length-1);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });
      })

      describe(" to the last position", ()=>{

        it(" for a normal tab", async function() {
          // Source Index First Not Pinned
          let sourceIndex = 0;
          let targetIndex = -1;

          let tabId = this.group_without_pinned_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_without_pinned_1.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_without_pinned_1.id,
            sourceIndex,
            this.group_without_pinned_1.id,
            targetIndex,
          );

          targetIndex = this.group_without_pinned_1.tabs.length - 1;
          let hasSourceTabId = this.group_without_pinned_1.tabs[sourceIndex].id === tabId;
          let hasTargetTabId = this.group_without_pinned_1.tabs[targetIndex].id === tabId;

          expect(previousLengthSource).toEqual(this.group_without_pinned_1.tabs.length);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });

        it(" for a pinned tab", async function() {
          // Source Index First Not Pinned
          let sourceIndex = 0;
          // Target Index
          let targetIndex = -1;

          let tabId = this.group_pinned_1.tabs[sourceIndex].id;
          let previousLengthSource = this.group_pinned_1.tabs.length;

          await window.Background.TabManager.moveTabBetweenGroups(
            this.group_pinned_1.id,
            sourceIndex,
            this.group_pinned_1.id,
            targetIndex,
          );

          targetIndex = this.group_pinned_1.tabs.filter(t=>t.pinned).length - 1;
          let hasSourceTabId = this.group_pinned_1.tabs[sourceIndex].id === tabId;
          let hasTargetTabId = this.group_pinned_1.tabs[targetIndex].id === tabId;

          expect(previousLengthSource).toEqual(this.group_pinned_1.tabs.length);
          expect(hasSourceTabId).toBe(false);
          expect(hasTargetTabId).toBe(true);
        });
      })

    });
  });

  describe("Undiscard home made method - ", ()=>{
    beforeEach(function() {
      if (!window.Background.Utils.isChrome()) {
        pending("Firefox is not able to undiscard all tabs...")
      }
    });

    beforeAll(function() {
      // Add tabs and groups matchers
      jasmine.addMatchers(tabGroupsMatchers);

      // Create Groups
      [this.groupIds, this.groups] = Session.createArrayGroups({
        groupsLength: 5,
        tabsLength: [4,3,3,3,4],
        lazyMode: false,
        global: true,
        active: -1,
        title: "Undiscard",
      })

      TestManager.changeSomeOptions({
        "groups-discardedOpen": true,
      })

    });

    afterAll(async function() {
      await TestManager.removeGroups(this.groupIds)
    });

    it("On 4 tabs in 1 window", async function() {
      if (!window.Background.Utils.isChrome()) {
        return;
      }
      try {
        this.windowIds = await window.Background.WindowManager.openGroupInNewWindow(this.groups[0].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let expectedTabs = window.Background.Utils.getCopy(this.groups[0].tabs);
        expectedTabs.forEach((tab)=>{
          tab.url = window.Background.Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });

        await window.Background.TabManager.undiscardAll();

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowIds,{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(expectedTabs);

      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

    it("On 6 tabs in 2 window", async function() {
      if (!window.Background.Utils.isChrome()) {
        return;
      }
      try {
        let group1 = 1, group2 = 2;
        let expectedTabs = [], resultingTabs = [];
        this.windowIds = [0];

        this.windowIds[0] = await window.Background.WindowManager.openGroupInNewWindow(this.groups[group1].id);
        this.windowIds[1] = await window.Background.WindowManager.openGroupInNewWindow(this.groups[group2].id);

        await TestManager.splitOnHalfScreen(this.windowIds[0]);
        await TestManager.splitOnHalfScreen(this.windowIds[1]);

        expectedTabs[0] = window.Background.Utils.getCopy(this.groups[group1].tabs);
        expectedTabs[0].forEach((tab)=>{
          tab.url = window.Background.Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });
        expectedTabs[1] = window.Background.Utils.getCopy(this.groups[group2].tabs);
        expectedTabs[1].forEach((tab)=>{
          tab.url = window.Background.Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
        });

        await window.Background.TabManager.undiscardAll();

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds[0]);
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds[1]);
        resultingTabs[0] = await window.Background.TabManager.getTabsInWindowId(
          this.windowIds[0],{
            withoutRealUrl: false,
            withPinned: true,
          });
        resultingTabs[1] = await window.Background.TabManager.getTabsInWindowId(
          this.windowIds[1],{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs[0]).toEqualTabs(expectedTabs[0]);
        expect(resultingTabs[1]).toEqualTabs(expectedTabs[1]);

      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

    it("Add new discarded tabs while undiscarding", async function() {
      if (!window.Background.Utils.isChrome()) {
        return;
      }
      try {
        this.windowIds = await window.Background.WindowManager.openGroupInNewWindow(this.groups[3].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let newTab = Session.getFakeTab();

        let expectedTabs = window.Background.Utils.getCopy(this.groups[3].tabs);
        expectedTabs.push(newTab);
        expectedTabs.forEach((tab, index)=>{
          tab.url = window.Background.Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
          tab.index = index;
        });

        await window.Background.TabManager.undiscardAll(0, ()=>{
          window.Background.TabManager.openListOfTabs(
            [newTab],
            this.windowIds,{
              inLastPos: true,
            });
        });

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds);
        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowIds,{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(expectedTabs);

      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

    it("While undiscarding, a tab in the queue is removed", async function() {
      if (!window.Background.Utils.isChrome()) {
        return;
      }
      try {
        this.windowIds = await window.Background.WindowManager.openGroupInNewWindow(this.groups[4].id);
        await TestManager.splitOnHalfScreen(this.windowIds);

        let expectedTabs = window.Background.Utils.getCopy(this.groups[4].tabs);
        expectedTabs.splice(this.groups[4].tabs.length-2, 1);
        expectedTabs.forEach((tab, index)=>{
          tab.url = window.Background.Utils.extractLazyUrl(tab.url);
          tab.discarded = !tab.active;
          tab.index = index;
        });

        await window.Background.TabManager.undiscardAll(0, ()=>{
          window.Background.GroupManager.removeTabFromIndexInGroupId(
            this.groups[4].id,
            this.groups[4].tabs.length-2
          );
        });

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowIds);
        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowIds,{
            withoutRealUrl: false,
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(expectedTabs);

      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      } finally {
        await TestManager.closeWindows(this.windowIds);
      }
    });

  });

  describe(".waitTabsToBeClosed", ()=>{
    beforeAll(async function() {
      this.windowId = await TestManager.openWindow();
    });

    // Keep test session clean in between :)
    afterEach(async function() {
      await TestManager.clearWindow(this.windowId);
    });

    beforeEach(async function() {
      await TestManager.clearWindow(this.windowId);
    });

    afterAll(async function() {
      await TestManager.closeWindows(this.windowId);
    })

    it(' to wait tabs to be closed in 1 window and return true', async function() {
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});

      const openTabs = await window.Background.TabManager.openListOfTabs(tabs, this.windowId);
      const tabsToRemove = openTabs.splice(0,3).map(tab=>tab.id);

      setTimeout(()=>{
        browser.tabs.remove(tabsToRemove);
      }, 250);

      const result = await window.Background.TabManager.waitTabsToBeClosed(tabsToRemove);

      const tabsInWindow = await browser.tabs.query({windowId: this.windowId});
      const tabsInWindowIds = tabsInWindow.map(tab=>tab.id);

      expect(result).toBe(true);
      expect(tabsInWindow.length).toBe(tabsLength+1-tabsToRemove.length);
      tabsToRemove.forEach((id)=>{
        expect(tabsInWindowIds.indexOf(id)).toBe(-1);
      });
    });

    it(' to wait tabs to be closed in 2 windows and return true', async function() {
      const windowId_bis = await TestManager.openWindow();

      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength});

      let openTabs, tabsToRemove;

      await TestManager.focusedWindow(this.windowId);
      openTabs = await window.Background.TabManager.openListOfTabs(tabs, this.windowId);
      tabsToRemove = openTabs.splice(0,2).map(tab=>tab.id);

      await TestManager.focusedWindow(windowId_bis);
      openTabs = await window.Background.TabManager.openListOfTabs(tabs, windowId_bis);
      tabsToRemove = tabsToRemove.concat(
        openTabs.splice(0,2).map(tab=>tab.id)
      );

      setTimeout(()=>{
        browser.tabs.remove(tabsToRemove);
      }, 250);

      const result = await window.Background.TabManager.waitTabsToBeClosed(tabsToRemove);

      let tabsInWindow = await browser.tabs.query({windowId: this.windowId});
      tabsInWindow = tabsInWindow.concat(
        await browser.tabs.query({windowId: windowId_bis})
      );

      const tabsInWindowIds = tabsInWindow.map(tab=>tab.id);

      expect(result).toBe(true);
      expect(tabsInWindow.length).toBe(
        (tabsLength+1)*2
        -tabsToRemove.length
      );
      tabsToRemove.forEach((id)=>{
        expect(tabsInWindowIds.indexOf(id)).toBe(-1);
      });

      await TestManager.closeWindows(windowId_bis);
    });

    it(' to wait tabs that never closed and return false', async function() {
      const tabs = await browser.tabs.query({windowId: this.windowId});

      const result = await window.Background.TabManager.waitTabsToBeClosed(tabs.map(tab=>tab.id));

      expect(result).toBe(false);
    });
  });
});
