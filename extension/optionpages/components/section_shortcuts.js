var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class ShortcutsSection extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.GLOBAL_SHORTCUT_NAME = "Global Shortcuts";

    this.state = {};

    this.state.panelVisibility = {};
    for (let p in this.navigationCommands) {
      this.state.panelVisibility[p] = false;
    }
    this.state.panelVisibility[this.GLOBAL_SHORTCUT_NAME] = false;

    browser.commands.getAll().then(commands => {
      this.globalCommands = {
        [this.GLOBAL_SHORTCUT_NAME]: commands
      };
      this.forceUpdate();
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
      this.createShorcutDescription(this.globalCommands, this.GLOBAL_SHORTCUT_NAME),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("options_shortcuts_navigation")
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.shortcuts.navigation,
        label: browser.i18n.getMessage("options_shortcuts_navigation_allow"),
        onCheckChange: this.props.onOptionChange,
        id: "shortcuts-navigation"
      }),
      this.createNavigationCommandDescription()
    );
  }

  createNavigationCommandDescription() {
    let navigationDescription = [];

    for (let section in this.navigationCommands) {
      navigationDescription.push(this.createShorcutDescription(this.navigationCommands, section));
    }
    return navigationDescription;
  }

  handleShowNavigationDescription(section) {
    let newPanelVisibility = _extends({}, this.state.panelVisibility);

    newPanelVisibility[section] = !newPanelVisibility[section];

    this.setState({
      panelVisibility: newPanelVisibility
    });
  }

  createShorcutDescription(commands, section) {
    let shortcutDescription = [];

    let chevronOrientation = this.state.panelVisibility[section] ? "down" : "right";
    shortcutDescription.push(React.createElement(
      "h3",
      {
        className: "shortcut-subtitle",
        key: section + "-title",
        onClick: (e => {
          e.stopPropagation();
          this.handleShowNavigationDescription(section);
        }).bind(this) },
      React.createElement("i", { className: "shortcut-subtitle-icon fa fa-fw fa-chevron-" + chevronOrientation }),
      section
    ));
    if (this.state.panelVisibility[section]) {
      shortcutDescription.push(React.createElement(
        "table",
        { key: section + "-table", className: "list_help" },
        React.createElement(
          "tbody",
          null,
          commands[section].map(command => {
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
      ));
    }
    return shortcutDescription;
  }

  commandFactory(shortcut, name) {
    return {
      shortcut: shortcut,
      name: name
    };
  }

  init() {
    this.navigationCommands = {
      "General": [this.commandFactory("Down", "general_down"), this.commandFactory("Up", "general_up"), this.commandFactory("Insert", "general_insert"), this.commandFactory("Escape", "general_escape"), this.commandFactory("Home", "general_home"), this.commandFactory("End", "general_end"), this.commandFactory("Page up", "general_pageup"), this.commandFactory("Page down", "general_pagedown"), this.commandFactory("Shift + Page up", "general_shift_pageup"), this.commandFactory("Shift + Page down", "general_shift_pagedown"), this.commandFactory("Ctrl + F", "general_ctrl_f")],

      "Only the Pop-Up": [this.commandFactory("Ctrl + M", "popup_ctrl_m"), this.commandFactory("Ctrl + P", "popup_ctrl_p"), this.commandFactory("Ctrl + O", "popup_ctrl_o"), this.commandFactory("Ctrl + L", "popup_ctrl_l")],

      "Group": [this.commandFactory("Space", "group_space"), this.commandFactory("Enter", "group_enter"), this.commandFactory("Shift + Enter", "group_shift_enter"), this.commandFactory("Delete", "group_delete"), this.commandFactory("Shift + Delete", "group_shift_delete"), this.commandFactory("Backspace", "group_backspace"), this.commandFactory("Ctrl + E", "group_ctrl_e"), this.commandFactory("Shift + Up", "group_shift_up"), this.commandFactory("Shift + Down", "group_shift_down")],

      "Tab": [this.commandFactory("Enter", "tab_enter"), this.commandFactory("Shift + Enter", "tab_shift_enter"), this.commandFactory("Space", "tab_space"), this.commandFactory("Delete", "tab_delete"), this.commandFactory("Ctrl + Enter", "tab_ctrl_enter"), this.commandFactory("Shift + P", "tab_shift_p"), this.commandFactory("Shift + Up", "tab_shift_up"), this.commandFactory("Shift + Down", "tab_shift_down")],

      "Search Bar": [this.commandFactory("Shift+Backspace", "searchbar_shift_backspace")],

      "Create Group Button": [this.commandFactory("Shift+Backspace", "addbutton_shift_backspace"), this.commandFactory("Enter", "addbutton_enter")]
    };

    this.globalCommands = {
      [this.GLOBAL_SHORTCUT_NAME]: []
    };
  }

};

ShortcutsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string
};