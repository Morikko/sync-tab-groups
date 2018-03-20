const INITIAL_STATE = Immutable.Map({
  groups: [],
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GROUPS_RECEIVE":
      return state.set("groups", action.groups);
  }
  return state;
};
