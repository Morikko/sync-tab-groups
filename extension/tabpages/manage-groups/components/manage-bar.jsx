class ManageBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="menu">
        <div className="title">
          <img src="/share/icons/tabspace-active-64.png" alt="" height="32"/>
          <span>Manage Groups</span>
        </div>
        <div className="right-buttons">
          <RadioButton
            labelLeft="Single"
            iconLeft="square-o"
            labelRight="Splitted"
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
