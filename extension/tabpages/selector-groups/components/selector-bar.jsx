class ManageBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="menu">
        <div className="title">
          <img src="/share/icons/tabspace-active-64.png" alt="" height="32"/>
          <span>{browser.i18n.getMessage("group_manager")}</span>
        </div>
        <div className="bar-buttons">
          <OptionButton
            title= {"Selection"/*browser.i18n.getMessage("options_behaviors_help_title_invisible")*/}
            onClick= {this.clickOnInvisible}
            highlight={true}
          />
          <OptionButton
            title= {"Type"}
            onClick= {this.clickOnInvisible}
            highlight={false}
            disabled={true}
          />
          <OptionButton
            title= {"Go"}
            onClick= {this.clickOnInvisible}
            highlight={false}
            disabled={true}
          />
        </div>
      </div>
    );
  }
}

ManageBar.propTypes = {
  singleMode: PropTypes.bool,
  changeColumnDisplay: PropTypes.func,
}
