describe("Tabs Creation/Deletion - ", ()=>{

  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  beforeAll(async function(){
    // Create Window
    OptionManager.updateOption("groups-syncNewWindow", false);
    jasmine.addMatchers(tabGroupsMatchers);
    this.windowId = (await browser.windows.create()).id;
    await TestManager.splitOnHalfScreen(this.windowId);
  });

  afterAll(async function(){
    // Close Window
    await browser.windows.remove(this.windowId);
  });

  beforeEach(async function() {
    this.previousTabs = await TabManager.getTabsInWindowId(
      this.windowId,{
        withPinned: true,
      });
  });

  describe("Normal tabs - ", ()=>{
    describe("openListOfTabs - ", ()=>{
      it("Do not open again, if only new tab", async function(){
        let tabId = this.previousTabs[0].id;

        await TabManager.openListOfTabs(
          [],
          this.windowId,{
            openAtLeastOne: true,
        });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(this.previousTabs);
        expect(resultingTabs[0].id).toEqual(tabId);
      });

      it("Open List of Tabs in Window", async function(){
        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 0,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId
        );

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = tabs.concat(this.previousTabs);
        TestManager.resetIndexProperties(expectedTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(resultingTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it("Open List of Tabs in last position", async function(){
        let previousTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
        });

        let tabs = Session.createTabs({
          tabsLength: 3,
          pinnedTabs: 0,
          privilegedLength: 0,
          extensionUrlLength: 0,
          active: -2,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId,{
            inLastPos: true,
        });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = previousTabs.concat(tabs);
        expectedTabs.forEach((tab, index)=>{
          tab.index = index;
        })

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it("Open At Least One New Tab", async function(){
        let new_tab  = await TabManager.openListOfTabs(
          [],
          this.windowId,{
            inLastPos: true,
            openAtLeastOne: true,
        });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = this.previousTabs.concat(new_tab);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetIndexProperties(expectedTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });
    });

    describe("removeTabsInWindow - ", ()=>{
      it("Remove tabs and let only First Tab", async function(){
        let new_tabs = await browser.tabs.query({
          windowId: this.windowId,
          title: "New Tab",
        });

        await browser.tabs.remove(new_tabs.map(tab => tab.id));

        let survivorTab = await TabManager.removeTabsInWindow(
          this.windowId
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        survivorTab.url = Utils.extractTabUrl(survivorTab.url);
        survivorTab = [survivorTab];

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(survivorTab);

        expect(resultingTabs).toEqualTabs(survivorTab);
      });

      it("Remove tabs and let only New Tab", async function(){
        let new_tab = await TabManager.removeTabsInWindow(
          this.windowId,{
            openBlankTab: true,
          });
        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        new_tab.index=0;
        expect(resultingTabs).toEqualTabs([new_tab]);
      });
    });
  });

  describe("Pinned tabs -", ()=>{
    describe("openListOfTabs - ", ()=>{
      it("Open List of Tabs with some Pinned Tabs", async function(){
        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId,
        );

        await browser.tabs.remove(this.previousTabs.map(tab => tab.id));

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        tabs[tabs.length-1].active = true;
        expect(resultingTabs).toEqualTabs(tabs);
      });

      it("Open List of Tabs with some Pinned Tabs with already some in the Window", async function(){
        let tabs = Session.createTabs({
          tabsLength: 4,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await TabManager.openListOfTabs(
          tabs,
          this.windowId,
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expectedTabs = Utils.getCopy(this.previousTabs);

        let offset = expectedTabs.filter(tab=>tab.pinned).length;
        for (let i=0; i<tabs.length; i++) {
          expectedTabs.splice(offset+i, 0, tabs[i]);
        }

        // Reset active
        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetIndexProperties(expectedTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });
    });

    describe("removeTabsInWindow - ", ()=>{
      it("Remove all tabs and let only pinned", async function(){
        OptionManager.updateOption("pinnedTab-sync", false);

        let survivorTab = await TabManager.removeTabsInWindow(
          this.windowId,
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expectedTabs = this.previousTabs.filter(tab=>tab.pinned);

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        expect(resultingTabs).toEqualTabs(expectedTabs);
        expect(survivorTab).toBeUndefined();
      });

      it("Remove all tabs and let only first pinned", async function(){
        OptionManager.updateOption("pinnedTab-sync", true);

        let survivorTab = await TabManager.removeTabsInWindow(
          this.windowId,
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expectedTabs = [this.previousTabs[0]];
        survivorTab.url = Utils.extractTabUrl(survivorTab.url);
        survivorTab = [survivorTab];

        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(survivorTab);
        expect(resultingTabs).toEqualTabs(survivorTab);
        expect(survivorTab).toEqualTabs(expectedTabs);
      });
    });
  });

  describe("Active support - ", ()=>{
    it("Open list Tabs and keeping only one active", async function(){
      // Close all except blank
      let survivorTab = await TabManager.removeTabsInWindow(
        this.windowId,{
          openBlankTab: true,
          remove_pinned: true,
        });

      OptionManager.updateOption("groups-discardedOpen", true);
      let tabs = Session.createTabs({
        tabsLength: 5,
        pinnedTabs: 0,
        active: 2,
      });

      await TabManager.openListOfTabs(
        tabs,
        this.windowId,{
          pendingTab: survivorTab,
      });
      await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

      let resultingTabs = await TabManager.getTabsInWindowId(
        this.windowId,{
          withPinned: true,
        });

      let resultingTabsWithFancy = await TabManager.getTabsInWindowId(
        this.windowId,{
          withoutRealUrl: false,
          withPinned: true,
        });

      let nbrNotDiscarded = resultingTabsWithFancy.filter(tab => tab.url.includes(Utils.LAZY_PAGE_URL)).length;

      expect(resultingTabs).toEqualTabs(tabs);
      expect(nbrNotDiscarded).toEqual(4);
    });
  });
});
