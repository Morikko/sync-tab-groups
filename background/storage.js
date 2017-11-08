const {Cc, Ci} = require("chrome");
const TabsUtils = require("sdk/tabs/utils");

function SessionStorage() {
  this._store = Cc["@mozilla.org/browser/sessionstore;1"]
    .getService(Ci.nsISessionStore);
}

/**
 * Note: This is an implementation of the existing Panorama storage using
 * SessionStore so we are able to reuse the existing groups.
 *
 * This will eventually get replaced by the SDKs simple-storage or something
 * similar.
 */
SessionStorage.prototype = {
  /**
   * Returns an array of available groups.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Array}
   */
  getGroups: function(chromeWindow) {
    let groupsData = this._getGroupsData(chromeWindow);
    let currentGroup = this._getCurrentGroupData(chromeWindow);

    if (Object.keys(groupsData).length == 0) {
      this.addGroup(chromeWindow);
      groupsData = this._getGroupsData(chromeWindow);
    }

    let groups = [];
    for (let groupIndex in groupsData) {
      let group = groupsData[groupIndex];

      groups.push({
        active: group.id == currentGroup.activeGroupId,
        id: group.id,
        title: group.title,
        selectedIndex: group.selectedIndex
      });
    }

    return groups;
  },

  /**
   * Returns all tabs.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Array}
   */
  getTabs: function(chromeWindow) {
    let browser = TabsUtils.getTabBrowser(chromeWindow);
    let tabs = [];
    let currentGroup = this.getCurrentGroup(chromeWindow);

    for (let tabIndex = 0; tabIndex < browser.tabs.length; tabIndex++) {
      let tab = browser.tabs[tabIndex];
      let tabData = this._getTabData(tab);
      let tabState = this._getTabState(tab);

      if (tabState.pinned) {
        continue;
      }

      let group = currentGroup;
      if (tabData && tabData.groupID) {
        group = tabData.groupID;
      } else {
        this.setTabGroup(tab, group);
      }

      tabs.push({
        active: tab.selected,
        group: group,
        icon: browser.getIcon(tab),
        index: tabIndex,
        title: tab.label
      });
    }

    return tabs;
  },

  /**
   * Returns all tab indexes in the specified group.
   *
   * @param {TabBrowser} tabBrowser
   * @param {Number} groupID
   * @returns {Array}
   */
  getTabIndexesByGroup: function(tabBrowser, targetGroupId) {
    let tabs = [];

    for (let tabIndex = 0; tabIndex < tabBrowser.tabs.length; tabIndex++) {
      let tab = tabBrowser.tabs[tabIndex];
      let tabData = this._getTabData(tab);
      let tabState = this._getTabState(tab);

      let group = 0;
      if (tabData && tabData.groupID) {
        group = tabData.groupID;
      }

      if (tabState.pinned || group != targetGroupId) {
        continue;
      }

      tabs.push(tabIndex);
    }

    return tabs;
  },

  /**
   * Returns the ID of the current group.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Number}
   */
  getCurrentGroup: function(chromeWindow) {
    let groupData = this._getCurrentGroupData(chromeWindow);
    return groupData.activeGroupId || 0;
  },

  /**
   * Returns the ID of the current group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} groupID
   */
  setCurrentGroup: function(chromeWindow, groupID) {
    let groupData = this._getCurrentGroupData(chromeWindow);
    groupData.activeGroupId = groupID;
    this._setCurrentGroupData(chromeWindow, groupData);
  },

  /**
   * Assigns a tab to a group.
   *
   * @param {XULElement} tab
   * @param {Number} groupID
   */
  setTabGroup: function(tab, groupID) {
    this._setTabData(
      tab,
      Object.assign({}, this._getTabData(tab), {groupID})
    );
  },

  /**
   * Returns the next possible GroupID.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Number}
   */
  getNextGroupID: function(chromeWindow) {
    let groupData = this._getCurrentGroupData(chromeWindow);
    let id = groupData.nextID;
    groupData.nextID++;
    this._setCurrentGroupData(chromeWindow, groupData);
    return id;
  },

  /**
   * Creates a new tab group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {String} title - defaults to an empty string
   */
  addGroup: function(chromeWindow, title = "") {
    let groups = this._getGroupsData(chromeWindow);
    let groupID = this.getNextGroupID(chromeWindow);
    groups[groupID] = {
      id: groupID,
      title: title,
      selectedIndex: 0
    };

    let currentGroups = this._getCurrentGroupData(chromeWindow);
    currentGroups.totalNumber++;

    this._setGroupsData(chromeWindow, groups);
    this._setCurrentGroupData(chromeWindow, currentGroups);
  },

  /**
   * Removes tabs from a specified group.
   *
   * @param {TabBrowser} tabBrowser
   * @param {Number} groupID
   */
  removeGroupTabs: function(tabBrowser, groupID) {
    let tabsToRemove = [];
    for (let tabIndex = 0; tabIndex < tabBrowser.tabs.length; tabIndex++) {
      let tab = tabBrowser.tabs[tabIndex];
      let tabData = this._getTabData(tab);

      if (tabData && tabData.groupID && tabData.groupID == groupID) {
        tabsToRemove.push(tab);
      }
    }

    tabsToRemove.forEach((tab) => {
      tabBrowser.removeTab(tab);
    });
  },

  /**
   * Removes a tab group from the storage.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} groupID
   */
  removeGroup: function(chromeWindow, groupID) {
    let groups = this._getGroupsData(chromeWindow);
    delete groups[groupID];

    let currentGroups = this._getCurrentGroupData(chromeWindow);
    currentGroups.totalNumber -= 1;

    this._setGroupsData(chromeWindow, groups);
    this._setCurrentGroupData(chromeWindow, currentGroups);
  },

  /**
   * Renames a group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} groupID - the groupID
   * @param {String} title - the new title
   */
  renameGroup: function(chromeWindow, groupID, title) {
    let groupsData = this._getGroupsData(chromeWindow);
    groupsData[groupID].title = title;
    this._setGroupsData(chromeWindow, groupsData);
  },

  /**
   * Get the selected tab index for a group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} groupID - the groupID
   */
  getGroupSelectedIndex: function(chromeWindow, groupID) {
    let groupsData = this._getGroupsData(chromeWindow);
    let currentGroup = groupsData[groupID];
    return currentGroup == null ? 0 : currentGroup.selectedIndex;
  },

  /**
   * Set the selected tab index for a group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} groupID - the groupID
   * @param {Number} index - the new selected index
   */
  setGroupSelectedIndex: function(chromeWindow, groupID, index) {
    let groupsData = this._getGroupsData(chromeWindow);
    let currentGroup = groupsData[groupID];
    if (currentGroup != null) {
      currentGroup.selectedIndex = index;
      this._setGroupsData(chromeWindow, groupsData);
    }
  },

  /**
   * Returns the data for a tab.
   *
   * @param {XULElement} tab
   * @returns {Object}
   */
  _getTabData: function(tab) {
    return this._parseOptionalJson(
      this._store.getTabValue(tab, "tabview-tab")
    );
  },

  /**
   * Stores the data for a tab.
   *
   * @param {XULElement} tab
   * @param {Object} data
   * @returns {Object}
   */
  _setTabData: function(tab, data) {
    this._stopTabView(tab.ownerDocument.defaultView);
    this._store.setTabValue(
      tab,
      "tabview-tab",
      JSON.stringify(data)
    );
  },

  /**
   * Returns the data for the current tab state.
   *
   * @param {XULElement} tab
   * @returns {Object}
   */
  _getTabState: function(tab) {
    return this._parseOptionalJson(
      this._store.getTabState(tab)
    );
  },

  /**
   * Returns all tab groups with additional information.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  _getGroupsData: function(chromeWindow) {
    return this._parseOptionalJson(
      this._store.getWindowValue(chromeWindow, "tabview-group")
    );
  },

  /**
   * Set group information for the given window.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Object} data
   * @returns {Object}
   */
  _setGroupsData: function(chromeWindow, data) {
    this._stopTabView(chromeWindow);
    this._store.setWindowValue(
      chromeWindow,
      "tabview-group",
      JSON.stringify(data)
    );
  },

  /**
   * Returns the current group as well as the next group ID and the total
   * number of groups.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  _getCurrentGroupData: function(chromeWindow) {
    let data = this._parseOptionalJson(
      this._store.getWindowValue(chromeWindow, "tabview-groups")
    );

    if (Object.keys(data).length == 0) {
      data = {
        activeGroupId: 1,
        nextID: 1,
        totalNumber: 0
      };
    }

    return data;
  },

  /**
   * Stores information about the current session.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Object} data
   * @returns {Object}
   */
  _setCurrentGroupData: function(chromeWindow, data) {
    this._stopTabView(chromeWindow);
    this._store.setWindowValue(
      chromeWindow,
      "tabview-groups",
      JSON.stringify(data)
    );
  },

  /**
   * Deinitializes the TabView frame from the Tab Groups add-on, so that it
   * reconstructs any changed data by us properly when it is accessed again.
   * The _deinitFrame method only exists with that add-on enabled, and it
   * will no-op if the frame isn't already initialized.
   *
   * @param {ChromeWindow} chromeWindow
   */
  _stopTabView: function(chromeWindow) {
    if (chromeWindow.TabView && chromeWindow.TabView._deinitFrame) {
      chromeWindow.TabView._deinitFrame();
    }
  },

  /**
   * Safely parses a JSON string.
   *
   * @param {String} jsonString - JSON encoded data
   * @returns {Object} decoded JSON data or an empty object if something failed
   */
  _parseOptionalJson: function(jsonString) {
    if (jsonString) {
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        return {};
      }
    }
    return {};
  }
};

exports.SessionStorage = SessionStorage;
