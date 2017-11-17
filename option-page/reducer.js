const INITIAL_STATE = Immutable.fromJS({
  options: {},
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "OPTIONS_RECEIVE":
      return state.set("options", action.options);
  }
  return state;
};
