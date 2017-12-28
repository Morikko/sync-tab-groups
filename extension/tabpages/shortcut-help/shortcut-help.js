document.addEventListener("DOMContentLoaded", async() => {

  document.title = "Shortcuts List for Sync Tab Groups";
  // Set tab icon
  Utils.setIcon("../../share/icons/tabspace-active-64.png");

  let list_commands = await browser.commands.getAll();

  let text_commands = [];
  text_commands.push(
    React.DOM.tr({
      },[
        React.DOM.th({className:"command_shortcuts"}, browser.i18n.getMessage("command_shortcuts")),
        React.DOM.th({className:"command_description"}, browser.i18n.getMessage("command_description")),
      ])
  );
  list_commands.map((command) => {
    text_commands.push(
      React.DOM.tr({
          className: command.name
        },[
          React.DOM.td({className:"command_shortcuts"}, command.shortcut),
          React.DOM.td({className:"command_description"}, browser.i18n.getMessage("command_description_" + command.name)),
        ])
    );
  });

  ReactDOM.render(
    React.DOM.div({},
      React.DOM.div({
        className: "title"
      }, [
        React.DOM.img({
          src: "../../share/icons/tabspace-active-64.png",
          alt: "Sync Tab Groups icon",
          width: "64",
          height: "64"
        }),
        "Sync Tab Groups"
      ]), React.DOM.div({
          className: "help"
        },
        React.DOM.h1({
          className: "shortcut-list"
        }, browser.i18n.getMessage("shortcut_list")),
        React.DOM.table({
          className: "list_help",
        }, text_commands))
    ), document.getElementById("content"));

});
