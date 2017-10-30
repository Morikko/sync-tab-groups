const INITIAL_STATE = Immutable.fromJS({
  tabgroups: [],
  closeTimeout: 0
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TABGROUPS_RECEIVE":
      return state.set("tabgroups", Immutable.fromJS(action.tabgroups));
    case "GROUP_CLOSE_TIMEOUT_RECIEVE":
      return state.set("closeTimeout", action.closeTimeout);
  }
  return state;
};
