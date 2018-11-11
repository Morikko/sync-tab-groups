const ActionCreators = {
  setGroups: function(groups) {
    return {
      type: "GROUPS_RECEIVE",
      groups: groups,
    };
  },

  setOptions: function(options) {
    return {
      type: "OPTIONS_RECEIVE",
      options: options,
    };
  },
};

export default ActionCreators