describe("WindowManager: ", ()=>{

  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

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
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

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
