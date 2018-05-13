var TabHidden = TabHidden || {};
TabHidden.TABHIDDEN_SESSION_KEY = "TABHIDDEN_ID";
TabHidden.cleaningUnknownHiddenTabsProcess = null;

/**
 * @param {Number} tabId
 * @param {Number} windowId
 * @param {Number} index
 * @return {Boolean} is tab shown
 */
TabHidden.showTab = async function(tabId, windowId, index=-1) {
  // Closed tab Id
  if(typeof tabId === 'string') {
    return false;
  }
  try {
    await browser.tabs.move(tabId, {windowId, index});
    await browser.tabs.show(tabId);
    browser.sessions.removeTabValue(
      tabId,
      TabHidden.TABHIDDEN_SESSION_KEY
    );
    return true;
  } catch (e) {
    if(Utils.DEBUG_MODE) {
      e.message = "Impossible to show tab: " + e.message;
      LogManager.warning(e.message, {arguments});
    }
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
    if (OptionManager.options.groups.discardedHide) {
      setTimeout( // Avoid overloading
        async () => {
          try {
            await browser.tabs.discard(tabId)
          } catch (e) {
            LogManager.warning(e.message, {arguments});
          }
        },
        2000,
      )
    }
    
    browser.sessions.setTabValue(
      tabId,
      TabHidden.TABHIDDEN_SESSION_KEY,
      tabId,
    );
  }

  return result.length !== 0;
}


TabHidden.closeAllHiddenTabsInGroups = async function (groups=GroupManager.groups) {

  const removeHiddenTab = async function(tab) {
    try {
      await browser.tabs.remove(tab.id);
    } catch (e) {LogManager.error(e)}
    tab.hidden = false;
    return;
  }

  const removeHiddenTabsInGroup = async function(group) {
    return Promise.all(
        group.tabs.filter(tab => tab.hidden)
                  .map(removeHiddenTab)
    )
  }

  await Promise.all(groups.map(removeHiddenTabsInGroup));
  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
}

// Close hidden tabs and change hidden property to false if part of a group
TabHidden.closeHiddenTabs = async function (tabIds) {
  if ( !Array.isArray(tabIds) ) {
    tabIds = [tabIds]
  }

  try {
    await browser.tabs.remove(tabIds);
  } catch (e) {LogManager.error(e, {arguments})}

  tabIds.forEach(tabId => {
    const groupId = GroupManager.getGroupIdFromTabId(tabId, {error: false});
    if(groupId===-1) return;

    const groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId, {error: false}
    );
    if(groupIndex===-1) return;

    const tabIndex = GroupManager.getTabIndexFromTabId(
      tabId, groupIndex, {error: false}
    );
    if(tabIndex===-1) return;
    GroupManager.groups[groupIndex].tabs[tabIndex].hidden = false;
  });

  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
}

TabHidden.removeAllHiddenTabs = async function(){
  const allTabs = await browser.tabs.query({});
  const allHiddenTabsIds = allTabs
    .filter(({hidden}) => hidden)
    .map(({id}) => id);
  
  await TabHidden.closeHiddenTabs(allHiddenTabsIds);
}

TabHidden.onStartInitialization = async function() {
  if (OptionManager.options.groups.closingState 
    !== OptionManager.CLOSE_HIDDEN) {
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

        const oldTabId = parseInt(keyValue);

        const groupId = GroupManager.getGroupIdFromTabId(
          oldTabId,  {error:false}
        );
        if(groupId===-1) return;

        const groupIndex = GroupManager.getGroupIndexFromGroupId(
          groupId,  {error:false}
        );
        if(groupIndex===-1) return;

        const tabIndex = GroupManager.getTabIndexFromTabId(
          oldTabId, groupIndex,  {error:false}
        );
        if(tabIndex===-1) return;

        GroupManager.groups[groupIndex].tabs[tabIndex].id = tabId;
        updatedHiddenTabIds[tabId] = true;

        return;
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
    LogManager.error(e)
  }
}

// Close hidden tabs not in any group 
TabHidden.closeUnknownHiddenTabs = async function() {
  try {
    const hiddenTabIds = (await browser.tabs.query({hidden: true}))
                            .map(({id}) => id);
    
    await Promise.all(
      hiddenTabIds.map(async (tabId) => {
        const groupId = GroupManager.getGroupIdFromTabId(
          tabId,  {error:false}
        );
        if(groupId>-1) return;

        try {
          console.log(tabId)
          await browser.tabs.remove(tabId);
        } catch (e) {LogManager.error(e)}

        return;
      })
    );
  } catch(e) {
    LogManager.error(e);
  }
}

TabHidden.startCleaningUnknownHiddenTabsProcess = async function(doItNow=false) {
  if (!OptionManager.options.groups.removeUnknownHiddenTabs) {
    return;
  }

  if(doItNow) {
    await TabHidden.closeUnknownHiddenTabs();
  }

  TabHidden.cleaningUnknownHiddenTabsProcess = setInterval(
    TabHidden.closeUnknownHiddenTabs,
    2 * 60 * 1000
  );
}

TabHidden.stopCleaningUnknownHiddenTabsProcess = function() {
  if (TabHidden.cleaningUnknownHiddenTabsProcess) {
    clearInterval(TabHidden.cleaningUnknownHiddenTabsProcess);
    TabHidden.cleaningUnknownHiddenTabsProcess = null;
  }
}

