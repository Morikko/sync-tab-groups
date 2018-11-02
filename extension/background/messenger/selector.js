const SelectorMessenger = {};

SelectorMessenger.selectorMessenger = function(message) {
  switch (message.task) {
    case "Ask:SelectorGroups":
      Utils.sendMessage("Selector:Groups", {
        groups: Selector.groups,
      });
      break;
    case "Selector:Finish":
      SelectorMessenger.manageFinish(message.params);
      break;
    case "Ask:Options":
      Background.refreshOptionsUI();
      break;
  }
}

SelectorMessenger.manageFinish = async function({
  filter,
  importType,
}) {
  let done = false;
  if ( Selector.type === Selector.TYPE.EXPORT ) {
    done = await StorageManager.File.downloadGroups(
      GroupManager.filterGroups(
        Selector.groups,
        filter,
      )
    );
  } else {
    let ids = GroupManager.addGroups(
      GroupManager.filterGroups(
        Selector.groups,
        filter,
      ), {
      showNotification: true,
    });
    done = ids.length>0;
  }

  // In case of success
  if ( done ) {
    await Selector.closeGroupsSelector();
  }
}

export default SelectorMessenger