class OptionsStandalone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      href: location.href.split('#')[1] || "about"
    };

    this.onNavClick = this.onNavClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.readHash);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.readHash);
  }

  render() {

    let tab = function(title, href) {
      this.href = href;
      this.title = title;
    };
    let tabs = [
      new tab("Settings", "settings"),
      new tab("Interface", "interface"),
      new tab("Shortcuts", "shortcuts"),
      new tab("Save/Restore", "save"),
      //new tab("Advanced", "advanced"),
      new tab("Guide", "help"),
      new tab("About", "about"),
    ];
    return (
      <div>
          <OptionsMenu tabs={tabs} selected={this.state.href}
                        onClick={this.onNavClick}/>
          <OptionsPanel {...this.props} selected={this.state.href} />
      </div>);
  }

  onNavClick(event) {
    event.stopPropagation();
    this.setState({
      href: event.target.href.split("#")[1]
    });
  }

  readHash() {
    this.setState({
      href: location.href.split('#')[1] || "about"
    });
  }
};

OptionsStandalone.propTypes = {
  onOptionChange: PropTypes.func,
  onBackUpClick: PropTypes.func,
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func
};

Options = (() => {
  return ReactRedux.connect((state) => {
    return {
      options: state.get("options")
    };
  }, ActionCreators)(OptionsStandalone);
})();
