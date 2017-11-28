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
        title: 'Import/Export groups'
      }),
      React.DOM.span({},
        React.DOM.ul({}, [
          React.DOM.li({}, "Imported groups are added as closed groups"),
          React.DOM.li({}, "Import supports: Sync Tab Groups and Tab Groups json file."),
        ])),
      React.createElement(OptionButton, {
        title: "Export Groups",
        onClick: this.props.onExportClick
      }),
      React.createElement(ButtonFile, {
        title: "Import Groups",
        id: "import-groups",
        onFileSelected: this.props.onImportClick
      }),
    ]);
  },

});
