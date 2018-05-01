const store = Redux.createStore(Reducer);

const Actions = {
  askOptions: function() {
    Utils.sendMessage("Option:Ask", {});
  },

  askBackupList: function() {
    Utils.sendMessage("BackupList:Ask", {});
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

  onImportAsk: function({
    content,
    filename,
  }) {
    Utils.sendMessage("Option:Import", {
      content_file: content,
      filename,
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

  onRemoveBackUp: function(id) {
    Utils.sendMessage("Option:RemoveBackUp", {
      id: id
    });
  },

  onImportBackUp: function(id) {
    Utils.sendMessage("Option:ImportBackUp", {
      id: id
    });
  },

  onExportBackUp: function(id) {
    Utils.sendMessage("Option:ExportBackUp", {
      id: id
    });
  },

  onDownloadErrorLog: function() {
    Utils.sendMessage("LogManager:Download", {});
  }
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
        onRemoveBackUp: Actions.onRemoveBackUp,
        onImportBackUp: Actions.onImportBackUp,
        onExportBackUp: Actions.onExportBackUp,
        downloadErrorLog: Actions.onDownloadErrorLog,
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
    case "BackupList:Changed":
      store.dispatch(ActionCreators.setBackupList(message.params.backupList));
      break;
  }
}

browser.runtime.onMessage.addListener(optionMessenger);

/*
 * Access to the groups and show them
 */
function init() {
  Actions.askOptions();
  Actions.askBackupList();
}

init();
