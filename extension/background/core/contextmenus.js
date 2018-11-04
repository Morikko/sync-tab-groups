import Utils from '../utils/utils'
import LogManager from '../error/logmanager'
import GroupManager from '../core/groupmanager'
import TabManager from '../core/tabmanager/tabManager'
import BackgroundHelper from '../core/backgroundHelper'
import TaskManager from '../utils/taskManager'

import readJsonFile from '../utils/readJsonFile'
import getGroupIndexSortedByPosition from './getGroupIndexSortedByPosition'
import ExtensionStorageManager from '../storage/storageManager'

const ContextMenu = {};

ContextMenu.MoveTabMenu_ID = "stg-move-tab-group-";
ContextMenu.SpecialActionMenu_ID = "stg-special-actions-";
ContextMenu.MoveTabMenuIds = [];
ContextMenu.SpecialActionMenuIds = [];

ContextMenu.repeatedtask = new TaskManager.RepeatedTask(1000);

ContextMenu.occupied = false;
ContextMenu.again = false;

ContextMenu.createMoveTabMenu = async function() {
  try {
    // Security for avoiding concurrency
    if (ContextMenu.occupied) {
      ContextMenu.again = true;
      return;
    }
    ContextMenu.occupied = true;

    for (let id of ContextMenu.MoveTabMenuIds) {
      try {
        await browser.contextMenus.remove(id);
      } catch (e) {return}
    }
    await Utils.wait(100)
    ContextMenu.MoveTabMenuIds.length = 0;

    const contexts = ["page"];
    if (!Utils.isChrome()) { // Incompatible Chrome: "tab" in context menus
      contexts.push("tab");
    }

    let parentId = ContextMenu.MoveTabMenu_ID + "title";
    ContextMenu.MoveTabMenuIds.push(parentId);

    const contextManageGroups = {
      id: parentId,
      title: browser.i18n.getMessage("move_tab_group"),
      contexts: contexts,
    };
    if (!Utils.isChrome()) {
      contextManageGroups.icons = {
        "64": "/share/icons/tabspace-active-64.png",
        "32": "/share/icons/tabspace-active-32.png",
      };
    }
    await browser.contextMenus.create(contextManageGroups);


    let currentWindowId;
    try {
      currentWindowId = (await browser.windows.getLastFocused()).id;
    } catch (e) {
      LogManager.warning(e.message);
    }


    let groups = GroupManager.getCopy();
    let sortedIndex = getGroupIndexSortedByPosition(groups);
    for (let i of sortedIndex) {
      ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + groups[i].id);
      const openPrefix = groups[i].windowId !== browser.windows.WINDOW_ID_NONE ? "[OPEN]" : "";
      await browser.contextMenus.create({
        id: ContextMenu.MoveTabMenu_ID + groups[i].id,
        title: openPrefix + " " + Utils.getGroupTitle(groups[i]),
        contexts: contexts,
        parentId: parentId,
        enabled: currentWindowId !== groups[i].windowId,
      });
    }

    ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "separator-2");
    await browser.contextMenus.create({
      id: ContextMenu.MoveTabMenu_ID + "separator-2",
      type: "separator",
      contexts: contexts,
      parentId: parentId,
    });

    ContextMenu.MoveTabMenuIds.push(ContextMenu.MoveTabMenu_ID + "new");
    await browser.contextMenus.create({
      id: ContextMenu.MoveTabMenu_ID + "new",
      title: browser.i18n.getMessage("add_group"),
      contexts: contexts,
      parentId: parentId,
    });

    if (ContextMenu.again) {
      setTimeout(
        ContextMenu.repeatedtask.add(
          () => {
            ContextMenu.createMoveTabMenu();
          }
        ), 0);
      ContextMenu.again = false;
    }
  } catch (e) {
    LogManager.error(e);
  } finally {
    ContextMenu.occupied = false;
  }
};

