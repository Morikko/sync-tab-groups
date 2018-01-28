// Reminder

describe("Comparator: ", ()=>{
  beforeEach(function() {
    jasmine.addMatchers(tabGroupsMatchers);
  });

  it("toEqualTabs", ()=>{
    let tabs = Session.createTabs({tabsLength: 7, pinnedTabs: 2});

    expect(tabs).toEqualTabs(tabs);

    let alter_tabs = Session.createTabs(
      {tabsLength: 7, pinnedTabs: 2}
    );

    expect(tabs).not.toEqualTabs(alter_tabs);

    expect(undefined).not.toEqualTabs(tabs);
    expect(tabs).not.toEqualTabs(undefined);
  })

  it("toEqualGroup", ()=>{
    let groups = Session.createGroup({tabsLength: 7, pinnedTabs: 2, incognito: false});
    expect(groups).toEqualGroup(groups);

    let groups_alter = Utils.getCopy(groups);
    groups_alter.incognito = true;

    let groups_alter_tabs = Utils.getCopy(groups);
    groups_alter_tabs.tabs = Session.createTabs(
      {tabsLength: 7, pinnedTabs: 2}
    );

    expect(groups).not.toEqualGroup(groups_alter);
    expect(groups).not.toEqualGroup(groups_alter_tabs);

    expect(undefined).not.toEqualGroup(groups);
    expect(groups).not.toEqualGroup(undefined);
  });

  it("toEqualGroups", ()=>{
    // TODO
  });

});

describe("Utils: ", ()=>{

});

