describe("Select Groups - ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

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
