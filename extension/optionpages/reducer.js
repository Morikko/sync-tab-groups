const INITIAL_STATE = Immutable.Map({
  options: OptionManager.TEMPLATE(),
  backupList: {},
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "OPTIONS::RECEIVE":
      return state.set("options", action.options);
    case "BACKUPLIST::RECEIVE":
      return state.set("backupList", action.backupList);
  }
  return state;
};
