const INITIAL_STATE = Immutable.Map({
  groups: [],
  delayedTasks: {},
  currentWindowId: browser.windows.WINDOW_ID_NONE,
  options: OptionManager.TEMPLATE(),
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GROUPS_RECEIVE":
      return state.set("groups", action.groups);
    case "CURRENT_WINDOWS_ID_RECEIVE":
      return state.set("currentWindowId", action.currentWindowId);
    case "DELAYED_TASKS_RECEIVE":
      return state.set("delayedTasks", action.delayedTasks);
    case "OPTIONS_RECEIVE":
      return state.set("options", action.options);
  }
  return state;
};

const store = Redux.createStore(Reducer);
