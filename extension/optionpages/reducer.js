const INITIAL_STATE = Immutable.Map({
  options: OptionManager.TEMPLATE(),
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "OPTIONS_RECEIVE":
      return state.set("options", action.options);
  }
  return state;
};