describe("Session: ", () => {

  describe("createGroup: ", () => {
    beforeAll(function() {
      jasmine.addMatchers(tabGroupsMatchers);
    });

    it("Group with normal tabs, title", () => {
      let title = "coucou",
        length = 5;
      let group = Session.createGroup({tabsLength: length, title: title});
      expect(group.tabs.length).toEqual(length);
      expect(group.title).toEqual(title);
    });

    it("Group with normal tabs and pinned tabs", () => {
      let pinnedLength = 2,
        length = 5;
      let group = Session.createGroup({tabsLength: length, pinnedTabs: pinnedLength});
      actualPinnedLength = group.tabs.reduce((a, b) => {
        return a + b.pinned;
      }, 0);

      expect(group.tabs.length).toEqual(length);
      expect(actualPinnedLength).toEqual(pinnedLength);
    });

    it("Group incognito", () => {
      let group = Session.createGroup({tabsLength: 1, incognito: true});
      expect(group.incognito).toBe(true);
    });

    it("Group with normal tabs, priv and ext", () => {
      let length = 5,
        privLength = 2,
        extLength = 2;
      let group = Session.createGroup({tabsLength: length, privilegedLength: privLength, extensionUrlLength: extLength});
      let actualPrivLength = group.tabs.filter((tab)=>{
        return Session.ListOfPrivTabURLs.filter((list)=>{
          return tab.url.includes(list.url);
        }).length;
      }).length;
      let actualExtLength = group.tabs.filter((tab)=>{
        return Session.ListOfExtensionTabURLs.filter((list)=>{
          return tab.url.includes(list.url);
        }).length;
      }).length;

      expect(group.tabs.length).toEqual(length);
      expect(actualPrivLength).toEqual(privLength);
      expect(actualExtLength).toEqual(extLength);
    });

    it("Manage pinned tabs overflow", () => {
      let pinnedLength = 7,
        length = 5;
      let group = Session.createGroup({tabsLength: length, pinnedTabs: pinnedLength});
      actualPinnedLength = group.tabs.reduce((a, b) => {
        return a + b.pinned;
      }, 0);

      expect(group.tabs.length).toEqual(length);
      expect(actualPinnedLength).toEqual(length);
    });

    it("Manage ext/priv tabs overflow", () => {
      let length = 3,
        privLength = 2,
        extLength = 2;
      let group = Session.createGroup({tabsLength: length, privilegedLength: privLength, extensionUrlLength: extLength});
      let actualPrivLength = group.tabs.filter((tab)=>{
        return Session.ListOfPrivTabURLs.filter((list)=>{
          return tab.url.includes(list.url);
        }).length;
      }).length;
      let actualExtLength = group.tabs.filter((tab)=>{
        return Session.ListOfExtensionTabURLs.filter((list)=>{
          return tab.url.includes(list.url);
        }).length;
      }).length;

      expect(group.tabs.length).toEqual(length);
      expect(actualPrivLength).toEqual(privLength);
      expect(actualExtLength).toEqual(length - privLength);
    });

    it("Lazy and Open Privileged urls", ()=>{
      let length = 5,
        privLength = 2,
        extLength = 2;
      let group = Session.createGroup({
        tabsLength: length,
        privilegedLength: privLength,
        extensionUrlLength: extLength,
        active: 3,
        lazyMode: true,
        openPrivileged: true,
      });
      let actualPrivLength = group.tabs.filter((tab)=>{
        return Session.ListOfPrivTabURLs.filter((list)=>{
          return Utils.extractTabUrl(tab.url).includes(list.url);
        }).length;
      }).length;

      let actualExtLength = group.tabs.filter((tab)=>{
        return Session.ListOfExtensionTabURLs.filter((list)=>{
          return  Utils.extractTabUrl(tab.url).includes(list.url);
        }).length;
      }).length;

      let openPrivLength = group.tabs.filter((tab)=>{
        return Utils.extractLazyUrl(tab.url).includes(Utils.PRIV_PAGE_URL);
      }).length;

      let lazyLength = group.tabs.filter((tab)=>{
        return tab.url.includes(Utils.LAZY_PAGE_URL);
      }).length;

      expect(group.tabs.length).toEqual(length);
      expect(actualPrivLength).toEqual(privLength);
      expect(actualExtLength).toEqual(extLength);
      expect(openPrivLength).toEqual(privLength);
      expect(lazyLength).toEqual(length-1);
    });

    it("Group global", () => {
      let title = "coucou",
        length = 5;
      let [id, group] = Session.createGroup({tabsLength: length, title: title, global: true});

      let groupIndex = GroupManager.getGroupIndexFromGroupId(id);

      TestManager.resetActiveProperties(GroupManager.groups[groupIndex].tabs);

      expect(group).toEqualGroups(GroupManager.groups[groupIndex]);

      GroupManager.removeGroupFromId(id);
    });
  });

  describe("createGroups: ", ()=>{

    it("Create similar groups", ()=>{
      let groupsLength = 4, titlePrefix="Test";
      let groups = Session.createArrayGroups({
        groupsLength: groupsLength,
        tabsLength: groupsLength,
        pinnedTabs: 1,
        lazyMode: false,
        privilegedLength: 0,
        openPrivileged: false,
        extensionUrlLength: 0,
        global: false,
        incognito: false,
        active: -1,
        title:titlePrefix,
      });

      expect(groups.length).toEqual(groupsLength);
      groups.forEach((group, index)=>{
        expect(group.tabs.length).toEqual(groupsLength);
        expect(group.incognito).toBe(false);
        expect(group.title).toEqual(titlePrefix+" "+index);
      });
    });

    it("Create different groups", ()=>{
      let groupsLength = 4, title=["Coucou", "bonjour", "Salut", "Aurevoir"];
      let groups = Session.createArrayGroups({
        groupsLength: groupsLength,
        tabsLength: Utils.range(groupsLength),
        pinnedTabs: 1,
        lazyMode: false,
        privilegedLength: 0,
        openPrivileged: false,
        extensionUrlLength: 0,
        global: false,
        incognito: [false, true, false, true],
        active: -1,
        title:title,
      });

      expect(groups.length).toEqual(groupsLength);
      groups.forEach((group, index)=>{
        expect(group.tabs.length).toEqual(index);
        expect(group.incognito).toBe((index%2)?true:false);
        expect(group.title).toEqual(title[index]);
      });
    });

    it("Create Global Groups", ()=>{
      let ids = [], groups = [];
      try {
        let groupsLength = 4, titlePrefix="Create Global Groups";
        let previousGroupsLength = GroupManager.groups.length;
        [ids, groups] = Session.createArrayGroups({
          groupsLength: groupsLength,
          tabsLength: Utils.range(groupsLength),
          pinnedTabs: 1,
          lazyMode: false,
          privilegedLength: 0,
          openPrivileged: false,
          extensionUrlLength: 0,
          global: true,
          incognito: [false, true, false, true],
          active: -1,
          title:titlePrefix,
        });

        expect(groups.length).toEqual(groupsLength);
        expect(ids.length).toEqual(groupsLength);
        expect(previousGroupsLength).toEqual(GroupManager.groups.length-groupsLength);
        ids.forEach((id, index)=>{
          let groupIndex = GroupManager.getGroupIndexFromGroupId(id);
          let group = GroupManager.groups[groupIndex];
          expect(group.tabs.length).toEqual(index);
          expect(group.incognito).toBe((index%2)?true:false);
          expect(group.title).toEqual(titlePrefix + " " + index);
        });
      } finally {
        ids.forEach((id, index)=>{
          if ( GroupManager.getGroupIndexFromGroupId(id, false) >= 0) {
            GroupManager.removeGroupFromId(id);
          }
        });
      }
    });

    it("Raise error if param length is wrong", ()=>{
      expect(Session.createArrayGroups.bind(null, {
        groupsLength: 4,
        tabsLength: Utils.range(4),
        incognito: [false, true, false],
      })).toThrow();
    });
  });
});

