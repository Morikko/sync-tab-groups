class OptionsMenu extends React.Component{

  render() {
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
              <a
                key={tab.href}
                href={"#" + tab.href}
                className={classNames({
                  "tab": true,
                  "selected": (tab.href === this.props.selected),
                })}>
              {(tab.title==="Guide") && <i
                  className="web-icon fa fa-fw fa-globe"
                ></i>}
              {tab.title}
            </a>);
          })
        }
      </nav>
    </div>);
  }
};

OptionsMenu.propTypes = {
  tabs: PropTypes.object,
  selected: PropTypes.string,
  onClick: PropTypes.func,
};
