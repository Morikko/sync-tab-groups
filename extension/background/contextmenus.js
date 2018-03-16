var ContextMenu = ContextMenu || {};


ContextMenu.MoveTabMenu_ID = "stg-move-tab-group-";
ContextMenu.SpecialActionMenu_ID = "stg-special-actions-";
ContextMenu.MoveTabMenuIds = [];
ContextMenu.SpecialActionMenuIds = [];

ContextMenu.repeatedtask = new TaskManager.RepeatedTask(1000);

ContextMenu.occupied = false;
ContextMenu.again = false;

ContextMenu.createMoveTabMenu = async function(force) {
  try {
    if ( !force && GroupManager.groups.length === ContextMenu.MoveTabMenuIds.length-3 ) {
      // No change nothing to do
      return;
    }
    if ( ContextMenu.occupied ) {
        ContextMenu.again = true;
        return;
    }
    ContextMenu.occupied = true;

    if ( Utils.isChrome() ) { // Incompatible Chrome: "tab" in context menus
      return "";
    }
    for (let id of ContextMenu.MoveTabMenuIds) {
      await this._removeMenuItem(id);
    }
    await Utils.wait(500)
    ContextMenu.MoveTabMenuIds = [];

    let contexts = ["tab"];

    let parentId = ContextMenu.MoveTabMenu_ID + "title";
    ContextMenu.MoveTabMenuIds.push(parentId);
    await this._createMenuItem({
      id: parentId,
      title: browser.i18n.getMessage("move_tab_group"),
      contexts: contexts,
      icons: {
        "64": "/share/icons/tabspace-active-64.png",
        "32": "/share/icons/tabspace-active-32.png"
      },
    });


    let currentWindow = await browser.windows.getLastFocused({
      windowTypes: ['normal']
    });

    let groups = GroupManager.getCopy();
    let sortedIndex = GroupManager.getIndexSortByPosition(groups);
    for (let i of sortedIndex) {
      ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + groups[i].id);
      await this._createMenuItem({
        id: ContextMenu.MoveTabMenu_ID + groups[i].id,
        title: Utils.getGroupTitle(groups[i]),
        contexts: contexts,
        parentId: parentId,
        enabled: currentWindow.id !== groups[i].windowId,
      });
    }

    ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "separator-2");
    await this._createMenuItem({
      id: ContextMenu.MoveTabMenu_ID + "separator-2",
      type: "separator",
      contexts: contexts,
      parentId: parentId
    });

    ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "new");
    await this._createMenuItem({
      id: ContextMenu.MoveTabMenu_ID + "new",
      title: browser.i18n.getMessage("add_group"),
      contexts: contexts,
      parentId: parentId
    });

    if ( ContextMenu.again ) {
      setTimeout(
        ContextMenu.repeatedtask.add(
          () => {
            ContextMenu.createMoveTabMenu();
          }
        ), 0);
      ContextMenu.again = false;
    }
  } catch (e) {
    let msg = "ContextMenu.createMoveTabMenu failed " + e;
    console.error(msg);
    return msg;
  } finally {
    ContextMenu.occupied = false;
  }
};

ContextMenu.updateMoveFocus = async function(disabledId) {
  try {
    if ( ContextMenu.occupied ) {
        //ContextMenu.again = true;
        return;
    }
    ContextMenu.occupied = true;

    return Promise.all(ContextMenu.MoveTabMenuIds.map((id) => {
      let order = id.substring(ContextMenu.MoveTabMenu_ID.length);
      let groupId = parseInt(order);
      if (groupId >= 0) {
        let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId, false);
        if ( groupIndex >= 0 ) {
          return this._updateMenuItem(
            id, {
              enabled: disabledId !== GroupManager.groups[groupIndex].windowId
            });
        }
      }
      return Promise.resolve();
    }));
  } catch (e) {
    let msg = "ContextMenu.updateFocus failed " + e;
    console.error(msg);
  } finally {
    ContextMenu.occupied = false;
  }
}

