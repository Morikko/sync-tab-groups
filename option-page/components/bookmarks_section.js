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
        title: 'Bookmarks'
      }),
      React.DOM.span({},
        React.DOM.ul({},[
          React.DOM.li({},"Bookmarks are saved in OtherBookmarks/SyncTabGroups by default."),
          React.DOM.li({},"For changing the root location, move the SyncTabGroups folder anywhere in your bookmarks."),
          React.DOM.li({},"Session name is the subfolder name where bookmarks are saved for this computer."),
          React.DOM.li({},"Do not have another SyncTabGroups folder."),
      ])),
      React.createElement(OptionInput, {
        label: "Name of the session (subfolder): ",
        help: "Example: Computer 1, laptop...",
        name: this.props.options.folder,
        onChange: this.props.onOptionChange,
        id: this.prefix + "-folder",
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.sync,
        label: "Save groups in bookmarks automatically (Every 60s)",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(OptionButton, {
        title: "Save now",
        onClick: this.props.onBackUpClick
      }),
    ]);
  },

});
