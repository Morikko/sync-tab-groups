Options = (() => {
  const OptionsStandalone = React.createClass({
    propTypes: {
      onOptionChange: React.PropTypes.func,
      onBackUpClick: React.PropTypes.func,
      onImportClick: React.PropTypes.func,
      onExportClick: React.PropTypes.func
    },

    render: function() {
      return (<div>
        <div id="menu">
          <a className="logo">
            <span>
              <img src="/share/icons/tabspace-active-64.png" alt="" height="32"/>
            </span>
          </a>
          <label htmlFor="show-menu" className="show-menu">Show Menu</label>
          <input type="checkbox" id="show-menu" role="button"/>
          <nav className="tabs">
            <a className="tab selected">Advanced Setup</a>
            <a className="tab">Shortcuts</a>
            <a className="tab">Save/Restore</a>
            <a className="tab">Interface</a>
            <a className="tab">About</a>
            <a className="tab">Help</a>
          </nav>
        </div>
        <div id="panel">
          <OptionsPanel {...this.props}/>
        </div>
      </div>);
    }
  });
  return ReactRedux.connect((state) => {
    return {options: state.get("options")};
  }, ActionCreators)(OptionsStandalone);
})();
