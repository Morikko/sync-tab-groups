var TestManager = TestManager || {};

/**
 * If not full: compare only url
 * Else compare: title, pinned, active, --- not discarded, favIconUrl
 */
TestManager.compareTabs = function(tabs, tabs_ref, full = false) {
  /*console.log(tabs);
  console.log(tabs_ref);*/
  if (tabs.length !== tabs_ref.length)
    return false;

  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].url !== tabs_ref[i].url)
      return false;
    if (full) {
      if (tabs[i].title !== tabs_ref[i].title)
        return false;
      if (tabs[i].pinned !== tabs_ref[i].pinned)
        return false;
      if (tabs[i].active !== tabs_ref[i].active)
        return false;
    }
  }

  return true;
}


TestManager.isWindowWithGoodTabs = async function(windowId, tabs_ref) {
  const tabs = await browser.tabs.query({
    windowId: this.windowId
  });

  return TestManager.compareTabs(tabs, tabs_ref);
}

TestManager.compareGroups = function(groups, groups_ref) {
  /*console.log(groups);
  console.log(groups_ref);*/
  if (groups.length !== groups_ref.length)
    return false;

  for (let i = 0; i < groups.length; i++) {
    if (groups[i].title !== groups_ref[i].title)
      return false;
    if (groups[i].id !== groups_ref[i].id)
      return false;
    if (groups[i].windowId !== groups_ref[i].windowId)
      return false;
    if (!TestManager.compareTabs(groups[i].tabs, groups_ref[i].tabs, true))
      return false;
  }
  return true;
}
