const BookmarkSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    onBackUpClick: React.PropTypes.func,
  },

  prefix: "bookmarks",

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: 'Bookmarks backup'
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.sync,
        label: "Back up automatically the groups (Every 60s)",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(OptionButton, {
        title: "Back up now",
        onClick: this.props.onBackUpClick
      }),
    ]);
  },

});
