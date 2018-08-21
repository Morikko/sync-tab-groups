const ActionCreators = {
  setGroups: function(groups) {
    return {
      type: "GROUPS_RECEIVE",
      groups: groups
    };
  },

  setCurrentWindowId: function(currentWindowId) {
    return {
      type: "CURRENT_WINDOWS_ID_RECEIVE",
      currentWindowId: currentWindowId
    };
  },

  setDelayedTask: function(delayedTasks) {
    return {
      type: "DELAYED_TASKS_RECEIVE",
      delayedTasks: delayedTasks
    };
  },

  setOptions: function(options) {
    return {
      type: "OPTIONS_RECEIVE",
      options: options
    };
  }
};
