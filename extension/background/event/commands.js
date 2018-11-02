CommandsEvent = {};

CommandsEvent.initCommandsEventListener = function() {
  // Commands
  browser.commands.onCommand.addListener(async function(command) {
    try {
      if (!OptionManager.options.shortcuts.allowGlobal) { // disable by user
        return "";
      }
      switch (command) {
        case "swtich_next_group":
          WindowManager.selectNextGroup();
          break;
        case "swtich_previous_group":
          WindowManager.selectNextGroup({
            direction: -1,
          });
          break;
        case "create_group_swtich":
          let newGroupId = GroupManager.addGroup();
          WindowManager.selectGroup(newGroupId);
          break;
        case "focus_next_group":
          WindowManager.selectNextGroup({
            open: true,
          });
          break;
        case "focus_previous_group":
          WindowManager.selectNextGroup({
            direction: -1,
            open: true,
          });
          break;
        case "remove_group_swtich":
          await WindowManager.removeGroup();
          //WindowManager.selectNextGroup();
          break;
        default:
      }
    } catch (e) {
      LogManager.error(e, {arguments});
    }
  });
};

export default CommandsEvent