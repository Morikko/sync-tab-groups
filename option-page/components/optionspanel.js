const OptionsPanel = (() => {
  const OptionsPanelStandalone = React.createClass({
    propTypes: {
      onOptionChange: React.PropTypes.func,
      onBackUpClick: React.PropTypes.func,
      onImportClick: React.PropTypes.func,
      onExportClick: React.PropTypes.func,
    },

    render: function() {
      return React.DOM.div({}, [
        React.createElement(GroupSection, {
          options: this.props.options.groups,
          onOptionChange: this.props.onOptionChange,
        }),
        React.createElement(PrivateWindowSection, {
          options: this.props.options.privateWindow,
          onOptionChange: this.props.onOptionChange,
        }),
        React.createElement(PinnedTabSection, {
          options: this.props.options.pinnedTab,
          onOptionChange: this.props.onOptionChange,
        }),
        React.createElement(BookmarkSection, {
          options: this.props.options.bookmarks,
          onOptionChange: this.props.onOptionChange,
          onBackUpClick: this.props.onBackUpClick
        }),
        React.createElement(FileSection, {
          options: this.props.options.bookmarks,
          onOptionChange: this.props.onOptionChange,
          onImportClick: this.props.onImportClick,
          onExportClick: this.props.onExportClick
        }),
        React.createElement(PopupSection, {
          options: this.props.options.popup,
          onOptionChange: this.props.onOptionChange,
        }),
        React.createElement(ShortcutsSection, {
          options: this.props.options.shortcuts,
          onOptionChange: this.props.onOptionChange,
        }),
      ]);
    }
  });

  return ReactRedux.connect((state) => {
    return {
      options: state.get("options"),
    };
  }, ActionCreators)(OptionsPanelStandalone);
})();
