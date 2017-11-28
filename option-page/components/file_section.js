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
          React.DOM.li({}, "Bllooooo"),
        ])),
      /*
      React.createElement(OptionInput, {
        label: "Name of the session: ",
        help: "Example: Computer 1, laptop...",
        name: this.props.options.folder,
        onChange: this.props.onOptionChange,
        id: this.prefix + "-folder",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.sync,
        label: "Save groups in bookmarks automatically (Every 30s)",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      */
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
