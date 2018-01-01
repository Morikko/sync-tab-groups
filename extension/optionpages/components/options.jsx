Options = (() => {
  const OptionsStandalone = React.createClass({
    propTypes: {
      onOptionChange: React.PropTypes.func,
      onBackUpClick: React.PropTypes.func,
      onImportClick: React.PropTypes.func,
      onExportClick: React.PropTypes.func
    },

    getInitialState: function() {
      return {
        href: location.href.split('#')[1]||"about"
      };
    },

    componentDidMount: function() {
      window.addEventListener("hashchange", this.readHash);
    },

    componentWillUnmount: function() {
      window.removeEventListener("hashchange", this.readHash);
    },

    render: function() {

      let tab = function(title, href) {
        this.href = href;
        this.title = title;
      };
      let tabs = [
        new tab("Advanced Setup","advsettings"),
        new tab("Shortcuts","shortcuts"),
        new tab("Save/Restore","save"),
        new tab("About","about"),
        new tab("Help","help"),
      ];
      return (
        <div>
          <OptionsMenu tabs={tabs} selected={this.state.href}
                        onClick={this.onNavClick}/>
          <OptionsPanel {...this.props}/>
      </div>);
    },

    onNavClick: function(event) {
      event.stopPropagation();
      this.setState({
        href: event.target.href.split("#")[1]
      });
    },

    readHash: function() {
      this.setState({
        href: location.href.split('#')[1]||"about"
      });
    }
  });
  return ReactRedux.connect((state) => {
    return {options: state.get("options")};
  }, ActionCreators)(OptionsStandalone);
})();
