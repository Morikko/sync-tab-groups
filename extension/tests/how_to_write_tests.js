// Tests best practices:

{
  /** BEFORE **/
  beforeAll(function(){
    // Add tabs and groups matchers
    jasmine.addMatchers(tabGroupsMatchers);
  });
  {

    // Set custom options
    this.previousOptions = TestManager.swapOptions({
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

    TestManager.splitOnHalfScreen(windowId)
    TestManager.splitOnHalfTopScreen(windowId)
    TestManager.splitOnHalfBottomScreen(windowId)
  }

  /** TESTS **/
  {
    // Do you stuff...

    let previousTabs = Utils.getCopy(TestManager.getGroup(
      GroupManager.groups,
      this.groupIds[targetGroupIndex]
    ).tabs)

    // If in windowId, there was a focus change on a discarded tab, this tab will load
    // Without wait, the tab can have the state about:blank instead of real value
    await TestManager.waitAllTabsToBeLoadedInWindowId(this.windowId)

    let resultingTabs = await TabManager.getTabsInWindowId(
      this.windowId,
      true,
      true,
    );

    // Don't care about some values
    TestManager.resetActiveProperties(tabs)
    TestManager.resetIndexProperties(tabs)
    TestManager.setActiveProperties(previousTabs, targetTabIndex);

    // Control the results...
    expect(resultingTabs).toEqualTabs(expectedTabs);
    expect(resultingGroup).toEqualGroup(expectedGroup);
    expect(resultingGroups).toEqualGroups(expectedGroups);
  }

  /** AFTER **/
  // Close all windows
  await TestManager.closeWindows(this.windowIds)

  // Remove groups
  await TestManager.removeGroups(this.groupIds)

  // Reset options
  TestManager.swapOptions(this.previousOptions);
}
