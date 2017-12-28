/**
 * Everything related to save file on the disk (Not through firefox API)
 */
var StorageManager = StorageManager || {};
StorageManager.File = StorageManager.File || {};

StorageManager.File.exportGroups = function(groups) {
  // Clean tabs
  for (let g of groups) {
    for (let it = 0; it < g.tabs.length; it++) {
      // Filter values to export
      let tab = {
        id: g.tabs[it].id || -1,
        title: g.tabs[it].title || "New Tab",
        url: g.tabs[it].url || "about:newtab",
        pinned: g.tabs[it].pinned || false,
        active: g.tabs[it].active || false,
        discarded: g.tabs[it].discarded || false,
        favIconUrl: g.tabs[it].favIconUrl || "chrome://branding/content/icon32.png",
      };
      if (g.tabs[it].hasOwnProperty("openerTabId")) {
        tab["openerTabId"] = g.tabs[it]["openerTabId"];
      }
      g.tabs[it] = tab;
    }
  }

  let d = new Date();
  let url = URL.createObjectURL(new Blob([
      JSON.stringify({
        version: ["syncTabGroups", 1],
        groups: groups,
      })
    ], {
      type: 'application/json'
    })),
    filename = "syncTabGroups" + "-" + "manual" + "-" + d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ".json";

  browser.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  });
}

StorageManager.File.importGroups = function(content_file) {
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
