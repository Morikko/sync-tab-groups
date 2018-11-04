describe("Check Corrupted", ()=>{
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  describe("in Groups", ()=>{
    beforeAll(()=>{
      bg.Utils.DEBUG_MODE = false;
    });
    afterAll(()=>{
      bg.Utils.DEBUG_MODE = true;
    });

    beforeEach(function(){
      spyOn(GroupManager, "reloadGroupsFromDisk");
    });

    describe("should find critical undefined", ()=> {
      it("and reload the groups from the disk.", async function(){
        const [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [undefined], {withMessage: true}
        );
        expect(corrupted).toBe(true);
        expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(1);
      });
      
      it("when the groups array is undefined", async function(){
        const [corrupted, message] = await GroupManager.checkCorruptedGroups(
          null, {withMessage: true}
        );
        expect(corrupted).toBe(true);
        expect(message).toBe("GroupManager.groups")
      });

      it("when a group is undefined", async function(){
        const [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [undefined], {withMessage: true}
        );
        expect(corrupted).toBe(true);
        expect(message).toBe("GroupManager.groups[0]")
      });

      it("when a tabs group array is undefined", async function(){
        let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});

        group.tabs = undefined;
        [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [group], {withMessage: true}
        );
        expect(corrupted).toBe(true);
        expect(message).toBe('GroupManager.groups[0]["tabs"]');
      });

      it("when a tab in a tabs group array is undefined", async function(){
        let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});

        group.tabs[1] = undefined;
        [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [group], {withMessage: true}
        );
        expect(corrupted).toBe(true);
        expect(message).toBe('GroupManager.groups[0].tabs[1]');
      });

      it("when a tab url is undefined", async function(){
        let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});

        group.tabs[1].url = undefined;
        [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [group], {withMessage: true}
        );
        expect(corrupted).toBe(true);
        expect(message).toBe('GroupManager.groups[0].tabs[1]["url"]');
      });
    })

    describe("should repair light undefined when", ()=> {
      it("a group property (incognito) is undefined", async function(){
        const group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
        group.incognito = undefined;

        const [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [group], {withMessage: true}
        );
        expect(corrupted).toBe(false);
        expect(message).toBe('GroupManager.groups[0]["incognito"]');
        expect(group.incognito).toBe(false);
      });

      it("2 tab properties (pinned and active) are undefined", async function(){
        let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});

        group.tabs[0].pinned = undefined;
        group.tabs[3].active = undefined;
        let [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [group], {withMessage: true}
        );
        expect(corrupted).toBe(false);
        expect(message).toBe('GroupManager.groups[0].tabs[0]["pinned"],GroupManager.groups[0].tabs[3]["active"]')
        expect(group.tabs[0].pinned).toBe(false);
        expect(group.tabs[3].active).toBe(false);
      });

      it("a group property (incognito) and a tab property are undefined", async function(){
        const group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
        group.incognito = undefined;
        group.tabs[2].pinned = undefined;

        const [corrupted, message] = await GroupManager.checkCorruptedGroups(
          [group], {withMessage: true}
        );
        expect(corrupted).toBe(false);
        expect(message).toBe('GroupManager.groups[0]["incognito"],GroupManager.groups[0].tabs[2]["pinned"]');
        expect(group.incognito).toBe(false);
        expect(group.tabs[2].pinned).toBe(false);
      });
    });


    it("should find no corruption and do nothing", async function(){
      let groups = Session.createArrayGroups({groupsLength:1, tabsLength: 7, pinnedTabs: 2});

      const isCorrupted = await GroupManager.checkCorruptedGroups(groups);
      expect(isCorrupted).toBe(false);
      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(0);
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
      let options = OPTION_CONSTANTS.TEMPLATE();

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
      let options = OPTION_CONSTANTS.TEMPLATE();
      options.groups = undefined;

      let corrupted = await OptionManager.checkCorruptedOptions(options);
      expect(corrupted).toBe(true);
      expect(OptionManager.reloadOptionsFromDisk).toHaveBeenCalledTimes(1);
    });
  });
});
