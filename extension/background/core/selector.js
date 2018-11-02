const Selector = {};

Selector.WINDOW_ID = WINDOW_ID_NONE;

// Export or Import
Selector.type = Selector.TYPE.IMPORT;
// The groups currently under selection (never directly the groups in place)
Selector.groups = [];
// What kind of groups (Example: my-groups.json, back-up-10-1993..)
Selector.file = "No groups selected";


Selector.onOpenGroupsSelector = async function({
  title=Selector.file,
  groups=[],
  type=Selector.TYPE.IMPORT,
  force=false,
}={}) {
  if( groups.length === 0 && !force ) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": type + " " + title,
      "message": "The group list was empty...",
      "eventTime": 4000,
    });
    return;
  }
  if ( GroupManager.checkCorruptedGroups(groups) ) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": type + " " + title,
      "message": "The group list is corrupted... It is impossible to load it.",
      "eventTime": 4000,
    });
    return;
  }

  const preUrl = Utils.SELECTOR_PAGE_URL
  + "?title=" + type + " " + title
  + "&type=" + type;
  const url = browser.extension.getURL(
    preUrl
  );

  let height = (window.screen.availHeight - 100);
  const windowInfo = {
    height,
    width: Math.min( window.screen.availWidth, 850 ),
    top: 50,
    left: Math.round((window.screen.availWidth
      - Math.min( window.screen.availWidth, 850 ))/2)
  };

  Selector.groups = GroupManager.getGroupsWithoutPrivate(
      groups.filter(group => group.tabs.length) // Only non empty groups
  );
  GroupManager.prepareGroups(Selector.groups);
  Selector.type = type;

  if ( Selector.WINDOW_ID === WINDOW_ID_NONE ) {
    windowInfo["url"] = url;
    // The window is not visible
    windowInfo["type"] = "popup";
    Selector.WINDOW_ID = (await browser.windows.create(windowInfo)).id;

    // Linux Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1408446
    // Extension pages are not well displayed on opening
    // Resizing, right-click... does show the content
    await browser.windows.update(Selector.WINDOW_ID, {
      height: height-1
    });
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

export default Selector