import TestManager from '../../utils/TestManager'
import tabGroupsMatchers from '../../utils/tabGroupsMatchers'
import Session from '../../examples/session'
import TAB_CONSTANTS from '../../../background/core/TAB_CONSTANTS'

describe("window.Background.TabManager[Add/Remove]", ()=>{

  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  // Create Window
  beforeAll(async function() {
    window.Background.OptionManager.updateOption("groups-syncNewWindow", false);
    window.Background.OptionManager.updateOption("groups-discardedOpen", true);
    jasmine.addMatchers(tabGroupsMatchers);
    this.windowId = (await browser.windows.create()).id;
    await TestManager.splitOnHalfScreen(this.windowId);
  });

  // Keep test session clean in between :)
  afterEach(async function() {
    await TestManager.clearWindow(this.windowId);
  });

  beforeEach(async function() {
    await TestManager.clearWindow(this.windowId);
  });


  describe(".openListOfTabs", ()=>{

    describe(" with Normal tabs", ()=>{

      it(" should not open again, if only new tab", async function() {
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let tabId = previousTabs[0].id;

        await window.Background.TabManager.openListOfTabs(
          [],
          this.windowId,{
            openAtLeastOne: true,
          });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expect(resultingTabs).toEqualTabs(previousTabs);
        expect(resultingTabs[0].id).toEqual(tabId);
      });

      it(" should open List of Tabs in Window", async function() {
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 0,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await window.Background.TabManager.openListOfTabs(
          tabs,
          this.windowId
        );

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = tabs.concat(previousTabs);
        TestManager.resetIndexProperties(expectedTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetActiveProperties(resultingTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it(" should open List of Tabs in last position", async function() {
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
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

        await window.Background.TabManager.openListOfTabs(
          tabs,
          this.windowId,{
            inLastPos: true,
          });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = previousTabs.concat(tabs);
        expectedTabs.forEach((tab, index)=>{
          tab.index = index;
        })

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });

      it(" shoudl open At Least One New Tab", async function() {
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let new_tab  = await window.Background.TabManager.openListOfTabs(
          [],
          this.windowId,{
            inLastPos: true,
            openAtLeastOne: true,
            forceOpenNewTab: true,
          });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        previousTabs.concat(new_tab);

        // Last New Tab
        expect(resultingTabs.length).toEqualTabs(previousTabs.length+1);

        if (resultingTabs[resultingTabs.length-1].url === 'about:blank') {
          resultingTabs[resultingTabs.length-1].url = TAB_CONSTANTS.NEW_TAB;
        }

        expect(resultingTabs[resultingTabs.length-1].url).toEqual(TAB_CONSTANTS.NEW_TAB);

        // Previous has not changed
        resultingTabs.splice(resultingTabs.length-1)
        TestManager.resetActiveProperties(previousTabs);

        expect(resultingTabs).toEqualTabs(previousTabs);
      });

    });

    describe(" with Pinned tabs -", ()=>{
      it(" should open pinned and non pinned before", async function() {
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await window.Background.TabManager.openListOfTabs(
          tabs,
          this.windowId,
        );

        await browser.tabs.remove(previousTabs.map(tab => tab.id));

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        tabs[tabs.length-1].active = true;

        expect(resultingTabs).toEqualTabs(tabs);
      });

      it(" should open pinned after previous pinned and normal before previous normal", async function() {
        let blank = await window.Background.TabManager.removeTabsInWindow(
          this.windowId,{
            openBlankTab: true,
          });


        let tabsFirst = Session.createTabs({
          tabsLength: 4,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        let tabsSecond = Session.createTabs({
          tabsLength: 4,
          pinnedTabs: 2,
          privilegedLength: 0,
          extensionUrlLength: 0,
        });

        await window.Background.TabManager.openListOfTabs(
          tabsFirst,
          this.windowId,
        );

        await browser.tabs.remove(blank.id);

        // Will be entwined
        await window.Background.TabManager.openListOfTabs(
          tabsSecond,
          this.windowId,
        );

        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = window.Background.Utils.getCopy(tabsFirst);

        let offset = tabsFirst.filter(tab=>tab.pinned).length;
        for (let i=0; i<tabsSecond.length; i++) {
          expectedTabs.splice(offset+i, 0, tabsSecond[i]);
        }

        // Reset active
        TestManager.resetActiveProperties(resultingTabs);
        TestManager.resetActiveProperties(expectedTabs);
        TestManager.resetIndexProperties(expectedTabs);

        expect(resultingTabs).toEqualTabs(expectedTabs);
      });
    });

    describe(" on opening", ()=>{
      it(" should open the list of tabs and active only one tab", async function() {
        // Close all except blank
        let survivorTab = await window.Background.TabManager.removeTabsInWindow(
          this.windowId,{
            openBlankTab: true,
            remove_pinned: true,
          });

        window.Background.OptionManager.updateOption("groups-discardedOpen", true);
        let tabs = Session.createTabs({
          tabsLength: 5,
          pinnedTabs: 0,
          active: 2,
        });

        await window.Background.TabManager.openListOfTabs(
          tabs,
          this.windowId,{
            pendingTab: survivorTab,
          });
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let resultingTabsWithFancy = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withoutRealUrl: false,
            withPinned: true,
          });

        let nbrNotDiscarded = resultingTabsWithFancy.filter(tab => tab.url.includes(window.Background.Utils.LAZY_PAGE_URL)).length;

        expect(resultingTabs).toEqualTabs(tabs);
        expect(nbrNotDiscarded).toEqual(4);
      });

      it(" should update the openerTabIds with the new ids", async function() {
        const tabsLength = 4;
        let tabs = Session.createTabs({
          tabsLength: tabsLength,
          active: 0,
        });

        for (let i=1; i<tabs.length-1; i++) {
          tabs[i].openerTabId = tabs[i-1].id;
        }
        tabs[tabs.length-1].openerTabId = tabs[0].id;

        let survivor = await window.Background.TabManager.removeTabsInWindow(
          this.windowId,{
            openBlankTab: true,
            remove_pinned: true,
          });
        await window.Background.TabManager.openListOfTabs(
          tabs,
          this.windowId,{
            inLastPos: true,
          });
        await browser.tabs.remove(survivor.id);
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        expect(resultingTabs.length).toEqual(tabsLength);
        expect(resultingTabs[0].hasOwnProperty("openerTabId"))
          .toBe(false);
        for (let i=1; i<resultingTabs.length-1; i++) {
          expect(resultingTabs[i].openerTabId)
            .toEqual(resultingTabs[i-1].id, "index: " + i);
        }

        expect(resultingTabs[resultingTabs.length-1].openerTabId)
          .toEqual(resultingTabs[0].id);
      });
    })
  });


  describe(".removeTabsInWindow", ()=>{
    describe(" with Normal tabs", ()=>{
      it(" without special argument should remove all the tabs except the first one", async function() {
        // Open some tabs
        for (let i=0; i<3; i++) {
          await browser.tabs.create({
            url: Session.getFakeUrl(),
            windowId: this.windowId,
          });
        }

        // Remove all the New Tab (only)
        let new_tabs = await browser.tabs.query({
          windowId: this.windowId,
          title: "New Tab",
        });
        if (new_tabs.length > 0) {
          new_tabs = new_tabs.map(tab => tab.id);
          await browser.tabs.remove(new_tabs);
          await window.Background.TabManager.waitTabsToBeClosed(new_tabs);
        }

        let survivorTab = [await window.Background.TabManager.removeTabsInWindow(
          this.windowId
        )];
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        survivorTab[0].active = true;
        // Normally just one tab
        expect(resultingTabs).toEqualTabs(survivorTab);
      });

      it(" with openBlankTab:true should remove all tabs and let only one new tab", async function() {
        // Open some tabs
        for (let i=0; i<3; i++) {
          await browser.tabs.create({
            url: Session.getFakeUrl(),
            windowId: this.windowId,
          });
        }

        let new_tab = await window.Background.TabManager.removeTabsInWindow(
          this.windowId,{
            openBlankTab: true,
          });
        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });
        new_tab.index=0;

        expect(resultingTabs).toEqualTabs([new_tab]);
      });
    });

    describe(" with Pinned tabs -", ()=>{
      it(" ,without special argument and pinned tabs sync:false, should remove all the tabs except all the pinned tabs.", async function() {
        window.Background.OptionManager.updateOption("pinnedTab-sync", false);

        // Open some tabs
        for (let i=0; i<5; i++) {
          await browser.tabs.create({
            pinned: i<2,
            url: Session.getFakeUrl(),
            windowId: this.windowId,
          });
        }
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let survivorTab = await window.Background.TabManager.removeTabsInWindow(
          this.windowId,
        );
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = previousTabs.filter(tab=>tab.pinned);

        expectedTabs[0].active = true;

        expect(resultingTabs).toEqualTabs(expectedTabs);
        expect(survivorTab).toBeUndefined();
      });

      it(" ,without special argument and pinned tabs sync:true, should remove all the tabs except the first pinned tab.", async function() {
        window.Background.OptionManager.updateOption("pinnedTab-sync", true);

        // Open some tabs
        for (let i=0; i<5; i++) {
          await browser.tabs.create({
            pinned: i<2,
            url: Session.getFakeUrl(),
            windowId: this.windowId,
          });
        }
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);
        let previousTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let survivorTab = [await window.Background.TabManager.removeTabsInWindow(
          this.windowId,
        )];
        await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId);

        let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
          this.windowId,{
            withPinned: true,
          });

        let expectedTabs = [previousTabs[0]];
        expectedTabs[0].active = true;
        survivorTab[0].active = true;

        expect(resultingTabs).toEqualTabs(expectedTabs);
        expect(survivorTab).toEqualTabs(expectedTabs);
      });
    });


  });

});
