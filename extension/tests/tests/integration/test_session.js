describe("Session: ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

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
      let tab = Session.getFakeTab();

      let group = GroupManager.groups[this.groupIndex];
      let previousLength = group.tabs.length;

      await Session.addTabToGroup(this.id, tab);

      expect(group.tabs.length).toEqual(previousLength+1);
      expect(group.tabs[group.tabs.length-1].url).toEqual(tab.url);
    });

    it("Add Pinned Tab To Open Group", async function(){
      OptionManager.updateOption("pinnedTab-sync", true);
      let tab = Session.getFakeTab();
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
