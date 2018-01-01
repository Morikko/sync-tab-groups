var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Options = (() => {
  const OptionsStandalone = React.createClass({
    propTypes: {
      onOptionChange: React.PropTypes.func,
      onBackUpClick: React.PropTypes.func,
      onImportClick: React.PropTypes.func,
      onExportClick: React.PropTypes.func
    },

    getInitialState: function () {
      return {
        href: location.href.split('#')[1] || "about"
      };
    },

    componentDidMount: function () {
      window.addEventListener("hashchange", this.readHash);
    },

    componentWillUnmount: function () {
      window.removeEventListener("hashchange", this.readHash);
    },

    render: function () {

      let tab = function (title, href) {
        this.href = href;
        this.title = title;
      };
      let tabs = [new tab("Settings", "settings"), new tab("Interface", "interface"), new tab("Shortcuts", "shortcuts"), new tab("Save/Restore", "save"),
      //new tab("Advanced", "advanced"),
      new tab("Guide", "help"), new tab("About", "about")];
      return React.createElement(
        "div",
        null,
        React.createElement(OptionsMenu, { tabs: tabs, selected: this.state.href,
          onClick: this.onNavClick }),
        React.createElement(OptionsPanel, _extends({}, this.props, { selected: this.state.href }))
      );
    },

    onNavClick: function (event) {
      event.stopPropagation();
      this.setState({
        href: event.target.href.split("#")[1]
      });
    },

    readHash: function () {
      this.setState({
        href: location.href.split('#')[1] || "about"
      });
    }
  });
  return ReactRedux.connect(state => {
    return {
      options: state.get("options")
    };
  }, ActionCreators)(OptionsStandalone);
})();