describe("Check Corrupted: ", ()=>{
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  describe("Groups: ", ()=>{
    beforeAll(()=>{
      bg.Utils.DEBUG_MODE = false;
    });
    afterAll(()=>{
      bg.Utils.DEBUG_MODE = true;
    });

    beforeEach(function(){
      spyOn(GroupManager, "reloadGroupsFromDisk");
    });

    it("No corruption", async function(){
      let groups = Session.createArrayGroups({groupsLength:1, tabsLength: 7, pinnedTabs: 2});

      const isCorrupted = await GroupManager.checkCorruptedGroups(groups);
      expect(isCorrupted).toBe(false);
      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(0);
    });

    it("A group is undefined", async function(){
      let [corrupted, message] = await GroupManager.checkCorruptedGroups(
        [undefined], {withMessage: true}
      );
      expect(corrupted).toBe(true);
      expect(message).toBe("group[0](ALL)")
      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(1);

      const group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      group.incognito = undefined;

      [corrupted, message] = await GroupManager.checkCorruptedGroups(
        [group], {withMessage: true}
      );
      expect(corrupted).toBe(true);
      expect(message).toBe('group[0]["incognito"]')
      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(2);
    });

    it("A Tabs Group is undefined", async function(){
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});

      group.tabs[0].url = undefined;
      let [corrupted, message] = await GroupManager.checkCorruptedGroups(
        [group], {withMessage: true}
      );
      expect(corrupted).toBe(true);
      expect(message).toBe('group[0].tabs[0]["url"]')

      group.tabs = undefined; 
      [corrupted, message] = await GroupManager.checkCorruptedGroups(
        [group], {withMessage: true}
      );
      expect(corrupted).toBe(true);
      expect(message).toBe('group[0]["tabs"]')

      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(2);
    });
  });

  describe("Options: ", ()=>{
    beforeAll(()=>{
      bg.Utils.DEBUG_MODE = false;
    });
    afterAll(()=>{
      bg.Utils.DEBUG_MODE = true;
    });

    beforeEach(function(){
      spyOn(OptionManager, "reloadOptionsFromDisk");
    });

    it("No corruption", async function(){
      let options = OptionManager.TEMPLATE();

      let corrupted = await OptionManager.checkCorruptedOptions(options);
      expect(corrupted).toBe(false);
      expect(OptionManager.reloadOptionsFromDisk).toHaveBeenCalledTimes(0);
    });

    it("Options is undefined", async function(){
      let corrupted = await OptionManager.checkCorruptedOptions({undefined});

      expect(corrupted).toBe(true);
      expect(OptionManager.reloadOptionsFromDisk).toHaveBeenCalledTimes(1);
    });

    it("A property of an option is undefined", async function(){
      let options = OptionManager.TEMPLATE();
      options.groups = undefined;

      let corrupted = await OptionManager.checkCorruptedOptions(options);
      expect(corrupted).toBe(true);
      expect(OptionManager.reloadOptionsFromDisk).toHaveBeenCalledTimes(1);
    });
  });
});
