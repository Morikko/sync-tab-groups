class ShortcutsSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commands: []
    };

    browser.commands.getAll().then(commands => {
      this.setState({
        commands: commands
      });
    });
  }
  render() {
    return React.createElement(
      "div",
      { className: "option-section shortcuts " + (this.props.selected === "shortcuts" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        browser.i18n.getMessage("shortcuts")
      ),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("options_shortcuts_global")
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.shortcuts.allowGlobal,
        label: browser.i18n.getMessage("allow_global_shortcuts"),
        onCheckChange: this.props.onOptionChange,
        id: "shortcuts-allowGlobal"
      }),
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
          this.state.commands.map(command => {
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
    );
  }
};

ShortcutsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string
};