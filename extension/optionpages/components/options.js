var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

    let tab = function (title, href) {
      this.href = href;
      this.title = title;
    };
    let tabs = [new tab(browser.i18n.getMessage("options_settings"), "settings"), new tab(browser.i18n.getMessage("options_interface"), "interface"), new tab(browser.i18n.getMessage("shortcuts"), "shortcuts"), new tab(browser.i18n.getMessage("options_groups"), "groups"), new tab(browser.i18n.getMessage("options_about"), "about"), new tab(browser.i18n.getMessage("options_guide"), "")];
    return React.createElement(
      "div",
      null,
      React.createElement(OptionsMenu, { tabs: tabs, selected: this.state.href,
        onClick: this.onNavClick,
        onOpenGuide: this.props.onOpenGuide }),
      React.createElement(OptionsPanel, _extends({}, this.props, { selected: this.state.href }))
    );
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
  onOpenGuide: PropTypes.func
};

Options = (() => {
  return ReactRedux.connect(state => {
    return {
      options: state.get("options")
    };
  }, ActionCreators)(OptionsStandalone);
})();