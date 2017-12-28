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
        title: browser.i18n.getMessage("bookmarks_title")
      }),
      React.DOM.span({},
        React.DOM.ul({},[
          React.DOM.li({},browser.i18n.getMessage("bookmarks_weak_help")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_folder")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_moving")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_session")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_precaution")),
      ])),
      React.createElement(OptionInput, {
        label: browser.i18n.getMessage("name_session"),
        help: browser.i18n.getMessage("examples_session"),
        name: this.props.options.folder,
        onChange: this.props.onOptionChange,
        id: this.prefix + "-folder",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.sync,
        label: browser.i18n.getMessage("save_bookmarks_automatically"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(OptionButton, {
        title: browser.i18n.getMessage("save_now"),
        onClick: this.props.onBackUpClick
      }),
    ]);
  },

});
