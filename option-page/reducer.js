const INITIAL_STATE = {
  options: OptionManager.TEMPLATE(),
};

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "OPTIONS_RECEIVE":
      return state["options"] = action.options;
  }
  return state;
};
