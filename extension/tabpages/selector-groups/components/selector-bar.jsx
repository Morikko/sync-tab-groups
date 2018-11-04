class ManageBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    if ( Utils.getParameterByName('type') === SELECTOR_TYPE.IMPORT ) {
      this.state.type = 'import_groups';
    } else {
      this.state.type = 'export_groups';
    }
  }

  render() {
    return (
      <div id="menu">
        <div className="title">
          <img src="/share/icons/tabspace-active-64.png" alt="" height="32"/>
          <span>{"Selector"}</span>
        </div>
        <div className="bar-buttons">
          {/*
            <OptionButton
            title= {"Help"}
            onClick= {this.clickOnInvisible}
            highlight={true}
            disabled={false}
            />
          */}
          <OptionButton
            title= {browser.i18n.getMessage(this.state.type)}
            onClick= {(e)=>this.props.onFinish()}
            highlight={this.props.hasSelected}
            disabled={!this.props.hasSelected}
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
