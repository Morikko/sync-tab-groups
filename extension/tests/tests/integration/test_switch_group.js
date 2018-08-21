// Not The best tests
// See test_select_group.js for a good example
describe("Switch Group - ", ()=>{

  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  describe("Basic", ()=>{
    beforeAll( async function(){
      OptionManager.updateOption("groups-syncNewWindow", false);
      jasmine.addMatchers(tabGroupsMatchers);
      this.windowId = (await browser.windows.create()).id;
      await TestManager.splitOnHalfScreen(this.windowId);
      this.length = 7;
      this.groups = [];
      for( let i=0; i<3; i++) {
        let id, group;
        [id, group] = Session.createGroup({
            tabsLength: this.length,
            global: true,
            pinnedTabs: 0,
            active: 5,
            title: "Debug WindowManager.OpenGroupInNewWindow"
          });
        this.groups.push({
          id: id,
          group: group,
          groupIndex: GroupManager.getGroupIndexFromGroupId(id)
        });
      }
    });

    afterAll(async function(){
      // Close Window
      await browser.windows.remove(this.windowId);
      // Remove Group
      for (let group of this.groups ) {
        await GroupManager.removeGroupFromId(group.id);
      }
    });

    it("From Not Group To Group - ", async function(){
      // Open
      let previousLength = GroupManager.groups.length;
      let previoustabs = Utils.getCopy(GroupManager.groups[this.groups[0].groupIndex].tabs);

      await WindowManager.switchGroupInCurrentWindow(this.groups[0].id);
      await Utils.wait(1000);

      let currentTabs = await TabManager.getTabsInWindowId(this.windowId);
      TestManager.resetIndexProperties(currentTabs);

      //No new window
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(this.windowId);
      // Tabs correspond
      expect(currentTabs).toEqualTabs(previoustabs);
    }, TestManager.TIMEOUT);

    it("From Group To Group - ", async function (){
      // Open
      let previousLength = GroupManager.groups.length;
      let previoustabs = Utils.getCopy(GroupManager.groups[this.groups[1].groupIndex].tabs);

      await WindowManager.switchGroupInCurrentWindow(this.groups[1].id);
      await Utils.wait(1000);

      let currentTabs = await TabManager.getTabsInWindowId(this.windowId);
      TestManager.resetIndexProperties(currentTabs);

      //No new window
      expect(GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(GroupManager.groups[this.groups[1].groupIndex].windowId).toEqual(this.windowId);
      expect(GroupManager.groups[this.groups[0].groupIndex].windowId).toEqual(browser.windows.WINDOW_ID_NONE);
      // Tabs correspond
      expect(currentTabs).toEqualTabs(previoustabs);
    }, TestManager.TIMEOUT);
  });

  describe("Keep order", ()=>{


    /**
     ** Groups without pinned tabs
     * 1. Group 1
     * 2. Go to group 2
     * 3. Back to group 1
     ** One group with pinned tabs
     * Idem...
     ** Two groups with pinned tabs
     *
     */
    describe("[Pin included]From groups with pinned tabs - ", ()=>{
      beforeAll(function(){
        TestManager.changeSomeOptions({
          "pinnedTab-sync": true,
        })
      });

      afterAll(function(){
      });

      describe("To Groups with pinned tabs", function(){
        beforeAll( async function(){
          [this.groupIds, this.groups] = Session.createArrayGroups({
            groupsLength: 3,
            tabsLength: 7,
            pinnedTabs: 3,
            lazyMode: false,
            global: true,
            title:"Keep Order Included Without",
          })

          this.windowId = await WindowManager.openGroupInNewWindow(
            this.groupIds[0]);
          await TestManager.splitOnHalfScreen(this.windowId);
        });

        afterAll(async function(){
          await TestManager.closeWindows(this.windowId);
          await TestManager.removeGroups(this.groupIds)
        });

        it("Not pinned tab active keep his position", async function(){
          let targetGroupIndex = 1,
              targetTabIndex = 5; // Not pinned

          let previousTabs = Utils.getCopy(TestManager.getGroup(
            GroupManager.groups,
            this.groupIds[targetGroupIndex]
          ).tabs)

          await TabManager.selectTab(targetTabIndex, this.groupIds[targetGroupIndex], false);

          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

          let resultingTabs = await TabManager.getTabsInWindowId(
            this.windowId,{
              withPinned: true,
            });

          TestManager.setActiveProperties(previousTabs, targetTabIndex);

          expect(resultingTabs).toEqualTabs(previousTabs)
        }, TestManager.TIMEOUT);

        it("Pinned tab active keep his position", async function(){
          let targetGroupIndex = 2,
              targetTabIndex = 1; // pinned

          let previousTabs = Utils.getCopy(TestManager.getGroup(
            GroupManager.groups,
            this.groupIds[targetGroupIndex]
          ).tabs)

          await TabManager.selectTab(targetTabIndex, this.groupIds[targetGroupIndex]);

          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

          let resultingTabs = await TabManager.getTabsInWindowId(
            this.windowId,{
              withPinned: true,
            });

          TestManager.setActiveProperties(previousTabs, targetTabIndex);

          expect(resultingTabs).toEqualTabs(previousTabs)
        }, TestManager.TIMEOUT);
      });

      describe("To Groups without pinned tabs", function(){
        beforeAll( async function(){
          [this.groupIds, this.groups] = Session.createArrayGroups({
            groupsLength: 2,
            tabsLength: 7,
            pinnedTabs: [3,0],
            lazyMode: false,
            global: true,
            title:"Keep Order",
          })

          this.windowId = await WindowManager.openGroupInNewWindow(
            this.groupIds[0]);
          await TestManager.splitOnHalfScreen(this.windowId);
        });

        afterAll(async function(){
          await TestManager.closeWindows(this.windowId);
          await TestManager.removeGroups(this.groupIds)
        });

        it("Not pinned tab active keep his position", async function(){
          let targetGroupIndex = 1,
              targetTabIndex = 5; // Not pinned

          let previousTabs = Utils.getCopy(TestManager.getGroup(
            GroupManager.groups,
            this.groupIds[targetGroupIndex]
          ).tabs)

          await TabManager.selectTab(targetTabIndex, this.groupIds[targetGroupIndex], false);

          await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

          let resultingTabs = await TabManager.getTabsInWindowId(
            this.windowId,{
              withPinned: true,
            });

          TestManager.setActiveProperties(previousTabs, targetTabIndex);

          expect(resultingTabs).toEqualTabs(previousTabs)
        }, TestManager.TIMEOUT);
      });
    });
  });

});
