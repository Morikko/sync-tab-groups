const ActionCreators = {
  setTabgroups: function(tabgroups) {
    return {
      type: "TABGROUPS_RECEIVE",
      tabgroups: tabgroups
    };
  },

  setGroupCloseTimeout: function(timeout) {
    return {
      type: "GROUP_CLOSE_TIMEOUT_RECIEVE",
      closeTimeout: timeout
    };
  }
};
