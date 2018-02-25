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

  onImportAsk: function(content_file) {
    Utils.sendMessage("Option:Import", {
      content_file: content_file,
    });
  },

  onExportAsk: function() {
    Utils.sendMessage("Option:Export", {});
  },

  onDeleteAllGroups: function( ) {
    Utils.sendMessage("Option:DeleteAllGroups", {});
  },

  onReloadGroups: function( ) {
    Utils.sendMessage("Option:ReloadGroups", {});
  },

  onOpenGuide: function() {
    Utils.sendMessage("Option:OpenGuide", {});
  },

  onUndiscardLazyTabs: function() {
    Utils.sendMessage("Option:UndiscardLazyTabs", {});
  },
};

document.addEventListener("DOMContentLoaded", () => {
  document.title = "Preferences";
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider, {
        store: store
      },
      React.createElement(Options, {
        onOptionChange: Actions.onOptionChange,
        onBackUpClick: Actions.onBackUpAsk,
        onImportClick: Actions.onImportAsk,
        onExportClick: Actions.onExportAsk,
        onDeleteAllGroups: Actions.onDeleteAllGroups,
        onReloadGroups: Actions.onReloadGroups,
        onOpenGuide: Actions.onOpenGuide,
        onUndiscardLazyTabs: Actions.onUndiscardLazyTabs,
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
