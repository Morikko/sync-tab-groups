describe("Session: ", () => {

  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

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

    it("Group global", async () => {
      let title = "coucou",
        length = 5;
      let [id, group] = Session.createGroup({tabsLength: length, title: title, global: true});

      let groupIndex = GroupManager.getGroupIndexFromGroupId(id);

      TestManager.resetActiveProperties(GroupManager.groups[groupIndex].tabs);

      expect(group).toEqualGroups(GroupManager.groups[groupIndex]);

      await GroupManager.removeGroupFromId(id);
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
          if ( GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0) {
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
