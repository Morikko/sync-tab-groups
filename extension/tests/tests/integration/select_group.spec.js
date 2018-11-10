
import TestManager from '../../utils/TestManager'
import Session from '../../examples/session'
import OPTION_CONSTANTS from '../../../background/core/OPTION_CONSTANTS'

describe("Select a group ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function() {
    window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
  }, TestManager.TIMEOUT);

  describe(" whith his id", ()=>{
    beforeAll(async function() {
      [this.windowId, this.windowId_bis] = await TestManager.openTwoWindows();
    });

    afterAll(async function() {
      window.Background.OptionManager.updateOption("groups-sortingType", this.lastSorting);

      await TestManager.closeWindows([this.windowId, this.windowId_bis]);
    });

    beforeEach(async function() {
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
      [this.id, this.group] = Session.createGroup({
        tabsLength: 4,
        global: true,
        active: 1,
        title: "Debug Select Groups",
      });
      this.group = window.Background.GroupManager.groups[
        window.Background.GroupManager.getGroupIndexFromGroupId(this.id, {error: true})
      ];
    });

    afterEach(async function() {
      if (window.Background.GroupManager.getGroupIndexFromGroupId(this.id, {error: false}) >= 0) {
        await window.Background.GroupManager.removeGroupFromId(this.id);
      }
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
    });

    it(" should be opened if not already.", async function() {

      let previousLength = window.Background.GroupManager.groups.length;

      await TestManager.focusedWindow(this.windowId);

      const previousWindowNumber = (await browser.windows.getAll()).length

      await window.Background.WindowManager.selectGroup(this.id);

      //No new window
      expect((await browser.windows.getAll()).length).toEqual(previousWindowNumber);
      expect(window.Background.GroupManager.groups.length).toEqual(previousLength);
      // group is associated with OPEN window
      expect(this.group.windowId).toEqual(this.windowId);
    }, TestManager.TIMEOUT);

    it(" should be focused if already opened.", async function() {
      let previousLength = window.Background.GroupManager.groups.length;

      const previousWindowNumber = (await browser.windows.getAll()).length

      await TestManager.focusedWindow(this.windowId);
      await window.Background.WindowManager.selectGroup(this.id);

      // Open well
      expect(window.Background.GroupManager.groups.length).toEqual(previousLength);
      expect(this.group.windowId).toEqual(this.windowId);

      await TestManager.focusedWindow(this.windowId_bis);
      // Change focus
      expect((await browser.windows.getLastFocused()).id).toEqual(this.windowId_bis);


      await window.Background.WindowManager.selectGroup(this.id);
      await TestManager.waitWindowToBeFocused(this.windowId);
      // Focus without opening/changing groups/windows
      expect(window.Background.GroupManager.groups.length).toEqual(previousLength);
      expect((await browser.windows.getAll()).length).toEqual(previousWindowNumber);
      expect((await browser.windows.getLastFocused()).id).toEqual(this.windowId);
      expect(this.group.windowId).toEqual(this.windowId);
    }, TestManager.TIMEOUT);

  });

  describe(" by willing the next one (on the list)", ()=>{

    beforeAll(async function() {
      this.lastSorting = window.Background.OptionManager.options.groups.sortingType;
      window.Background.OptionManager.updateOption("groups-sortingType", OPTION_CONSTANTS.SORT_OLD_RECENT);

      [this.windowId, this.windowId_bis] = await TestManager.openTwoWindows();
    });

    afterAll(async function() {
      window.Background.OptionManager.updateOption("groups-sortingType", this.lastSorting);

      await TestManager.closeWindows([this.windowId, this.windowId_bis]);
    });

    beforeEach(async function() {
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
      [this.ids, this.groups] = Session.createArrayGroups({
        groupsLength: 3,
        tabsLength: 4,
        global: true,
        active: 1,
        title: "Debug Select Groups",
      });
      this.groups = this.ids.map((id) => window.Background.GroupManager.groups[
        window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: true})
      ]);
    });

    afterEach(async function() {
      for (let id of this.ids) {
        if (window.Background.GroupManager.getGroupIndexFromGroupId(id, {error: false}) >= 0)
          await window.Background.GroupManager.removeGroupFromId(id);
      }
      await TestManager.clearWindow(this.windowId);
      await TestManager.clearWindow(this.windowId_bis);
    });

    it(" should switch to the next group open.", async function() {
      await window.Background.WindowManager.openGroupInWindow(this.ids[2], this.windowId);
      await window.Background.WindowManager.openGroupInWindow(this.ids[0], this.windowId_bis);


      await TestManager.focusedWindow(this.windowId_bis);
      let nextGroupId = await window.Background.WindowManager.selectNextGroup({
        direction: 1,
        open: true,
        refGroupId: this.ids[0],
      });
      await TestManager.waitWindowToBeFocused(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.groups[2].id);
      expect(currentWindow.id).toEqual(this.groups[2].windowId);
    });

    it(" should switch to the previous group open.", async function() {
      await window.Background.WindowManager.openGroupInWindow(this.ids[2], this.windowId);
      await window.Background.WindowManager.openGroupInWindow(this.ids[0], this.windowId_bis);

      await TestManager.focusedWindow(this.windowId_bis);

      let nextGroupId = await window.Background.WindowManager.selectNextGroup({
        direction: -1,
        open: true,
        refGroupId: this.ids[0],
      });
      await TestManager.waitWindowToBeFocused(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.groups[2].id);
      expect(currentWindow.id).toEqual(this.groups[2].windowId);
    });

    // Select Next Unopen
    it(" should switch to the next group NOT open.", async function() {
      await window.Background.WindowManager.openGroupInWindow(this.ids[1], this.windowId);
      await TestManager.focusedWindow(this.windowId);

      let nextGroupId = await window.Background.WindowManager.selectNextGroup({
        refGroupId: this.ids[0],
      });
      await TestManager.focusedWindow(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.ids[2]);
      expect(this.groups[2].windowId).toEqual(currentWindow.id);
    }, TestManager.TIMEOUT);

    // Select Previous Unopen
    it(" should switch to the previous group NOT open.", async function() {
      await window.Background.WindowManager.openGroupInWindow(this.ids[1], this.windowId);
      await TestManager.focusedWindow(this.windowId);

      let nextGroupId = await window.Background.WindowManager.selectNextGroup({
        direction: -1,
        refGroupId: this.ids[0],
      });
      await TestManager.focusedWindow(this.windowId);

      let currentWindow = await browser.windows.getLastFocused();

      expect(nextGroupId).toEqual(this.ids[2]);
      expect(this.groups[2].windowId).toEqual(currentWindow.id);
    }, TestManager.TIMEOUT);

  });
});
