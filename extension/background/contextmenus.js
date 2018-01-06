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

  let contexts = ["tab"];

  let parentId = ContextMenu.MoveTabMenu_ID + "title";
  ContextMenu.MoveTabMenuIds.push(parentId);
  await browser.contextMenus.create({
    id: parentId,
    title: browser.i18n.getMessage("move_tab_group"),
    contexts: contexts,
    icons: {
      "64": "/share/icons/tabspace-active-64.png",
      "32": "/share/icons/tabspace-active-32.png"
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
  let sortedIndex = GroupManager.getIndexSortByPosition(groups);
  for (let i of sortedIndex) {
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
    id: ContextMenu.SpecialActionMenu_ID + "manage_groups",
    title: browser.i18n.getMessage("manage_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/list-64.png",
      "32": "/share/icons/list-32.png"
    },
  });
  browser.contextMenus.create({
    id: ContextMenu.SpecialActionMenu_ID + "export_groups",
    title: browser.i18n.getMessage("export_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/upload-64.png",
      "32": "/share/icons/upload-32.png"
    },
  });
  /* TODO: not working can't ask file, wait select group in popup window with filter
  browser.contextMenus.create({
    id: ContextMenu.SpecialActionMenu_ID + "import_groups",
    title: browser.i18n.getMessage("import_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/download-64.png",
      "32": "/share/icons/download-32.png"
    },
  });
  */
  /*  TODO: end of bookmark auto-save
  browser.contextMenus.create({
    id: ContextMenu.SpecialActionMenu_ID + "save_bookmarks_groups",
    title: browser.i18n.getMessage("save_bookmarks_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/star-64.png",
      "32": "/share/icons/star-32.png"
    },
  });
  */
  browser.contextMenus.create({
    id: ContextMenu.SpecialActionMenu_ID + "open_preferences",
    title: browser.i18n.getMessage("open_preferences"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/gear-64.png",
      "32": "/share/icons/gear-32.png"
    },
  });

  browser.contextMenus.create({
    id: ContextMenu.SpecialActionMenu_ID + "open_shortcut_list",
    title: browser.i18n.getMessage("open_shortcut_list"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/keyboard-64.png",
      "32": "/share/icons/keyboard-32.png"
    },
  });
}

ContextMenu.MoveTabMenuListener = function(info, tab) {
  if (info.menuItemId.includes(ContextMenu.MoveTabMenu_ID)) {
    let order = info.menuItemId.substring(ContextMenu.MoveTabMenu_ID.length, info.menuItemId.length);
    let groupId = parseInt(order);
    if (groupId >= 0) {
      TabManager.moveUnFollowedTabToGroup(
        tab.id,
        groupId
      );
    } else if (order === "new") {
      TabManager.moveUnFollowedTabToNewGroup(tab.id);
    }
  }
};

ContextMenu.SpecialActionMenuListener = function(info, tab) {
  if (info.menuItemId.includes(ContextMenu.SpecialActionMenu_ID)) {
    let order = info.menuItemId.substring(ContextMenu.SpecialActionMenu_ID.length, info.menuItemId.length);
    switch (order) {
      case "export_groups":
        Controller.onExportGroups();
        break;
      case "import_groups":
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.acceptCharset = 'utf-8';
        fileInput.onchange = () => {
          StorageManager.File.readJsonFile(fileInput.files[0]).then((jsonContent) => {
            Controller.onImportGroups({
              content_file: jsonContent
            });
          });
        };
        fileInput.click();
        break;
      case "save_bookmarks_groups":
        Controller.onBookmarkSave();
        break;
      case "open_preferences":
        browser.runtime.openOptionsPage();
        break;
      case "open_shortcut_list":
        browser.tabs.create({
          url: "/tabpages/shortcut-help/shortcut-help.html",
          active: true,
        });
        break;
      case "manage_groups":
        browser.tabs.create({
          url: "/tabpages/manage-groups/manage-groups.html",
          active: true,
        });
        break;
    }
  }
};
browser.contextMenus.onClicked.addListener(ContextMenu.SpecialActionMenuListener);
browser.contextMenus.onClicked.addListener(ContextMenu.MoveTabMenuListener);
GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    ContextMenu.repeatedtask.add(
      () => {
        ContextMenu.createMoveTabMenu();
      }
    )
  });

ContextMenu.createSpecialActionMenu();
