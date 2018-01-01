const FileSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    onImportClick: React.PropTypes.func,
    onExportClick: React.PropTypes.func,
  },

  prefix: "bookmarks",

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("import_export_title")
      }),
      React.DOM.span({},
        React.DOM.ul({}, [
          React.DOM.li({}, browser.i18n.getMessage("import_export_help_added")),
          React.DOM.li({}, browser.i18n.getMessage("import_export_help_support")),
        ])),
      React.createElement(OptionButton, {
        title: browser.i18n.getMessage("export_groups"),
        onClick: this.props.onExportClick
      }),
      React.createElement(ButtonFile, {
        title: browser.i18n.getMessage("import_groups"),
        id: "import-groups",
        onFileSelected: this.props.onImportClick
      }),
    ]);
  },

});