describe("GroupManager: ", () => {

  describe("coherentActiveTabInGroups function: ", () => {

    beforeEach(function() {
      jasmine.addMatchers(tabGroupsMatchers);
      this.groups = [Session.createGroup({
          tabsLength: 5,
          global: false,
          pinnedTabs: 1,
          privilegedLength: 0,
          extensionUrlLength: 0,
          incognito: false,
          active: -1,
          title: "Debug coherentActiveTabInGroups"
        })];
    });

    it("No active in group", function () {
      let good_groups = Utils.getCopy(this.groups);
      good_groups[0].tabs[good_groups[0].tabs.length-1].active = true;

      GroupManager.coherentActiveTabInGroups(this.groups);

      expect(this.groups).toEqualGroups(good_groups);
    });

    it("1 active in group", function() {
      this.groups[0].tabs[3].active = true;
      let good_groups = Utils.getCopy(this.groups);

      GroupManager.coherentActiveTabInGroups(this.groups);

      expect(this.groups).toEqualGroups(good_groups);
    });

    it("3 active in group", function() {
      let good_groups = Utils.getCopy(this.groups);

      this.groups[0].tabs[3].active = true;
      this.groups[0].tabs[2].active = true;
      this.groups[0].tabs[4].active = true;

      good_groups[0].tabs[2].active = true;

      GroupManager.coherentActiveTabInGroups(this.groups);

      expect(this.groups).toEqualGroups(good_groups);
    });

    it("Empty Group", function() {
      this.groups = [Session.createGroup({
          tabsLength: 0,
          global: false,
          title: "Debug coherentActiveTabInGroups"
        })]
      let good_groups = Utils.getCopy(this.groups);

      GroupManager.coherentActiveTabInGroups(this.groups);

      expect(this.groups).toEqualGroups(good_groups);
    });
  });

  /**
   * normal: only tabs with raw URLs
   * fancy: tabs with raw, Privileged and Lazy URLs
   */
  describe("bestMatchGroup: ", ()=>{
    beforeAll(function() {
      jasmine.addMatchers(tabGroupsMatchers);
    });

    it("Match normal", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      group.id = id;

      let bestId = GroupManager.bestMatchGroup(group.tabs, [group]);

      expect(bestId).toEqual(id);
    });

    it("Match fancy", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      group.id = id;
      let tabs = Utils.getCopy(group.tabs);

      group.tabs.forEach((tab)=>{
        tab.url = Utils.extractTabUrl(tab.url);
      });

      let bestId = GroupManager.bestMatchGroup(tabs, [group]);

      expect(bestId).toEqual(id);
    });

    it("Match reject length", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      let group2 = Session.createGroup({tabsLength: 6, pinnedTabs: 2});
      group2.id = id;

      let bestId = GroupManager.bestMatchGroup(group.tabs, [group2]);

      expect(bestId).toEqual(-1);
    });

    it("Match reject URL", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      let group2 = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      group2.id = id;

      let bestId = GroupManager.bestMatchGroup(group.tabs, [group2]);

      expect(bestId).toEqual(-1);
    });

    it("Match 1 in 5 groups", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      group.id = id;
      let groups = new Array(4);

      groups = groups.map((a, index)=>{
        let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
        group.id = index;
        return group;
      })

      let bestId = GroupManager.bestMatchGroup(group.tabs, groups.concat(group));

      expect(bestId).toEqual(id);
    });

    it("Match prefer lastAccessed", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});
      group.id = id;
      group.lastAccessed = 11;

      let groupOlder = Utils.getCopy(group);
      groupOlder.id++;
      groupOlder.lastAccessed--;

      let bestId = GroupManager.bestMatchGroup(group.tabs, [group, groupOlder]);

      expect(bestId).toEqual(id);
    });

    it("Match retrieve even with closed extension tabs", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2,
      extensionUrlLength: 2});
      group.id = id;

      // Without ext tabs
      let tabs = Utils.getCopy(group.tabs).filter((tab)=>{
        return !(Session.ListOfExtensionTabURLs.filter((list)=>{
          return  Utils.extractTabUrl(tab.url).includes(list.url);
        }).length);
      });

      let bestId = GroupManager.bestMatchGroup(tabs, [group]);

      expect(bestId).toEqual(id);
    });

    it("Match prefer with extension tabs", ()=>{
      let id = 122, id2 = 127;
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2,
      extensionUrlLength: 2});
      group.id = id;

      let group2 = Utils.getCopy(group);
      group2.id = id2;
      // Without ext tabs
      group2.tabs = Utils.getCopy(group2.tabs).filter((tab)=>{
        return !(Session.ListOfExtensionTabURLs.filter((list)=>{
          return  Utils.extractTabUrl(tab.url).includes(list.url);
        }).length);
      });

      let bestId = GroupManager.bestMatchGroup(group.tabs, [group, group2]);
      expect(bestId).toEqual(id);

      bestId = GroupManager.bestMatchGroup(group2.tabs, [group, group2]);
      expect(bestId).toEqual(id2);
    });

  });

  describe("removeAllGroups: ", ()=>{

    it("is Removing well", ()=>{
      let groups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 4,
      });

      GroupManager.removeAllGroups(groups);

      expect(groups.length).toEqual(0);
    });

  });

  describe("reloadGroupsFromDisk: ", ()=>{
    beforeAll(function() {
      jasmine.addMatchers(tabGroupsMatchers);
    });

    it("is Reloading well", async ()=>{
      let groups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 4,
      });
      let saveGroups = await StorageManager.Local.loadGroups();
      await StorageManager.Local.saveGroups(groups);

      await GroupManager.reloadGroupsFromDisk();
      GroupManager.groups.forEach((group)=>{
        group.index = -1;
        group.position = -1;
        TestManager.resetActiveProperties(group.tabs);
      });

      expect(GroupManager.groups).toEqualGroups(groups);
      GroupManager.groups = saveGroups;
      await StorageManager.Local.saveGroups(saveGroups);
    });

    it("is well changing GroupManager.groups", async ()=>{
      let saveGroups = GroupManager.groups;
      let targetGroups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 4,
      });
      GroupManager.groups = [];

      //spyOn(StorageManager.Local, "loadGroups").and.returnValue(saveGroups);
      await StorageManager.Local.saveGroups(targetGroups);

      await GroupManager.reloadGroupsFromDisk();

      expect(GroupManager.groups.length).toEqual(targetGroups.length);
      GroupManager.groups = saveGroups;
      await StorageManager.Local.saveGroups(saveGroups);
    });

  });

});

