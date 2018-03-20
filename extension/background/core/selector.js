var Selector = Selector || {};

Selector.WINDOW_ID = WINDOW_ID_NONE;

Selector.TYPE = Object.freeze({
  EXPORT: "Export",
  IMPORT: "Import",
});

// Export or Import
Selector.type = Selector.TYPE.IMPORT;
// The groups currently under selection (never directly the groups in place)
Selector.groups = [];
// What kind of groups (Example: my-groups.json, back-up-10-1993..)
Selector.file = "No groups selected";


Selector.onOpenGroupsSelector = async function({
  title=Selector.type + ": " + Selector.file,
  groups=[],
}={}) {
  const url = browser.extension.getURL(
    Utils.SELECTOR_PAGE_URL
    + "?title=" + title
  );
  
  const windowInfo = {
    height: (window.screen.availHeight - 100),
    width: Math.min( window.screen.availWidth, 850 ),
    top: 50,
    left: Math.round((window.screen.availWidth
      - Math.min( window.screen.availWidth, 850 ))/2)
  };

  Selector.groups = groups;

  if ( Selector.WINDOW_ID === WINDOW_ID_NONE ) {
    windowInfo["url"] = url;
    // The window is not visible
    windowInfo["type"] = "popup";
    Selector.WINDOW_ID = (await browser.windows.create(windowInfo)).id;
  } else {
    const tab = await browser.tabs.query({
      windowId: Selector.WINDOW_ID,
      index: 0,
    });
    await browser.tabs.update(tab[0].id, {
      url
    });
    windowInfo["focused"] = true;
    await browser.windows.update(Selector.WINDOW_ID, windowInfo);
  }
}

Selector.wasClosedGroupsSelector = function (windowId) {
  if ( windowId === Selector.WINDOW_ID && windowId !== WINDOW_ID_NONE) {
    Selector.WINDOW_ID = WINDOW_ID_NONE;
  }
}

Selector.closeGroupsSelector = async function() {
  if ( Selector.WINDOW_ID !== WINDOW_ID_NONE ) {
    try {
      await browser.windows.remove(Selector.WINDOW_ID);
    } catch (e) {}
    finally {
      Selector.WINDOW_ID = WINDOW_ID_NONE;
    }
  }
}
