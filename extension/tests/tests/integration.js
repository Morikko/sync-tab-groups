describe("TabManager - Tab Creation ", ()=>{

  beforeAll(async function(){
    // Create Window
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
      this.windowId,
      true, // Without fancy url
      true, // Force pinned
    );
  });

  describe("Normal tabs - ", ()=>{
    describe("openListOfTabs - ", ()=>{
      it("Do not open again, if only new tab", async function(){
        let tabId = this.previousTabs[0].id;

        await TabManager.openListOfTabs(
          [],
          this.windowId,
          false, // Last pos
          true, //openAtLeastOne
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

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
          this.windowId,
          false, // Last pos
          false, //openAtLeastOne
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

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
          this.windowId,
          true, // Last pos
          false, //openAtLeastOne
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

        let expectedTabs = this.previousTabs.concat(tabs);
        expectedTabs.forEach((tab, index)=>{
          tab.index = index;
        })

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it("Open At Least One New Tab", async function(){
        let new_tab  = await TabManager.openListOfTabs(
          [],
          this.windowId,
          true, // Last pos
          true, //openAtLeastOne
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

        console.log(new_tab);

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
          this.windowId,
          false, // Let Blank tab
        );
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );
        survivorTab.url = Utils.extractTabUrl(survivorTab.url);
        survivorTab = [survivorTab];

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(survivorTab);

        expect(resultingTabs).toEqualTabs(survivorTab);
      });

      it("Remove tabs and let only New Tab", async function(){
        let new_tab = await TabManager.removeTabsInWindow(
          this.windowId,
          true, // Let Blank tab
        );
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );
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
          false, // Last pos
          false, //openAtLeastOne
        );

        await browser.tabs.remove(this.previousTabs.map(tab => tab.id));

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );
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
          false, // Last pos
          false, //openAtLeastOne
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

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
          false, // Let Blank tab
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

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
          false, // Let Blank tab
        );

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,
          true,
          true,
        );

        expectedTabs = [this.previousTabs[0]];
        survivorTab.url = Utils.extractTabUrl(survivorTab.url);
        survivorTab = [survivorTab];

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(expectedTabs);
        expect(resultingTabs).toEqualTabs(survivorTab);
        expect(survivorTab).toEqualTabs(expectedTabs);
      });
    });
  });

  describe("Active support - ", ()=>{
    it("Open list Tabs and keeping only one active", async function(){
      // Close all except blank
      let survivorTab = await TabManager.removeTabsInWindow(
        this.windowId,
        true, // Let Blank tab
        true, // removed Pinned
      );
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
        this.windowId,
        false, // Last pos
        false, //openAtLeastOne
        survivorTab, // tab to kill
      );

      let resultingTabs = await TabManager.getTabsInWindowId(
        this.windowId,
        true,
        true,
      );

      let resultingTabsWithFancy = await TabManager.getTabsInWindowId(
        this.windowId,
        false,
        true,
      );

      let nbrNotDiscarded = resultingTabsWithFancy.filter(tab => tab.url.includes("lazytab/lazytab.html")).length;

      expect(resultingTabs).toEqualTabs(tabs);
      expect(nbrNotDiscarded).toEqual(4);
    });
  })
});

describe("WindowManager - Window Creation: ", ()=>{

  describe("OnNewWindowOpen: ", ()=>{

    beforeEach(function() {
      this.windowId = browser.windows.WINDOW_ID_NONE;
    });

    afterEach(async function() {
      if ( this.windowId !== browser.windows.WINDOW_ID_NONE ) {
        let id;
        if ( (id = GroupManager.getGroupIdInWindow(this.windowId, false)) >= 0 ) { // Remove group
          GroupManager.removeGroupFromId(id);
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
      GroupManager.removeGroupFromId(this.id)
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
      GroupManager.removeGroupFromId(this.id)
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
      GroupManager.removeGroupFromId(this.id)
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
});
