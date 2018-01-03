document.addEventListener("DOMContentLoaded", async () => {

  document.title = "Shortcuts List for Sync Tab Groups";
  // Set tab icon
  Utils.setIcon("../../share/icons/tabspace-active-64.png");

  let list_commands = await browser.commands.getAll();

  ReactDOM.render(React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "title" },
      React.createElement("img", {
        src: "../../share/icons/tabspace-active-64.png",
        alt: "Sync Tab Groups icon",
        width: "64",
        height: "64"
      }),
      "\"Sync Tab Groups\""
    ),
    React.createElement(
      "div",
      { className: "help" },
      React.createElement(
        "h1",
        { className: "shortcut-list" },
        browser.i18n.getMessage("shortcut_list")
      ),
      React.createElement(
        "table",
        { className: "list_help" },
        React.createElement(
          "tbody",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { className: "command_shortcuts" },
              browser.i18n.getMessage("command_shortcuts")
            ),
            React.createElement(
              "th",
              { className: "command_description" },
              browser.i18n.getMessage("command_description")
            )
          ),
          list_commands.map(command => {
            return React.createElement(
              "tr",
              { key: command.name },
              React.createElement(
                "td",
                { className: "command_shortcuts" },
                command.shortcut
              ),
              React.createElement(
                "td",
                { className: "command_description" },
                browser.i18n.getMessage("command_description_" + command.name)
              )
            );
          })
        )
      )
    )
  ), document.getElementById("content"));
});