import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRedux from 'react-redux'

import Utils from '../../background/utils/utils'
import SelectorWrapper from './components/selector-wrapper'
import selectorStore from './selectorStore'
import ActionCreators from './action_creators'

class SelectorActions {
  static getGroups() {
    Utils.sendMessage("Ask:SelectorGroups", {});
  }

  static getOptions() {
    Utils.sendMessage("Ask:Options", {});
  }

  static finish({
    filter,
    importType=undefined,
  }={}) {
    Utils.sendMessage("Selector:Finish", {
      importType,
      filter,
    });
  }
}

let selectorMessenger = function(message) {
  switch (message.task) {
  case "Selector:Groups":
    selectorStore.dispatch(ActionCreators.setGroups(message.params.groups));
    break;
  case "Option:Changed":
    selectorStore.dispatch(ActionCreators.setOptions(message.params.options));
    break;
  }
}

// Set tab title
document.title = Utils.getParameterByName("title");
// Set tab icon
Utils.setIcon("/share/icons/tabspace-active-64.png");

ReactDOM.render(
  <ReactRedux.Provider store={selectorStore}>
    <SelectorWrapper
      finish={SelectorActions.finish}
    />
  </ReactRedux.Provider>
  , document.getElementById("content"));

browser.runtime.onMessage.addListener(selectorMessenger);
SelectorActions.getGroups();
