class ShortcutsSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commands: []
    }

    browser.commands.getAll().then((commands)=>{
      this.setState({
        commands: commands
      });
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
        <table className="list_help">
          <tbody>
            <tr>
              <th className="command_shortcuts">{browser.i18n.getMessage("command_shortcuts")}</th>
              <th className="command_description">{browser.i18n.getMessage("command_description")}</th>
            </tr>
            {
              this.state.commands.map((command) => {
                return (
                  <tr key={command.name}>
                    <td className="command_shortcuts">{command.shortcut}</td>
                    <td className="command_description">{browser.i18n.getMessage("command_description_" + command.name)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
};

ShortcutsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string,
};