describe("Check Corrupted: ", ()=>{
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

      await GroupManager.checkCorruptedGroups(groups);
      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(0);
    });

    it("A  group is undefined", async function(){
      let corrupted = await GroupManager.checkCorruptedGroups([undefined]);
      expect(corrupted).toBe(true);
      expect(GroupManager.reloadGroupsFromDisk).toHaveBeenCalledTimes(1);
    });

    it("A Tabs Group is undefined", async function(){
      let group = Session.createGroup({tabsLength: 7, pinnedTabs: 2});

      group.tabs[0].url = undefined;
      await GroupManager.checkCorruptedGroups([group]);

      group.tabs = undefined;
      await GroupManager.checkCorruptedGroups([group]);

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

describe("Search: ", () => {
  describe("Results: ", () => {

    it("Single keyword NOT found", () => {
      expect(Utils.search("coucou les amis", "dd")).toBe(false);
    });

    it("Single keyword found", () => {
      expect(Utils.search("coucou les amis", "cou")).toBe(true);
    });

    it("Multiple keywords found", () => {
      expect(Utils.search("coucou les amis", "cou les")).toBe(true);
    });

    it("Multiple keywords NOT found", () => {
      expect(Utils.search("coucou les amis", "cou du")).toBe(false);
    });

    it("Not Case Sensitive", () => {
      expect(Utils.search("coucou les amis", "CoU")).toBe(true);
    });

    it("Accept Symbols", () => {
      expect(Utils.search("coucou les @mis", "@mis")).toBe(true);
    });

    it("Accept special caracters", () => {
      expect(Utils.search("Je m'appelle éric", "m'a eric")).toBe(true);
    });
  });

  describe("Split Search in Group/Tab: ", function() {
    // Extract search value
    let groupList = new GroupList({});

    it("Group and tab", () => {
      [groupSearch, tabSearch] = groupList.extractSearchValue("g/text coucou/grow throw");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("grow throw");
    });

    it("Group only", () => {
      [groupSearch, tabSearch] = groupList.extractSearchValue("g/text coucou/");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("");
    });

    it("Group only without last separator", () => {
      [groupSearch, tabSearch] = groupList.extractSearchValue("g/text coucou");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("");
    });

    it("Tab only", () => {
      [groupSearch, tabSearch] = groupList.extractSearchValue("grow throw");
      expect(groupSearch).toBe("");
      expect(tabSearch).toBe("grow throw");
    });
  });
})

describe("Back Up: ", ()=>{
  it("Check timers are triggering automatic backup", ()=>{

    jasmine.clock().install();
    // Change setInterval and set this reference to the background
    let savedSetInterval = bg.setInterval;
    bg.setInterval = window.setInterval;

    // Set options
    let optionSave = OptionManager.options.backup;
    OptionManager.options.backup = Utils.getCopy(OptionManager.options.backup);
    OptionManager.options.backup.enable = true;
    OptionManager.options.backup.time = Utils.setObjectPropertiesWith(OptionManager.TIMERS(), false);

    // Spy
    spyOn(StorageManager.Backup, "backup");

    for (let time in OptionManager.TIMERS()) {
      OptionManager.options.backup.time[time] = true;
      StorageManager.Backup.init();
      // Trigger timers
      jasmine.clock().tick(OptionManager.TIMERS()[time]+100);

      expect(StorageManager.Backup.backup).toHaveBeenCalledWith(time.substring(2));

      OptionManager.options.backup.time[time] = false;
    }

    // Reset options
    OptionManager.options.backup = optionSave;
    jasmine.clock().uninstall();
    bg.setInterval = savedSetInterval;
  });
});
