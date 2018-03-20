var Messenger = Messenger || {};
Messenger.Selector = Messenger.Selector || {};

Messenger.Selector.selectorMessenger = function(message) {
  switch (message.task) {
    case "Ask:SelectorGroups":
      Utils.sendMessage("Selector:Groups", {
        groups: Selector.groups,
      });
      break;
    case "Selector:Finish":

      break;
  }
}
