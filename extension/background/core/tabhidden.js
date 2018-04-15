var TabHidden = TabHidden || {};
TabHidden.TABHIDDEN_SESSION_KEY = "TABHIDDEN_ID";

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
    browser.sessions.removeTabValue(
      tabId,
      TabHidden.TABHIDDEN_SESSION_KEY
    );
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
    browser.sessions.setTabValue(
      tabId,
      TabHidden.TABHIDDEN_SESSION_KEY,
      tabId,
    );
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
  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
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

TabHidden.onStartInitialization = async function() {
  if (OptionManager.options.groups.closingState !== OptionManager.CLOSE_HIDDEN) {
    return;
  }

  try {
     // 1. Get all hidden tab ids
    const hiddenTabIds = (await browser.tabs.query({hidden: true}))
                            .map(({id}) => id);
    const updatedHiddenTabIds = {};

    // 2. Bind back to the tabs in the groups
    await Promise.all(
      hiddenTabIds.map(async (tabId) => {
        const keyValue = await browser.sessions.getTabValue(
          tabId,
          TabHidden.TABHIDDEN_SESSION_KEY
        );
        if ( keyValue == null ) return;

        const oldTabId = parseInt(keyValue)
        try {
          const groupId = GroupManager.getGroupIdFromTabId(oldTabId, {error:true});
          const groupIndex = GroupManager.getGroupIndexFromGroupId(
            groupId
          );
          const tabIndex = GroupManager.getTabIndexFromTabId(
            oldTabId, groupIndex
          );
          GroupManager.groups[groupIndex].tabs[tabIndex].id = tabId;
          updatedHiddenTabIds[tabId] = true
        } catch(e) {console.error(e)}
      })
    );

    // 3. Update hidden state to missing ones
    GroupManager.groups.forEach(({tabs}) => {
      tabs.forEach(tab =>{
        if ( !tab.hidden ) {
          return
        }
        if ( updatedHiddenTabIds[tab.id] != null ) {
          return
        }
        tab.hidden = false;
      })
    })

    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
  } catch (e) {
    console.error(e)
  }
}