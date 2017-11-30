var ContextMenu = ContextMenu || {};


ContextMenu.MoveTabMenu_ID = "stg-move-tab-group-";
ContextMenu.SpecialActionMenu_ID = "stg-special-actions-";
ContextMenu.MoveTabMenuIds = [];
ContextMenu.SpecialActionMenuIds = [];

ContextMenu.createMoveTabMenu = async function() {

  for (let id of ContextMenu.MoveTabMenuIds) {
    await browser.contextMenus.remove(id);
  }
  ContextMenu.MoveTabMenuIds = [];

  let contexts = ["page", "tab"];

  let parentId = ContextMenu.MoveTabMenu_ID + "title";
  ContextMenu.MoveTabMenuIds.push(parentId);
  browser.contextMenus.create({
    id: parentId,
    title: browser.i18n.getMessage("move_tab_group"),
    contexts: contexts,
    icons: {
      "64": "icons/tabspace-active-64.png",
      "32": "icons/tabspace-active-32.png"
    },
  });

  ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "separator-1");
  browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "separator-1",
    type: "separator",
    contexts: contexts,
    parentId: parentId
  });

  let groups = GroupManager.getCopy();
  for (let i = 0; i < groups.length; i++) {
    ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + groups[i].id);
    browser.contextMenus.create({
      id: ContextMenu.MoveTabMenu_ID + groups[i].id,
      title: Utils.getGroupTitle(groups[i]),
      contexts: contexts,
      parentId: parentId
    });
  }

  ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "separator-2");
  browser.contextMenus.create({
    id: ContextMenu.MoveTabMenu_ID + "separator-2",
    type: "separator",
    contexts: contexts,
    parentId: parentId
  });

  ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "new");
  browser.contextMenus.create({
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
    console.log(order);
    console.log(tab);

  }
};

ContextMenu.SpecialActionMenuListener = function(info, tab) {
  if (info.menuItemId.includes(ContextMenu.SpecialActionMenu_ID)) {
    let order = info.menuItemId.substring(ContextMenu.MoveTabMenu_ID.length, info.menuItemId.length);
    console.log(order);
    console.log(tab);
  }
};

browser.contextMenus.onClicked.addListener(ContextMenu.MoveTabMenuListener);
browser.contextMenus.onClicked.addListener(ContextMenu.SpecialActionMenuListener);
GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    ContextMenu.createMoveTabMenu();
  });

ContextMenu.createSpecialActionMenu();
