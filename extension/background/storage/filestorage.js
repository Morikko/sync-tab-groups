/**
 * Everything related to save file on the disk
 */
var StorageManager = StorageManager || {};
StorageManager.File = StorageManager.File || {};

StorageManager.File.downloadGroups = async function(groups) {
  try {
    let export_groups = GroupManager.getGroupsWithoutPrivate(groups);

    // Clean tabs
    export_groups = export_groups.map((group)=>{
      let export_group = Utils.getCopy(group);
      // Filter values to export
      // TODO really
      /*
      export_group.tabs = export_group.tabs.map((tab)=>{
        let export_tab = {
          id: tab.id || -1,
          title: tab.title || "New Tab",
          url: tab.url || TabManager.NEW_TAB,
          pinned: tab.pinned || false,
          active: tab.active || false,
          discarded: tab.discarded || false,
          favIconUrl: tab.favIconUrl || "",
        };
        if (tab.hasOwnProperty("openerTabId")) {
          export_tab["openerTabId"] = tab["openerTabId"];
        }

        return export_tab;
      });
      */
      return export_group;
    });

    let d = new Date();
    let url = Utils.createGroupsJsonFile(export_groups);
    let filename = "syncTabGroups" + "-" + "manual" + "-" + d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ".json";

    let id = await browser.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });

    await Utils.waitDownload(id);

    URL.revokeObjectURL(url);
    return true;

  } catch (e) {
    console.error("StorageManager.File.downloadGroups: " + e);
    return false;
  }
}

StorageManager.File.importGroupsFromFile = function(content_file) {
  if (!content_file.hasOwnProperty('version')) {
    throw Error("ImportGroups: Content file is not in a supported format.");
  }
  let groups = [];

  if (content_file['version'][0] === "tabGroups" ||
    content_file['version'][0] === "sessionrestore") {
    groups = StorageManager.File.importTabGroups(content_file);
  } else if (content_file['version'][0] === "syncTabGroups") {
    groups = StorageManager.File.importSyncTabGroups(content_file);
  } else {
    throw Error("ImportGroups: Content file is not in a supported format.");
  }

  return groups;
}


StorageManager.File.importSyncTabGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version') ||
    !content_file.hasOwnProperty('groups') ||
    content_file['version'][0] !== "syncTabGroups") {
    throw Error("SyncTabGroups importation: Content file is not readable.")
  }

  let groups = [];

  for (let g of content_file['groups']) {
    groups.push(new GroupManager.Group(-1,
      g.title || "",
      g.tabs || [],
    ));
  }

  // TODO notifications in case of error

  return groups;
}

/**
 *
 * legacy
 */
StorageManager.File.importTabGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version') ||
    (content_file['version'][0] !== "tabGroups" &&
      content_file['version'][0] !== "sessionrestore") || !content_file.hasOwnProperty('windows')) {
    throw Error("TabGroups importation: Content file is not readable.");
  }
  let groups = [];

  let pinnedTabs = [];

  for (let w of content_file['windows']) {
    let cross_ref = {},
      index = 0,
      tmp_groups = [];

    // Create groups
    if (!w.hasOwnProperty('extData') ||
      !w['extData'].hasOwnProperty('tabview-group')) {
      throw Error("TabGroups importation: Content file is not readable..");
    }
    let tabviewgroup = JSON.parse(w['extData']['tabview-group']);
    for (let i in tabviewgroup) {
      let g = tabviewgroup[i];
      if (g !== undefined) {
        tmp_groups.push(new GroupManager.Group(-1,
          g.title || "", [],
        ));
        cross_ref[g.id] = index;
        index++;
      }
    }

    if (!w.hasOwnProperty('tabs')) {
      throw Error("TabGroups importation: Content file is not readable...");
    }

    for (let t of w['tabs']) {
      if (!t.hasOwnProperty('extData') ||
        !t['extData'].hasOwnProperty('tabview-tab') ||
        (JSON.parse(t['extData']['tabview-tab']) &&
          !JSON.parse(t['extData']['tabview-tab']).hasOwnProperty('groupID')) ||
        (!JSON.parse(t['extData']['tabview-tab']) &&
          !t.hasOwnProperty('pinned')) ||
        !t.hasOwnProperty('entries') ||
        !t['entries'][0].hasOwnProperty('title') ||
        !t['entries'][0].hasOwnProperty('url')) {
        continue;
      }

      let tab = {
        title: t['entries'][0]['title'],
        url: t['entries'][0]['url'],
        pinned: false,
        active: false,
      };
      if (t.hasOwnProperty('image')) {
        tab["favIconUrl"] = t['image'];
      }

      if (JSON.parse(t['extData']['tabview-tab'])) { // Normal tab
        let i = cross_ref[JSON.parse(t['extData']['tabview-tab'])['groupID']];
        tmp_groups[i].tabs.push(tab);
      } else { // Pinned tabs
        tab.pinned = true;
        pinnedTabs.push(tab);
      }
    }

    for (let g of tmp_groups) {
      groups.push(g);
    }
  }

  // Add all pinned tabs in one group
  if (pinnedTabs.length > 0) {
    groups.push(new GroupManager.Group(-1,
      "Imported Pinned Tabs", pinnedTabs,
    ));
  }

  return groups;
}
