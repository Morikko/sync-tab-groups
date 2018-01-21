describe("WindowManager: ", ()=>{

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