ContextMenu.createSpecialActionMenu = function() {
  let contextManageGroups = {
    id: ContextMenu.SpecialActionMenu_ID + "manage_groups",
    title: browser.i18n.getMessage("group_manager"),
    contexts: ['browser_action'],

  };
  if (!Utils.isChrome()) { // Incompatible Chrome: "tab" in context menus
    contextManageGroups.icons = {
      "64": "/share/icons/list-64.png",
      "32": "/share/icons/list-32.png"
    };
  }
  this._createMenuItem(contextManageGroups);

  let contextExportGroups = {
    id: ContextMenu.SpecialActionMenu_ID + "export_groups",
    title: browser.i18n.getMessage("export_groups"),
    contexts: ['browser_action'],
  };
  if (!Utils.isChrome()) { // Incompatible Chrome: "tab" in context menus
    contextExportGroups.icons = {
      "64": "/share/icons/upload-64.png",
      "32": "/share/icons/upload-32.png"
    };
  }
  this._createMenuItem(contextExportGroups);

  let contextBackUp = {
    id: ContextMenu.SpecialActionMenu_ID + "backup",
    title: browser.i18n.getMessage("contextmenu_backup"),
    contexts: ['browser_action'],
  };
  if (!Utils.isChrome()) { // Incompatible Chrome: "tab" in context menus
    contextBackUp.icons = {
      "64": "/share/icons/hdd-o-64.png",
      "32": "/share/icons/hdd-o-32.png"
    };
  }
  this._createMenuItem(contextBackUp);
  /* TODO: not working can't ask file, wait select group in popup window with filter
  this._createMenuItem({
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
  this._createMenuItem({
    id: ContextMenu.SpecialActionMenu_ID + "save_bookmarks_groups",
    title: browser.i18n.getMessage("save_bookmarks_groups"),
    contexts: ['browser_action'],
    icons: {
      "64": "/share/icons/star-64.png",
      "32": "/share/icons/star-32.png"
    },
  });
  */

  let contextOpenPreferences = {
    id: ContextMenu.SpecialActionMenu_ID + "open_preferences",
    title: browser.i18n.getMessage("contextmenu_preferences"),
    contexts: ['browser_action'],
  };
  if (!Utils.isChrome()) { // Incompatible Chrome: "tab" in context menus
    contextOpenPreferences.icons = {
      "64": "/share/icons/gear-64.png",
      "32": "/share/icons/gear-32.png"
    };
  }
  this._createMenuItem(contextOpenPreferences);

  /* TODO: Add Guide
  let contextGuide = {
    id: ContextMenu.SpecialActionMenu_ID + "guide",
    title: browser.i18n.getMessage("options_guide"),
    contexts: ['browser_action'],
  };
  if (!Utils.isChrome()) { // Incompatible Chrome: "tab" in context menus
    contextGuide.icons = {
      "64": "/share/icons/info-64.png",
      "32": "/share/icons/info-32.png"
    };
  }
  this._createMenuItem(contextGuide);
  */
  if ( Utils.DEBUG_MODE ) {
    let contextTestPreferences = {
      id: ContextMenu.SpecialActionMenu_ID + "open_tests",
      title: "Tests",
      contexts: ['browser_action'],
    };
    this._createMenuItem(contextTestPreferences);
  }
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
        Controller.onOpenSettings();
        break;
      case "manage_groups":
        Utils.openUrlOncePerWindow(browser.extension.getURL(
          "/tabpages/manage-groups/manage-groups.html"
        ));
        break;
      case "backup":
        StorageManager.Backup.backup("manual");
        break;
      case "guide":
        Controller.onOpenGuide();
        break;
      case "open_tests":
        Utils.openUrlOncePerWindow(
          browser.extension.getURL("/tests/test-page/test-page.html"),
          true,
        );
        break;
    }
  }
};


ContextMenu._createMenuItem = async function(params) {
  const result = await browser.contextMenus.create(params);
  try {
    await browser.runtime.sendMessage("treestyletab@piro.sakura.ne.jp", {
      type: "fake-contextMenu-create",
      params
    });
  }
  catch(error) {
  }
  return result;
};

ContextMenu._removeMenuItem = async function(id) {
  const result = await browser.contextMenus.remove(id);
  try {
    await browser.runtime.sendMessage("treestyletab@piro.sakura.ne.jp", {
      type: "fake-contextMenu-remove",
      params: id
    });
  }
  catch(error) {
  }
  return result;
};

ContextMenu._updateMenuItem = async function(id, params) {
  const result = await browser.contextMenus.update(id, params);
  try {
    await browser.runtime.sendMessage("treestyletab@piro.sakura.ne.jp", {
      type: "fake-contextMenu-update",
      params: { id, params }
    });
  }
  catch(error) {
  }
  return result;
};


browser.contextMenus.onClicked.addListener(ContextMenu.SpecialActionMenuListener);
browser.contextMenus.onClicked.addListener(ContextMenu.MoveTabMenuListener);

try {
  const registerToTST = () => {
    browser.runtime.sendMessage("treestyletab@piro.sakura.ne.jp", {
      type: "register-self",
      icons: browser.runtime.getManifest().icons
    });
  };
  registerToTST();
  browser.runtime.onMessageExternal.addListener((message, sender) => {
    if (sender.id != "treestyletab@piro.sakura.ne.jp")
      return;
    switch (message.type) {
      case "fake-contextMenu-click":
        ContextMenu.SpecialActionMenuListener(message.info, message.tab);
        ContextMenu.MoveTabMenuListener(message.info, message.tab);
        break;
      case "ready":
        registerToTST();
        ContextMenu.createMoveTabMenu(true);
        break;
    }
  });
}
catch(error) {
}

GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    ContextMenu.repeatedtask.add(
      () => {
        ContextMenu.createMoveTabMenu();
      }
    )
  });

ContextMenu.createSpecialActionMenu();
