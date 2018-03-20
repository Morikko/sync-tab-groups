const ActionCreators = {
  setGroups: function(groups) {
    return {
      type: "GROUPS_RECEIVE",
      groups: groups
    };
  },
};
