import React from 'react'
import PropTypes from 'prop-types'

import NiceCheckbox from '../../share/components/forms/nicecheckbox'

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

    browser.commands.getAll().then((commands)=>{
      this.globalCommands = {
        [this.GLOBAL_SHORTCUT_NAME]: commands,
      }
      this.forceUpdate();
    });


  }

  render() {
    return (
      <div className={"option-section shortcuts " + (this.props.selected==="shortcuts"?
        "visible":"invisible")}>
        <h1 className="section-title">
          {browser.i18n.getMessage("shortcuts")}
        </h1>
        <h2>
          {browser.i18n.getMessage("options_shortcuts_global")}
        </h2>
        <NiceCheckbox
          checked= {this.props.options.shortcuts.allowGlobal}
          label= {browser.i18n.getMessage("allow_global_shortcuts")}
          onCheckChange= {this.props.onOptionChange}
          id= {"shortcuts-allowGlobal"}
        />
        {this.createShorcutDescription(
          this.globalCommands, this.GLOBAL_SHORTCUT_NAME)}
        <h2>
          {browser.i18n.getMessage("options_shortcuts_navigation")}
        </h2>
        <NiceCheckbox
          checked= {this.props.options.shortcuts.navigation}
          label= {browser.i18n.getMessage("options_shortcuts_navigation_allow")}
          onCheckChange= {this.props.onOptionChange}
          id= {"shortcuts-navigation"}
        />
        {this.createNavigationCommandDescription()}
      </div>
    );
  }

  createNavigationCommandDescription() {
    let navigationDescription = [];

    for (let section in this.navigationCommands) {
      navigationDescription.push(
        this.createShorcutDescription(
          this.navigationCommands, section)
      );
    }
    return navigationDescription;
  }

  handleShowNavigationDescription(section) {
    let newPanelVisibility = {...this.state.panelVisibility};

    newPanelVisibility[section] = !newPanelVisibility[section];

    this.setState({
      panelVisibility: newPanelVisibility,
    })
  }

  createShorcutDescription(commands, section) {
    let shortcutDescription = [];

    let chevronOrientation =  this.state.panelVisibility[section] ? "down":"right";
    shortcutDescription.push(
      <h3
        className="shortcut-subtitle"
        key={section+"-title"}
        onClick={((e)=>{
          e.stopPropagation();
          this.handleShowNavigationDescription(section);
        }).bind(this)}>
        <i className={"shortcut-subtitle-icon fa fa-fw fa-chevron-"+chevronOrientation}/>
        {section}
      </h3>
    )
    if (this.state.panelVisibility[section]) {
      shortcutDescription.push(
        <table key={section+"-table"} className="list_help">
          <tbody>
            {
              commands[section].map((command)=>{
                return (
                  <tr key={command.name}>
                    <td className="command_shortcuts">{command.shortcut}</td>
                    <td className="command_description">{
                      browser.i18n.getMessage("command_description_" + command.name)}
                    </td>
                  </tr>)
              })
            }
          </tbody>
        </table>);
    }
    return shortcutDescription;
  }

  commandFactory(shortcut, name) {
    return {
      shortcut: shortcut,
      name: name,
    }
  }

  init() {
    this.navigationCommands = {
      "General": [
        this.commandFactory("Down" , "general_down"),
        this.commandFactory("Up", "general_up"),
        this.commandFactory("Insert", "general_insert"),
        this.commandFactory("Escape", "general_escape"),
        this.commandFactory("Home", "general_home"),
        this.commandFactory("End", "general_end"),
        this.commandFactory("Page up", "general_pageup"),
        this.commandFactory("Page down", "general_pagedown"),
        this.commandFactory("Shift + Page up", "general_shift_pageup"),
        this.commandFactory("Shift + Page down", "general_shift_pagedown"),
        this.commandFactory("Ctrl + F", "general_ctrl_f"),
      ],

      "Only the Pop-Up": [
        this.commandFactory("Ctrl + M", "popup_ctrl_m"),
        this.commandFactory("Ctrl + P", "popup_ctrl_p"),
        this.commandFactory("Ctrl + O", "popup_ctrl_o"),
        this.commandFactory("Ctrl + L", "popup_ctrl_l"),
      ],

      "Group": [
        this.commandFactory("Space", "group_space"),
        this.commandFactory("Enter", "group_enter"),
        this.commandFactory("Shift + Enter", "group_shift_enter"),
        this.commandFactory("Delete", "group_delete"),
        this.commandFactory("Shift + Delete", "group_shift_delete"),
        this.commandFactory("Backspace", "group_backspace"),
        this.commandFactory("Ctrl + E", "group_ctrl_e"),
        this.commandFactory("Shift + Up", "group_shift_up"),
        this.commandFactory("Shift + Down", "group_shift_down"),
      ],

      "Tab": [
        this.commandFactory("Enter", "tab_enter"),
        this.commandFactory("Shift + Enter", "tab_shift_enter"),
        this.commandFactory("Space", "tab_space"),
        this.commandFactory("Delete", "tab_delete"),
        this.commandFactory("Ctrl + Enter", "tab_ctrl_enter"),
        this.commandFactory("Shift + P", "tab_shift_p"),
        this.commandFactory("Shift + Up", "tab_shift_up"),
        this.commandFactory("Shift + Down", "tab_shift_down"),
      ],

      "Search Bar": [
        this.commandFactory("Shift+Backspace", "searchbar_shift_backspace"),
      ],

      "Create Group Button": [
        this.commandFactory("Shift+Backspace", "addbutton_shift_backspace"),
        this.commandFactory("Enter", "addbutton_enter"),
      ],
    };

    this.globalCommands = {
      [this.GLOBAL_SHORTCUT_NAME]: [],
    }
  }

}

ShortcutsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string,
};

export default ShortcutsSection