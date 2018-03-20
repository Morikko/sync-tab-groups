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
        <div className="right-buttons">
          <RadioButton
            labelLeft={browser.i18n.getMessage("group_manager_single_button")}
            iconLeft="square-o"
            labelRight={browser.i18n.getMessage("group_manager_split_button")}
            iconRight="columns"
            left={this.props.singleMode}
            getActivatedState={this.props.changeColumnDisplay}
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