ContextMenu.updateMoveFocus = async function(disabledId) {
  try {
    if (ContextMenu.occupied) {
      //ContextMenu.again = true;
      return;
    }
    ContextMenu.occupied = true;

    await Promise.all(ContextMenu.MoveTabMenuIds.map((id) => {
      let order = id.substring(ContextMenu.MoveTabMenu_ID.length);
      let groupId = parseInt(order);
      if (groupId >= 0) {
        let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId, {
          error: false,
        });
        if (groupIndex >= 0) {
          return browser.contextMenus.update(
            id, {
              enabled: disabledId !== GroupManager.groups[groupIndex].windowId,
            });
        }
      }
      return Promise.resolve();
    }));
    ContextMenu.occupied = false;
    return;
  } catch (e) {
    LogManager.error(e, null, {showNotification: false});
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
  if (Utils.isFirefox()) {
    contextManageGroups.icons = {
      "64": "/share/icons/list-64.png",
      "32": "/share/icons/list-32.png",
    };
  }
  browser.contextMenus.create(contextManageGroups);

  let contextExportGroups = {
    id: ContextMenu.SpecialActionMenu_ID + "export_groups",
    title: browser.i18n.getMessage("export_groups"),
    contexts: ['browser_action'],
  };
  if (Utils.isFirefox()) {
    contextExportGroups.icons = {
      "64": "/share/icons/upload-64.png",
      "32": "/share/icons/upload-32.png",
    };
  }
  browser.contextMenus.create(contextExportGroups);

  let contextBackUp = {
    id: ContextMenu.SpecialActionMenu_ID + "backup",
    title: browser.i18n.getMessage("contextmenu_backup"),
    contexts: ['browser_action'],
  };
  if (Utils.isFirefox()) {
    contextBackUp.icons = {
      "64": "/share/icons/hdd-o-64.png",
      "32": "/share/icons/hdd-o-32.png",
    };
  }
  browser.contextMenus.create(contextBackUp);
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

  let contextOpenPreferences = {
    id: ContextMenu.SpecialActionMenu_ID + "open_preferences",
    title: browser.i18n.getMessage("contextmenu_preferences"),
    contexts: ['browser_action'],
  };
  if (Utils.isFirefox()) {
    contextOpenPreferences.icons = {
      "64": "/share/icons/gear-64.png",
      "32": "/share/icons/gear-32.png",
    };
  }
  browser.contextMenus.create(contextOpenPreferences);

  /* TODO: Add Guide
  let contextGuide = {
    id: ContextMenu.SpecialActionMenu_ID + "guide",
    title: browser.i18n.getMessage("options_guide"),
    contexts: ['browser_action'],
  };
  if (Utils.isFirefox()) { // Incompatible Chrome: "tab" in context menus
    contextGuide.icons = {
      "64": "/share/icons/info-64.png",
      "32": "/share/icons/info-32.png"
    };
  }
  browser.contextMenus.create(contextGuide);
  */
  if (Utils.DEBUG_MODE) {
    let contextTestPreferences = {
      id: ContextMenu.SpecialActionMenu_ID + "open_tests",
      title: "Tests",
      contexts: ['browser_action'],
    };
    browser.contextMenus.create(contextTestPreferences);
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

function onImportGroup() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.acceptCharset = 'utf-8';
  fileInput.onchange = () => {
    readJsonFile(fileInput.files[0]).then((jsonContent) => {
      BackgroundHelper.onImportGroups({
        content_file: jsonContent,
      });
    });
  };
  fileInput.click();
}

ContextMenu.SpecialActionMenuListener = function(info, tab) {
  if (info.menuItemId.includes(ContextMenu.SpecialActionMenu_ID)) {
    let order = info.menuItemId.substring(ContextMenu.SpecialActionMenu_ID.length, info.menuItemId.length);
    switch (order) {
    case "export_groups":
      BackgroundHelper.onExportGroups();
      break;
    case "import_groups":
      onImportGroup();
      break;
    case "save_bookmarks_groups":
      BackgroundHelper.onBookmarkSave();
      break;
    case "open_preferences":
      BackgroundHelper.onOpenSettings();
      break;
    case "manage_groups":
      Utils.openUrlOncePerWindow(browser.extension.getURL(
        "/tabpages/manage-groups/manage-groups.html"
      ));
      break;
    case "backup":
      ExtensionStorageManager.Backup.backup("manual");
      break;
    case "guide":
      BackgroundHelper.onOpenGuide();
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

ContextMenu.initContextMenus = function() {
  browser.contextMenus.onClicked.addListener(ContextMenu.SpecialActionMenuListener);
  browser.contextMenus.onClicked.addListener(ContextMenu.MoveTabMenuListener);
  ContextMenu.createMoveTabMenu();
  ContextMenu.createSpecialActionMenu();

  GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
    () => {
      ContextMenu.repeatedtask.add(
        () => {
          ContextMenu.createMoveTabMenu();
        }
      )
    });
}

export default ContextMenu