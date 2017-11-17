const ActionCreators = {
  setTabgroups: function(tabgroups) {
    return {
      type: "TABGROUPS_RECEIVE",
      tabgroups: tabgroups
    };
  },

  setCurrentWindowId: function(currentWindowId) {
    return {
      type: "CURRENT_WINDOWS_ID_RECEIVE",
      currentWindowId: currentWindowId
    };
  },

  setDelayedTasks: function(delayedTasks) {
    return {
      type: "DELAYED_TASKS_RECEIVE",
      delayedTasks: delayedTasks
    };
  }
};
