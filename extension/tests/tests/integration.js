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
