const OptionsPanel = (() => {
  const OptionsPanelStandalone = React.createClass({
    propTypes: {

    },

    render: function() {
      return React.DOM.ul({}, [
        React.createElement(PrivateWindowSection, {
          privateWindowOptions: this.props.options.privateWindow
        }),
        React.DOM.b({}, JSON.stringify(this.props.options))
      ]);
    }
  });

  return ReactRedux.connect((state) => {
    return {
      options: state.get("options"),
    };
  }, ActionCreators)(OptionsPanelStandalone);
})();
