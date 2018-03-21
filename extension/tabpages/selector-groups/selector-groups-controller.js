const store = Redux.createStore(Reducer);

class SelectorActions {
  static getGroups() {
    Utils.sendMessage("Ask:SelectorGroups", {});
  }

  static finish({
    filter,
    importType = undefined
  } = {}) {
    Utils.sendMessage("Selector:Finish", {
      importType,
      filter
    });
  }
}

var selectorMessenger = function (message) {
  switch (message.task) {
    case "Selector:Groups":
      store.dispatch(ActionCreators.setGroups(message.params.groups));
      break;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Set tab title
  document.title = Utils.getParameterByName("title");
  // Set tab icon
  Utils.setIcon("/share/icons/tabspace-active-64.png");
  ReactDOM.render(React.createElement(
    ReactRedux.Provider,
    { store: store },
    React.createElement(Wrapper, {
      finish: SelectorActions.finish
    })
  ), document.getElementById("content"));
});

browser.runtime.onMessage.addListener(selectorMessenger);
SelectorActions.getGroups();