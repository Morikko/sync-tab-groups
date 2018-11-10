/*
  * 1. Keep extension state: Save previous states (option, storage...), restore them after
  * 2. Each test can be launched lonely (else it should be precised)
  * 3. Success 10 times in a row (not lucky success)
  * 4. Respect the following structure for clarity
*/
import TestHelper from './utils/TestHelper'
import TestUtils from './utils/TestUtils';
import Session from './examples/session';

describe('Tests best practices', ()=>{
  // Keep previous states
  beforeAll(TestHelper.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestHelper.initIntegrationAfterAll());

  // OR unit tests
  beforeAll(TestHelper.initUnitBeforeAll());

  beforeEach(TestHelper.initBeforeEach());

  beforeAll(async function someTweakingExamples() {
    // Set custom options
    await TestHelper.changeSomeOptions({
      "privateWindow-removeOnClose": true,
      "pinnedTab-sync": false,
    });

    // Create Groups
    [this.groupIds, this.groups] = Session.createArrayGroups({
      groupsLength: 3,
      tabsLength: [7,5,2],
      pinnedTabs: [2,0,0],
      lazyMode: false,
      privilegedLength: 0,
      openPrivileged: false,
      extensionUrlLength: 0,
      global: true,
      incognito: false,
      active: -1,
      title: "Examples",
    })

    // Open windows

    this.windowIds = (await browser.windows.create()).id;
    this.windowIds = await window.Background.WindowManager.openGroupInNewWindow(this.groups[1].id);

    let windowId
    TestUtils.splitOnHalfScreen(windowId)
    TestUtils.splitOnHalfTopScreen(windowId)
    TestUtils.splitOnHalfBottomScreen(windowId)

    TestHelper.installFakeTime();
    jasmine.clock.tick(10000);
  })

  afterAll(async function someTweakingExamples() {
    /** Cleaning AFTER
      Might not  be necessary because everything is cleaned when a root describe is overed
  **/

    TestHelper.uninstallFakeTime();

    // Close all windows
    await TestUtils.closeWindows(this.windowIds)

    // Remove groups
    await TestUtils.removeGroups(this.groupIds)

  })

  it('should do your test', async()=>{
    // Do you stuff...

    let targetGroupIndex
    let previousTabs = window.Background.Utils.getCopy(TestUtils.getGroup(
      window.Background.GroupManager.groups,
      this.groupIds[targetGroupIndex]
    ).tabs)

    // If in windowId, there was a focus change on a discarded tab, this tab will load
    // Without wait, the tab can have the state about:blank instead of real value
    await TestUtils.waitAllTabsToBeLoadedInWindowId(this.windowId)

    let resultingTabs = await window.Background.TabManager.getTabsInWindowId(
      this.windowId, {
        withoutRealUrl: false,
        withPinned: true,
      });

    // Don't care about some values
    let tabs, targetTabIndex
    TestUtils.resetActiveProperties(tabs)
    TestUtils.resetIndexProperties(tabs)
    TestUtils.setActiveProperties(previousTabs, targetTabIndex);

    // Control the results...
    let resultingGroups, resultingGroup, expectedGroup, expectedTabs, expectedGroups

    expect(resultingTabs).toEqualTabs(expectedTabs);
    expect(resultingGroup).toEqualGroup(expectedGroup);
    expect(resultingGroups).toEqualGroups(expectedGroups);
  })
})