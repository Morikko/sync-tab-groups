import TestManager from '../../utils/TestManager'
import Session from '../../examples/session'

import getGroupIndexSortedByPosition from '../../../background/core/getGroupIndexSortedByPosition'
import tabGroupsMatchers from '../../utils/tabGroupsMatchers'

describe("window.Background.GroupManager", () => {
  beforeAll(TestManager.initUnitBeforeAll());

  beforeEach(TestManager.initBeforeEach());

  describe(".coherentActiveTabInGroups function: ", () => {

    // TODO not good unit test style
    beforeEach(function() {
      jasmine.addMatchers(tabGroupsMatchers);
      this.groups = Session.createArrayGroups({
        groupsLength: 3,
        tabsLength: 5,
        global: false,
        pinnedTabs: 1,
        privilegedLength: 0,
        extensionUrlLength: 0,
        incognito: false,
        active: [-1, 3, 2],
        title: "Debug coherentActiveTabInGroups",
      });
    });

    it("No active in group", function() {
      let good_groups = window.Background.Utils.getCopy(this.groups[0]);
      TestManager.resetActiveProperties(this.groups[0].tabs);

      window.Background.GroupManager.coherentActiveTabInGroups({groups: this.groups[0]});

      expect(this.groups[0]).toEqualGroups(good_groups);
    });

    it("1 active in group", function() {
      let good_groups = window.Background.Utils.getCopy(this.groups[1]);

      window.Background.GroupManager.coherentActiveTabInGroups({groups: this.groups[1]});

      expect(this.groups[1]).toEqualGroups(good_groups);
    });

    it("3 active in group", function() {
      let good_groups = window.Background.Utils.getCopy(this.groups[2]);

      this.groups[2].tabs[3].active = true;
      this.groups[2].tabs[4].active = true;

      window.Background.GroupManager.coherentActiveTabInGroups({groups: this.groups[2]});

      expect(this.groups[2]).toEqualGroups(good_groups);
    });

    it("Empty Group", function() {
      this.groups = [Session.createGroup({
        tabsLength: 0,
        global: false,
        title: "Debug coherentActiveTabInGroups",
      })]
      let good_groups = window.Background.Utils.getCopy(this.groups);

      window.Background.GroupManager.coherentActiveTabInGroups({groups: this.groups});

      expect(this.groups).toEqualGroups(good_groups);
    });
  });

  /**
   * normal: only tabs with raw URLs
   * fancy: tabs with raw, Privileged and Lazy URLs
   */
  describe(".bestMatchGroup: ", ()=>{

    it("Match normal", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2});
      group.id = id;

      let bestId = window.Background.GroupManager.bestMatchGroup(group.tabs, [group]);

      expect(bestId).toEqual(id);
    });

    it("Match fancy", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2});
      group.id = id;
      let tabs = window.Background.Utils.getCopy(group.tabs);

      group.tabs.forEach((tab)=>{
        tab.url = window.Background.Utils.extractTabUrl(tab.url);
      });

      let bestId = window.Background.GroupManager.bestMatchGroup(tabs, [group]);

      expect(bestId).toEqual(id);
    });

    it("Match reject length", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2,
        fakeTab: false});
      let group2 = Session.createGroup({tabsLength: 6,
        pinnedTabs: 2,
        fakeTab: false});
      group2.id = id;

      let bestId = window.Background.GroupManager.bestMatchGroup(group.tabs, [group2]);

      expect(bestId).toEqual(-1);
    });

    it("Match reject diverge on incognito", ()=>{
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2,
        incognito: true});
      let tabs = window.Background.Utils.getCopy(group.tabs);


      let bestId = window.Background.GroupManager.bestMatchGroup(tabs, [group]);

      expect(bestId).toEqual(-1);
    });

    it("Match reject URL", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2,
        fakeTab: false});
      let group2 = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2,
        fakeTab: false});
      group2.id = id;

      let bestId = window.Background.GroupManager.bestMatchGroup(group.tabs, [group2]);

      expect(bestId).toEqual(-1);
    });

    it("Match 1 in 5 groups", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2});
      group.id = id;
      let groups = new Array(4);

      groups = groups.map((a, index)=>{
        let group = Session.createGroup({tabsLength: 7,
          pinnedTabs: 2});
        group.id = index;
        return group;
      })

      let bestId = window.Background.GroupManager.bestMatchGroup(group.tabs, groups.concat(group));

      expect(bestId).toEqual(id);
    });

    it("Match prefer lastAccessed", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2});
      group.id = id;
      group.lastAccessed = 11;

      let groupOlder = window.Background.Utils.getCopy(group);
      groupOlder.id++;
      groupOlder.lastAccessed--;

      let bestId = window.Background.GroupManager.bestMatchGroup(group.tabs, [group, groupOlder]);

      expect(bestId).toEqual(id);
    });

    it("Match retrieve even with closed extension tabs", ()=>{
      let id = 122;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2,
        extensionUrlLength: 2});
      group.id = id;

      // Without ext tabs
      let tabs = window.Background.Utils.getCopy(group.tabs).filter((tab)=>{
        return !(Session.ListOfExtensionTabURLs.filter((list)=>{
          return  window.Background.Utils.extractTabUrl(tab.url).includes(list.url);
        }).length);
      });

      let bestId = window.Background.GroupManager.bestMatchGroup(tabs, [group]);

      expect(bestId).toEqual(id);
    });

    it("Match prefer with extension tabs", ()=>{
      let id = 122, id2 = 127;
      let group = Session.createGroup({tabsLength: 7,
        pinnedTabs: 2,
        extensionUrlLength: 2});
      group.id = id;

      let group2 = window.Background.Utils.getCopy(group);
      group2.id = id2;
      // Without ext tabs
      group2.tabs = window.Background.Utils.getCopy(group2.tabs).filter((tab)=>{
        return !(Session.ListOfExtensionTabURLs.filter((list)=>{
          return  window.Background.Utils.extractTabUrl(tab.url).includes(list.url);
        }).length);
      });

      let bestId = window.Background.GroupManager.bestMatchGroup(group.tabs, [group, group2]);

      expect(bestId).toEqual(id);

      bestId = window.Background.GroupManager.bestMatchGroup(group2.tabs, [group, group2]);

      expect(bestId).toEqual(id2);
    });

  });

  describe(".removeAllGroups: ", ()=>{

    it("is Removing well", ()=>{
      let groups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 4,
      });

      window.Background.GroupManager.removeAllGroups(groups);

      expect(groups.length).toEqual(0);
    });

  });

  describe(".reloadGroupsFromDisk: ", ()=>{

    it("is Reloading well", async()=>{
      let groups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 4,
      });
      let saveGroups = await window.Background.ExtensionStorageManager.Local.loadGroups();
      await window.Background.ExtensionStorageManager.Local.saveGroups(groups);

      await window.Background.GroupManager.reloadGroupsFromDisk();
      window.Background.GroupManager.groups.forEach((group)=>{
        group.index = -1;
        group.position = -1;
      });

      expect(window.Background.GroupManager.groups).toEqualGroups(groups);
      window.Background.GroupManager.groups = saveGroups;
      await window.Background.ExtensionStorageManager.Local.saveGroups(saveGroups);
    });

    it("is well changing window.Background.GroupManager.groups", async()=>{
      let saveGroups = window.Background.GroupManager.groups;
      let targetGroups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 4,
      });
      window.Background.GroupManager.groups = [];

      //spyOn(window.Background.ExtensionStorageManager.Local, "loadGroups").and.returnValue(saveGroups);
      await window.Background.ExtensionStorageManager.Local.saveGroups(targetGroups);

      await window.Background.GroupManager.reloadGroupsFromDisk();

      expect(window.Background.GroupManager.groups.length).toEqual(targetGroups.length);
      window.Background.GroupManager.groups = saveGroups;
      await window.Background.ExtensionStorageManager.Local.saveGroups(saveGroups);
    });

  });

  describe(".setUniqueTabIds ", ()=>{
    it("should replace ids for tabs in close groups", function() {
      let groups = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: 2,
      });

      groups.forEach((group)=>{
        group.tabs.forEach((tab, index)=>{
          tab.id = index>0?index:undefined;
        });
      });

      window.Background.GroupManager.setUniqueTabIds(groups);

      groups.forEach((group)=>{
        group.tabs.forEach((tab, index)=>{
          let parts = tab.id.split("-");

          expect(parts[0].length>0).toBe(true);
          expect(parts[1]).toEqual(String(group.id));
          expect(parts[2]).toEqual(String(index));
        });
      });
    });

    it("should not replace ids for tabs in open groups", function() {
      let groups = Session.createArrayGroups({
        groupsLength: 2,
        tabsLength: 2,
        windowId: 1,
      });

      groups.forEach((group)=>{
        group.tabs.forEach((tab, index)=>{
          tab.id = index>0?index:undefined;
        });
      });

      window.Background.GroupManager.setUniqueTabIds(groups);

      groups.forEach((group)=>{
        group.tabs.forEach((tab, index)=>{
          expect(tab.id).toEqual(index>0?index:undefined);
        });
      });
    });

    it("should also update openerTabIds for tabs in close groups", function() {
      let group = Session.createGroup({
        tabsLength: 4,
      });

      group.tabs.forEach((tab, index)=>{
        tab.id = index;
      });
      group.tabs[1].openerTabId = group.tabs[0].id;
      group.tabs[2].openerTabId = group.tabs[0].id;
      group.tabs[3].openerTabId = group.tabs[2].id;

      window.Background.GroupManager.setUniqueTabIds([group]);

      expect(group.tabs[0].openerTabId).toBe(undefined);
      expect(group.tabs[1].openerTabId).toEqual(group.tabs[0].id);
      expect(group.tabs[2].openerTabId).toEqual(group.tabs[0].id);
      expect(group.tabs[3].openerTabId).toEqual(group.tabs[2].id);
    });
  });

  describe(".filterGroups", ()=>{
    it(" sould return filtered groups", function() {
      let groups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 7,
        pinnedTabs: 3,
        lazyMode: false,
        title: "Filter groups",
      });

      // Only odd groups and tabs (cf index)
      let filter = {};

      groups.forEach((group, ind)=>{
        if ((ind %2===1)) {
          let tabs = group.tabs.map((_,index)=>index%2===1);
          filter[group.id] = {
            tabs: tabs,
            selected: tabs.filter(_ => _).length,
          }
        } else {
          let tabs = group.tabs.map((_,index)=>false);
          filter[group.id] =  {
            tabs: tabs,
            selected: 0,
          }
        }
      });

      let filteredGroups = window.Background.GroupManager.filterGroups(
        groups,
        filter,
      );

      // Keep odd groups
      const expectedFilteredGroups = groups.filter((group, ind)=>{
        return (ind %2===1);
      });
      // Keep odd tabs
      expectedFilteredGroups.forEach((group)=>{
        group.tabs = group.tabs.filter((_,index)=>index%2===1)
      });

      expect(filteredGroups).toEqualGroups(expectedFilteredGroups);
    });

    it(" should return all groups if no filter provided", function() {
      let groups = Session.createArrayGroups({
        groupsLength: 4,
        tabsLength: 7,
        pinnedTabs: 3,
        lazyMode: false,
        title: "Filter groups",
      });

      let filteredGroups = window.Background.GroupManager.filterGroups(
        groups
      );

      expect(filteredGroups).toEqualGroups(groups);
    })
  })

  describe(".getIndexSortByPosition", ()=>{
    it("should return the index in the right same position", ()=>{
      let groups = window.Background.Utils.range(10).map((i)=>{
        return {
          index: i,
          position: i,
        }
      });

      let index = getGroupIndexSortedByPosition(groups);

      expect(index).toEqual(groups.map(group=>group.index));
    });

    it("should return the indexer ordered by position", ()=>{
      const SIZE = 10;
      let groups = window.Background.Utils.range(SIZE).map((i)=>{
        return {
          index: i,
          position: SIZE-1-i,
        }
      });

      let index = getGroupIndexSortedByPosition(groups);

      expect(index).toEqual(groups.map(group=>group.index).reverse());
    });

    it("should add the missing positions at the end by index", ()=>{
      const SIZE = 10;
      let groups = window.Background.Utils.range(SIZE).map((i)=>{
        return {
          index: i,
          position: (i>SIZE/2)?SIZE-1-i:undefined,
        }
      });
      // Adding first defined in reverse
      const expectIndex = groups.filter(group => group.position !== undefined)
        .map(group=>group.index).reverse()
        .concat(
          // Adding in order undefined
          groups.filter(group => group.position === undefined)
            .map(group=>group.index)
        );

      let index = getGroupIndexSortedByPosition(groups);

      expect(index).toEqual(expectIndex);
    });

    it("should correct negative index and put it at the end", ()=>{
      let groups =  [
        {
          "index": 0,
          "position": 1,
        },
        {
          "index": 1,
          "position": 5,
        },
        {
          "index": 2,
          "position": 0,
        },
        {
          "index": 3,
          "position": 4,
        },
        {
          "index": 4,
          "position": 2,
        },
        {
          "index": 5,
          "position": 3,
        },
        {
          "index": -1,
          "position": -1,
        },
      ];
      // Adding first defined in reverse
      const expectIndex = groups.filter(group => group.position >= 0)
        .sort((a,b) => a.position > b.position)
        .map(group=>group.index);
      expectIndex.push(expectIndex.length);

      let index = getGroupIndexSortedByPosition(groups);

      expect(index.length).toEqual(groups.length)
      expect(index).toEqual(expectIndex);
    });
  });
});
