describe("Select a group ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function(){
    OptionManager.updateOption("groups-syncNewWindow", false);
  }, TestManager.TIMEOUT);

  describe(" whith his id", ()=>{
    beforeAll(async function (){
      [this.windowId, this.windowId_bis] = await TestManager.openTwoWindows();
    });

    afterAll(async function (){
      OptionManager.updateOption("groups-sortingType", this.lastSorting);

      await TestManager.closeWindows([this.windowId, this.windowId_bis]);
    });

    beforeEach(async function(){
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
      [this.id, this.group] = Session.createGroup({
          tabsLength: 4,
          global: true,
          active: 1,
          title: "Debug Select Groups"
        });
      this.group = GroupManager.groups[
        GroupManager.getGroupIndexFromGroupId(this.id, {error: true})
      ];
    });

    afterEach(async function(){
      if ( GroupManager.getGroupIndexFromGroupId(this.id, {error: false}) >= 0 ) {
        await GroupManager.removeGroupFromId(this.id);
      }
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
    });

    it(" should be opened if not already.", async function(){

      let previousLength = GroupManager.groups.length;

      await TestManager.focusedWindow(this.windowId);

      const previousWindowNumber = (await browser.windows.getAll()).length

      await WindowManager.selectGroup(this.id);

      //No new window
      expect((await browser.windows.getAll()).length ).toEqual(previousWindowNumber);
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(this.group.windowId).toEqual(this.windowId);
    }, TestManager.TIMEOUT);

    it(" should be focused if already opened.", async function(){
      let previousLength = GroupManager.groups.length;

      const previousWindowNumber = (await browser.windows.getAll()).length

      await TestManager.focusedWindow(this.windowId);
      await WindowManager.selectGroup(this.id);

      // Open well
      expect(GroupManager.groups.length).toEqual(previousLength);
      expect(this.group.windowId).toEqual(this.windowId);

      await TestManager.focusedWindow(this.windowId_bis);
      // Change focus
      expect((await browser.windows.getLastFocused()).id).toEqual(this.windowId_bis);


      await WindowManager.selectGroup(this.id);
      await TestManager.waitWindowToBeFocused(this.windowId);
      // Focus without opening/changing groups/windows
      expect(GroupManager.groups.length).toEqual(previousLength);
      expect((await browser.windows.getAll()).length ).toEqual(previousWindowNumber);
      expect((await browser.windows.getLastFocused()).id).toEqual(this.windowId);
      expect(this.group.windowId).toEqual(this.windowId);
    }, TestManager.TIMEOUT);

  });

  describe(" by willing the next one (on the list)", ()=>{

    beforeAll(async function (){
      this.lastSorting = OptionManager.options.groups.sortingType;
      OptionManager.updateOption("groups-sortingType", OPTION_CONSTANTS.SORT_OLD_RECENT);

      [this.windowId, this.windowId_bis] = await TestManager.openTwoWindows();
    });

    afterAll(async function (){
      OptionManager.updateOption("groups-sortingType", this.lastSorting);

      await TestManager.closeWindows([this.windowId, this.windowId_bis]);
    });

    beforeEach(async function(){
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
      [this.ids, this.groups] = Session.createArrayGroups({
          groupsLength: 3,
          tabsLength: 4,
          global: true,
          active: 1,
          title: "Debug Select Groups"
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
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
    });

    it(" should switch to the next group open.", async function(){
      await WindowManager.openGroupInWindow(this.ids[2], this.windowId);
      await WindowManager.openGroupInWindow(this.ids[0], this.windowId_bis);


      await TestManager.focusedWindow(this.windowId_bis);
      let nextGroupId = await WindowManager.selectNextGroup({
        direction: 1,
        open: true,
        refGroupId: this.ids[0]
      });
      await TestManager.waitWindowToBeFocused(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.groups[2].id);
      expect(currentWindow.id).toEqual(this.groups[2].windowId);
    });

    it(" should switch to the previous group open.", async function(){
      await WindowManager.openGroupInWindow(this.ids[2], this.windowId);
      await WindowManager.openGroupInWindow(this.ids[0], this.windowId_bis);

      await TestManager.focusedWindow(this.windowId_bis);

      let nextGroupId = await WindowManager.selectNextGroup({
        direction: -1,
        open: true,
        refGroupId: this.ids[0]
      });
      await TestManager.waitWindowToBeFocused(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.groups[2].id);
      expect(currentWindow.id).toEqual(this.groups[2].windowId);
    });

    // Select Next Unopen
    it(" should switch to the next group NOT open.", async function(){
      await WindowManager.openGroupInWindow(this.ids[1], this.windowId);
      await TestManager.focusedWindow(this.windowId);

      let nextGroupId = await WindowManager.selectNextGroup({
        refGroupId: this.ids[0]
      });
      await TestManager.focusedWindow(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.ids[2]);
      expect(this.groups[2].windowId).toEqual(currentWindow.id);
    }, TestManager.TIMEOUT);

    // Select Previous Unopen
    it(" should switch to the previous group NOT open.", async function(){
      await WindowManager.openGroupInWindow(this.ids[1], this.windowId);
      await TestManager.focusedWindow(this.windowId);

      let nextGroupId = await WindowManager.selectNextGroup({
        direction: -1,
        refGroupId: this.ids[0]
      });
      await TestManager.focusedWindow(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.ids[2]);
      expect(this.groups[2].windowId).toEqual(currentWindow.id);
    }, TestManager.TIMEOUT);

  });
});
