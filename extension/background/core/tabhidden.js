var TabHidden = TabHidden || {};

/**
 * @param {Number} tabId
 * @param {Number} windowId
 * @param {Number} index
 * @return {Boolean} is tab shown
 */
TabHidden.showTab = async function(tabId, windowId, index=-1) {
  try {
    await browser.tabs.move(tabId, {windowId, index});
    await browser.tabs.show(tabId);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param {Number} tabId
 * @return {Boolean} is tab hidden
 */
TabHidden.hideTab = async function(tabId) {
  const result = await browser.tabs.hide(tabId);
  if ( result.length !== 0 ) {
    setTimeout( // Avoid overloading
      () => browser.tabs.discard(tabId),
      2000,
    )
    
  }

  return result.length !== 0;
}


TabHidden.closeAllHiddenTabsInGroups = async function (groups=GroupManager.groups) {
  await Promise.all(
    groups.map(group => {
      Promise.all(
        group.tabs.filter(tab => tab.hidden)
                  .map((tab) => {
                    browser.tabs.remove(tab.id);
                    tab.hidden = false;
                  })
      )
    })
  )
}

// Close hidden tabs and change hidden property to false if part of a group
TabHidden.closeHiddenTabs = async function (tabIds) {
  if ( !Array.isArray(tabIds) ) {
    tabIds = [tabIds]
  }

  try {
    await browser.tabs.remove(tabIds);
  } catch (e) {console.error(e)}

  tabIds.forEach(tabId => {
    try {
      const groupId = GroupManager.getGroupIdFromTabId(tabId);
      const groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupId
      );
      const tabIndex = GroupManager.getTabIndexFromTabId(
        tabId, groupIndex
      );
      GroupManager.groups[groupIndex].tabs[tabIndex].hidden = false;
    } catch(e) {console.error(e)}
  });

  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
}


