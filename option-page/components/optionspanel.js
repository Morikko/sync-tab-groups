const OptionsPanel = (() => {
  const OptionsPanelStandalone = React.createClass({
    propTypes: {
      onOptionChange: React.PropTypes.func
    },

    render: function() {
      return React.DOM.ul({}, [
        React.createElement(PrivateWindowSection, {
          options: this.props.options.privateWindow,
          onOptionChange: this.props.onOptionChange,
        }),
        React.createElement(PinnedTabSection, {
          options: this.props.options.pinnedTab,
          onOptionChange: this.props.onOptionChange,
        }),
        React.DOM.b({}, JSON.stringify(this.props.options))
      ]);
    }
  });

  return ReactRedux.connect((state) => {
    return {
      options: state,
    };
  }, ActionCreators)(OptionsPanelStandalone);
})();
