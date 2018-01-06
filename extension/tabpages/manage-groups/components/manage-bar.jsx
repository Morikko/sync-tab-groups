class ManageBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="menu">
        <a className="logo">
          <span>
            <img src="/share/icons/tabspace-active-64.png" alt="" height="32"/>
          </span>
        </a>
        <span className="title">
          Manage Groups
        </span>
        <div className="right-buttons">
          <RadioButton
            labelLeft="Single"
            iconLeft="square-o"
            labelRight="Doubles"
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
