var TestManager = TestManager || {};

TestManager.compareTabs = function (tabs, tabs_ref) {
  console.log(tabs);
  console.log(tabs_ref);
  if ( tabs.length !== tabs_ref.length)
    return false;

  for (let i=0; i<tabs.length; i++) {
    if ( tabs[i].url !== tabs_ref[i].url )
      return false;
  }
  return true;
}


TestManager.isWindowWithGoodTabs = async function (windowId, tabs_ref ) {
  const tabs = await browser.tabs.query({
    windowId: this.windowId
  });

  return TestManager.compareTabs(tabs, tabs_ref);
}
