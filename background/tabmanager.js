var Group = function(id, title="", tabs=[] ) {
    this.title = title;
    this.tabs = tabs;
    this.id = id;
}

var groups = [];
var currentGroupIndex;


function TabManager(storage) {
  //this._storage = storage;
}

TabManager.prototype = {
  /**
   * Returns all groups with their tabs.
   *
   * @param {boolean} sort
   * @returns {Object}
   */
  getGroups: function(sort) {

    let retGroups = groups.map((group, index) => {
      return Object.assign({}, group, {
        tabs:tabs
      });
    });

    if (sort) {
      retGroups.sort((a, b) => {
        if (a.title.toLowerCase() == b.title.toLowerCase()) {
          return 0;
        }

        return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
      });
    }

    return retGroups;
  },

  /**
   * TODO
   */
  createTab: function( tab ) {

  },

  /**
   * Close all the current tabs and open the tabs from the selected group
   * The active tab will be the last one active
   * @param {Number} groupId - the group index
   */
  changeGroupTo: function( groupId ) {
    // Change group
    // Get current tabs
    var tabsIds = [];
    browser.tabs.query({
        currentWindow: true
      }).then((tabs) => {
        tabs.map( (tab) => {
          tabsIds.push(tab.id);
        });
      });

    // Add new group tabs
    groups[groupId].tabs.map( (tab, index) => {
      browser.tabs.create({
          url:tab.url,
          active: tab.active,
          pinned: tab.pinned,
          index: index
       });
    });

    // Remove old group tabs
    browser.tabs.remove(tabsIds);

    currentGroup = groupID;
  },

  /**
   * Go to the tab specified with tabId
   * The tab needs to be in the window
   * @param {Number} tabId - the tab index
   */
  activeTabInWindow: function( tabId ) {
    browser.tabs.query({
        currentWindow: true
      }).then((tabs) => {
        for (var tab of tabs) {
          if (tab.id === tabId) {
            browser.tabs.update(tabId, {
                active: true
            });
          }
        }
      });
  },

  /**
   * Selects a given tab.
   * Switch to another group if necessary
   * @param {Number} index - the tabs index
   * @param {Number} groupID - the tabs groupID
   */
  selectTab: function(tabId, groupID) {
    let currentGroup = groups[currentGroupIndex];

    if (currentGroup !== groupID) {
      changeGroupTo( groupID );
    }
    activeTabInWindow( tabId );
  },

  /**
   * Move tab beetwen groups
   *
   * @param {Number} tabIndex - the tabs index
   * @param {Number} targetGroupID - target groupID (where to move tab)
   */
  moveTabToGroup: function(tabIndex, targetGroupID) {
    if ( currentGroup === targetGroupID) {
      return;
    }

    let tab = groups[currentGroup].tabs[tabIndex];
    // Update groups
    groups[targetGroupID].tabs.push(tab);
    groups[currentGroup].tabs.splice(tabIndex, 1);

    if (tab.active) {
      changeGroupTo( groupID );
      activeTabInWindow( tabIndex );
    }
  },

  /**
   * Selects a given group.
   * @param {Number} groupID - the groupID
   * @param {Number} tabIndex - the tab to activate
   */
  selectGroup: function(chromeWindow, tabBrowser, groupID) {
    if (currentGroup === groupID) {
      return;
    }
    changeGroupTo( groupID );
  },

  /**
   * Selects the next or previous group in the list
   * direction>0, go to the next groups OR direction<0, go to the previous groups
   * @param {Number} direction
   */
  selectNextPrevGroup: function(direction) {
    if (groups.length == 0) {
      return;
    }

    targetGroupID = (currentGroup + direction + groups.length) % groups.length;

    changeGroupTo( targetGroupID )
  },

  /**
   * Renames a given group.
   *
   * @param {Number} groupID - the groupID
   * @param {String} title - the new title
   */
  renameGroup: function(groupID, title) {
    groups[groupID].title = title;
  },

  /**
   * Adds a blank group
   * TODO: title, blanck tab ??
   */
  addGroup: function(title = "") {
    groups.push( new Group(groups.length) );

  },

  /**
   * Adds a group with associated tab
   *
   * @param {Array[Tab]} tabs - the tabs to place into the new group
   * @param {String} title - the name to give to that group
   */
  addGroupWithTab: function(tabs, title="") {
    groups.push( new Group(groups.length, title, tabs) );
  },

  /**
   * Closes a group and all attached tabs
   *
   * @param {Number} groupID - the groupID
   */
  removeGroup: function(groupID) {
    // Switch group
    if (currentGroup == groupID) {
      this.selectNextPrevGroup( 1 );
    }
    groups.splice( groupID, 1 );
  }
};
