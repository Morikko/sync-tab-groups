import Utils from '../utils/utils'

const OPTION_CONSTANTS = {};

OPTION_CONSTANTS.SORT_OLD_RECENT = 0;
OPTION_CONSTANTS.SORT_RECENT_OLD = 1;
OPTION_CONSTANTS.SORT_ALPHABETICAL = 2;
OPTION_CONSTANTS.SORT_LAST_ACCESSED = 3;
OPTION_CONSTANTS.SORT_CUSTOM = 4;
OPTION_CONSTANTS.CLOSE_NORMAL = 0;
OPTION_CONSTANTS.CLOSE_ALIVE = 1;
OPTION_CONSTANTS.CLOSE_HIDDEN = 2;
OPTION_CONSTANTS.TIMERS = function() {
  return {
    t_5mins: 5*60*1000,
    t_1h: 60*60*1000,
    t_4h: 4*60*60*1000,
    t_1d: 24*60*60*1000,
    t_1w: 7*24*60*60*1000,
  }
}

OPTION_CONSTANTS.TEMPLATE = function() {
  return {
    version: 0.1,
    privateWindow: {
      sync: false,
      removeOnClose: true,
    },
    pinnedTab: {
      sync: false,
    },
    bookmarks: {
      sync: false,
      folder: "Default",
    },
    groups: {
      syncNewWindow: true,
      removeEmptyGroup: false,
      showGroupTitleInWindow: false,
      sortingType: OPTION_CONSTANTS.SORT_LAST_ACCESSED,
      discardedOpen: true,
      closingState: OPTION_CONSTANTS.CLOSE_NORMAL,
      discardedHide: false,
      removeUnknownHiddenTabs: false,
    },
    popup: {
      maximized: false,
      whiteTheme: false,
      showTabsNumber: true,
      showSearchBar: true,
    },
    shortcuts: {
      allowGlobal: false,
      navigation: true,
    },
    backup: {
      download: {
        enable: false,
        time: Utils.setObjectPropertiesWith(OPTION_CONSTANTS.TIMERS(), true),
      },
      local: {
        enable: true,
        intervalTime: 1,
        maxSave: 48,
      },
    },
    log: {
      enable: true,
    },
  };
};

export default OPTION_CONSTANTS