import Immutable from 'immutable'
import * as Redux from 'redux'
import OPTION_CONSTANTS from '../background/core/OPTION_CONSTANTS'

const INITIAL_STATE = Immutable.Map({
  options: OPTION_CONSTANTS.TEMPLATE(),
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

const optionsStore = Redux.createStore(Reducer);

export default optionsStore