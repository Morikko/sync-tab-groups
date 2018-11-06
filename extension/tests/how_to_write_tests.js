// Tests best practices:
/*
  * 1. Keep extension state: Save previous states (option, storage...), restore them after
  TODO: each it or deeper describe ???
  * 2. Each test can be launched lonely (else it should be precised)
  * 3. Success 10 times in a row (not lucky success)
  * 4. Respect the following structure for clarity
*/
TestConfig.installFakeTime();
TestConfig.uninstallFakeTime();

{
  /** Copy to the ROOTEST describe **/
  // Keep previous states
  beforeAll(TestConfig.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestConfig.initIntegrationAfterAll());

  // OR unit tests
  beforeAll(TestConfig.initUnitBeforeAll());
  beforeEach(TestConfig.initBeforeEach());

  {
    /** Tweaking Before Tests **/

    // Set custom options
    await TestConfig.changeSomeOptions({
      "privateWindow-removeOnClose": true,
      "pinnedTab-sync": false,
    })

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
      title:"Examples",
    })

    // Open windows
    this.windowIds = (await browser.windows.create()).id;
    this.windowIds = await WindowManager.openGroupInNewWindow(this.groups[1].id);

    TestConfig.splitOnHalfScreen(windowId)
    TestConfig.splitOnHalfTopScreen(windowId)
    TestConfig.splitOnHalfBottomScreen(windowId)

    TestConfig.installFakeTime();
    jasmine.clock.tick(10000);
  }

  /** TESTS **/
  {
    // Do you stuff...

    let previousTabs = Utils.getCopy(TestConfig.getGroup(
      GroupManager.groups,
      this.groupIds[targetGroupIndex]
    ).tabs)

    // If in windowId, there was a focus change on a discarded tab, this tab will load
    // Without wait, the tab can have the state about:blank instead of real value
    await TestConfig.waitAllTabsToBeLoadedInWindowId(this.windowId)

    let resultingTabs = await TabManager.getTabsInWindowId(
      this.windowId, {
        withoutRealUrl: false,
        withPinned: true,
      });

    // Don't care about some values
    TestConfig.resetActiveProperties(tabs)
    TestConfig.resetIndexProperties(tabs)
    TestConfig.setActiveProperties(previousTabs, targetTabIndex);

    // Control the results...
    expect(resultingTabs).toEqualTabs(expectedTabs);
    expect(resultingGroup).toEqualGroup(expectedGroup);
    expect(resultingGroups).toEqualGroups(expectedGroups);
  }

  /** Cleaning AFTER
      Might not  be necessary because everything is cleaned when a root describe is overed
  **/

  TestConfig.uninstallFakeTime();

  // Close all windows
  await TestConfig.closeWindows(this.windowIds)

  // Remove groups
  await TestConfig.removeGroups(this.groupIds)

}
