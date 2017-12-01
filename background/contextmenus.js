var ContextMenu = ContextMenu || {};


ContextMenu.MoveTabMenu_ID = "stg-move-tab-group-";
ContextMenu.SpecialActionMenu_ID = "stg-special-actions-";
ContextMenu.MoveTabMenuIds = [];
ContextMenu.SpecialActionMenuIds = [];

ContextMenu.repeatedtask = new TaskManager.RepeatedTask(800);

ContextMenu.createMoveTabMenu = async function() {

  for (let id of ContextMenu.MoveTabMenuIds) {
    await browser.contextMenus.remove(id);
  }
  ContextMenu.MoveTabMenuIds = [];

  let contexts = ["page", "tab"];

  let parentId = ContextMenu.MoveTabMenu_ID + "title";
  ContextMenu.MoveTabMenuIds.push(parentId);
  await browser.contextMenus.create({
    id: parentId,
    title: browser.i18n.getMessage("move_tab_group"),
    contexts: contexts,
    icons: {
      "64": "icons/tabspace-active-64.png",
      "32": "icons/tabspace-active-32.png"
    },
  });

  ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "separator-1");
  await browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "separator-1",
    type: "separator",
    contexts: contexts,
    parentId: parentId
  });

  let currentWindow = await browser.windows.getLastFocused({
    windowTypes: ['normal']
  });
  let groups = GroupManager.getCopy();
  for (let i = 0; i < groups.length; i++) {
    ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + groups[i].id);
    await browser.contextMenus.create({
      id: ContextMenu.MoveTabMenu_ID + groups[i].id,
      title: Utils.getGroupTitle(groups[i]),
      contexts: contexts,
      parentId: parentId,
      enabled: currentWindow.id !== groups[i].windowId
    });
  }

  ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "separator-2");
  await browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "separator-2",
    type: "separator",
    contexts: contexts,
    parentId: parentId
  });

  ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "new");
  await browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "new",
    title: browser.i18n.getMessage("add_group"),
    contexts: contexts,
    parentId: parentId
  });
};

ContextMenu.createSpecialActionMenu = function() {
  browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "export_groups",
    title: browser.i18n.getMessage("export_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "icons/tabspace-active-64.png",
      "32": "icons/tabspace-active-32.png"
    },
  });

  browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "import_groups",
    title: browser.i18n.getMessage("import_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "icons/tabspace-active-64.png",
      "32": "icons/tabspace-active-32.png"
    },
  });

  browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "save_bookmarks_groups",
    title: browser.i18n.getMessage("save_bookmarks_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "icons/tabspace-active-64.png",
      "32": "icons/tabspace-active-32.png"
    },
  });
}

ContextMenu.MoveTabMenuListener = function(info, tab) {
  if (info.menuItemId.includes(ContextMenu.MoveTabMenu_ID)) {
    let order = info.menuItemId.substring(ContextMenu.MoveTabMenu_ID.length, info.menuItemId.length);
    let groupId = parseInt(order);

    try { // From synchronized window
      if (groupId > 0) {
        TabManager.moveTabToGroup(
          tab.id,
          groupId
        );
      } else if (order === "new") {
        TabManager.moveUnSyncTabToNewGroup(tab.id);
      }
    } catch (e) { // From unsynchronized window

    }
  }
};

ContextMenu.SpecialActionMenuListener = function(info, tab) {
  if (info.menuItemId.includes(ContextMenu.SpecialActionMenu_ID)) {
    let order = info.menuItemId.substring(ContextMenu.MoveTabMenu_ID.length, info.menuItemId.length);
    console.log(order);
    console.log(tab);
    // TODO
  }
};

browser.contextMenus.onClicked.addListener(ContextMenu.MoveTabMenuListener);
browser.contextMenus.onClicked.addListener(ContextMenu.SpecialActionMenuListener);
GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    ContextMenu.repeatedtask.add(
      () => {
        ContextMenu.createMoveTabMenu();
      }
    )
  });

ContextMenu.createSpecialActionMenu();
