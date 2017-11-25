const store = Redux.createStore(Reducer);

const Actions = {
  askOptions: function() {
    Utils.sendMessage("Option:Ask", {});
  },

  onOptionChange: function(name, value) {
    Utils.sendMessage("Option:Change", {
      optionName: name,
      optionValue: value
    });
  },

  onBackUpAsk: function(name, value) {
    Utils.sendMessage("Option:BackUp", {});
  },
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider, {
        store: store
      },
      React.createElement(OptionsPanel, {
        onOptionChange: Actions.onOptionChange,
        onBackUpClick: Actions.onBackUpAsk,
      })
    ),
    document.getElementById("content")
  );
});

var optionMessenger = function(message) {
  switch (message.task) {
    case "Option:Changed":
      store.dispatch(ActionCreators.setOptions(message.params.options));
      break;
  }
}

browser.runtime.onMessage.addListener(optionMessenger);

/*
 * Access to the groups and show them
 */
function init() {
  Actions.askOptions();
}

init();
