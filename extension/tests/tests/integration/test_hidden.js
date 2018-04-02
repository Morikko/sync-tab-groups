fdescribe("When Hidden Closing State is enabled, ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function(){
    OptionManager.updateOption("groups-closingState", OptionManager.CLOSE_HIDDEN);
    this.windowId = await TestManager.openWindow();
  });

  // Keep test session clean in between :)
  afterEach(async function() {
    await TestManager.clearWindow(this.windowId);
  });
  beforeEach(async function() {
    await TestManager.clearWindow(this.windowId);
  });

  describe("TabHidden.hideTab", ()=>{
    it(" hides a tab if it is possible and return true", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength, active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;

      const isHidden = await TabHidden.hideTab(targetTabId);

      const targetTab = await browser.tabs.get(targetTabId);

      expect( targetTab.hidden ).toBe(true);
      expect( isHidden ).toBe(true);
      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength-1);
    });

    it(" does nothing if it is impossible to hide and return false", async function(){
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength, active: tabsLength-1, pinnedTabs: 1});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[0].id;

      const isHidden = await TabHidden.hideTab(targetTabId);

      const targetTab = await browser.tabs.get(targetTabId);

      expect( targetTab.hidden ).toBe(false);
      expect( isHidden ).toBe(false);
      expect((await browser.tabs.query({
        windowId: this.windowId,
      })).length).toBe(tabsLength)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength);
    });
  });

  describe("TabHidden.showTab", ()=>{
    it(" shows a tab if it is possible and return true", async function(){
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength, active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;
      let targetTab;

      await browser.tabs.hide(targetTabId);
      targetTab = await browser.tabs.get(targetTabId);
      expect( targetTab.hidden ).toBe(true);

      const isShown = await TabHidden.showTab(targetTabId, this.windowId);
      targetTab = await browser.tabs.get(targetTabId);
      expect( targetTab.hidden ).toBe(false);
      expect( isShown ).toBe(true);
    });

    it(" does nothing if it is impossible to show and return false", async function(){
      const tabsLength = 3;
      const tabs = Session.createTabs({tabsLength, active: 0});

      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const targetTabId = openTabs[1].id;
      let targetTab;

      await browser.tabs.hide(targetTabId);
      targetTab = await browser.tabs.get(targetTabId);
      expect( targetTab.hidden ).toBe(true);

      await TestManager.removeTabs(targetTabId);

      const isShown = await TabHidden.showTab(targetTabId, this.windowId);
      expect( isShown ).toBe(false);
    });
  });

  describe("TabManager.openListOfTabs", ()=>{
    it(" shows tabs previously hidden", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      });
      await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      await TabManager.openListOfTabs(tabsToHide, this.windowId);

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(0)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength);

      const finalTabs = (await browser.tabs.query({windowId: this.windowId}))
            .map(tab => tab.id);
      tabsToHide.forEach(({id}) => {
        expect(finalTabs.indexOf(id)).not.toBe(-1);
      });
    });

    it(" shows tabs previously hidden and opens missing tabs", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: true,
      });
      await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      await TabManager.openListOfTabs(tabsToHide, this.windowId);

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(0)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(tabsLength);

      const finalTabs = (await browser.tabs.query({windowId: this.windowId}))
            .map(tab => tab.id);
      tabsToHide.forEach(({id}) => {
        expect(finalTabs.indexOf(id)).toBe(-1);
      });
    });
  });

  describe("TabManager.removeTabs", ()=>{
    it(" hides tabs in the window", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: false,
      });

      const isHidden = await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(tabsLength-1)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: false
      })).length).toBe(1);
    });

    it(" hides tabs in the group and closes failing tabs", async function(){
      const tabsLength = 5;
      const tabs = Session.createTabs({tabsLength});
      const openTabs = await TestManager.replaceTabs(this.windowId, tabs);

      const tabsToHide = await browser.tabs.query({
        windowId: this.windowId,
        active: true,
      });

      const isHidden = await TabManager.removeTabs(
        tabsToHide.map(tab => tab.id)
      );

      expect((await browser.tabs.query({
        windowId: this.windowId
      })).length).toBe(tabsLength-1)
      expect((await browser.tabs.query({
        windowId: this.windowId,
        hidden: true
      })).length).toBe(0);
    });
  });


});
