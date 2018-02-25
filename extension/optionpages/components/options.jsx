class OptionsStandalone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      href: location.href.split('#')[1] || "about"
    };

    this.onNavClick = this.onNavClick.bind(this);
    this.readHash = this.readHash.bind(this);
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
      new tab(browser.i18n.getMessage("options_settings"), "settings"),
      new tab(browser.i18n.getMessage("options_interface"), "interface"),
      new tab(browser.i18n.getMessage("shortcuts"), "shortcuts"),
      new tab(browser.i18n.getMessage("options_groups"), "groups"),
      new tab(browser.i18n.getMessage("options_about"), "about"),
      new tab(browser.i18n.getMessage("options_guide"), ""),
    ];
    return (
      <div>
          <OptionsMenu tabs={tabs} selected={this.state.href}
                        onClick={this.onNavClick}
                        onOpenGuide={this.props.onOpenGuide}/>
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
  onExportClick: PropTypes.func,
  onDeleteAllGroups: PropTypes.func,
  onReloadGroups: PropTypes.func,
  onOpenGuide: PropTypes.func,
};

Options = (() => {
  return ReactRedux.connect((state) => {
    return {
      options: state.get("options")
    };
  }, ActionCreators)(OptionsStandalone);
})();
