const INITIAL_STATE = Immutable.fromJS({
  tabgroups: [],
  delayedTasks: {},
  currentWindowId: browser.windows.WINDOW_ID_NONE
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TABGROUPS_RECEIVE":
      return state.set("tabgroups", action.tabgroups);
    case "CURRENT_WINDOWS_ID_RECEIVE":
      return state.set("currentWindowId", action.currentWindowId);
    case "DELAYED_TASKS_RECEIVE":
      return state.set("delayedTasks", action.delayedTasks);
  }
  return state;
};
