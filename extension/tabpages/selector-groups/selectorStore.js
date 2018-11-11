import Immutable from 'immutable'
import * as Redux from 'redux'

import OPTION_CONSTANTS from '../../background/core/OPTION_CONSTANTS'

const INITIAL_STATE = Immutable.Map({
  groups: [],
  options: OPTION_CONSTANTS.TEMPLATE(),
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
  case "GROUPS_RECEIVE":
    return state.set("groups", action.groups);
  case "OPTIONS_RECEIVE":
    return state.set("options", action.options);
  }
  return state;
};

const selectorStore = Redux.createStore(Reducer);

export default selectorStore