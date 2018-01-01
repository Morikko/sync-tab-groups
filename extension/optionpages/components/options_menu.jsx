OptionsMenu = React.createClass({
  propTypes: {
    tabs: React.PropTypes.object,
    selected: React.PropTypes.string,
    onClick: React.PropTypes.func,
  },

  render: function() {
    return (<div id="menu">
      <a className="logo">
        <span>
          <img src="/share/icons/tabspace-active-64.png" alt="" height="32"/>
        </span>
      </a>
      <input type="checkbox" id="show-menu" role="button"/>
      <label htmlFor="show-menu" className="show-menu">
        <i className="fa fa-bars"></i>
      </label>
      <nav className="tabs">
        {
          this.props.tabs.map((tab) => {
            return (
              <a href={"#" + tab.href}
                className={"tab " + (tab.href === this.props.selected ? "selected": "")} >
              {tab.title}
            </a>);
          })
        }
      </nav>
    </div>);
  }
});
