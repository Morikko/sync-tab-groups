const SaveSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    onImportClick: React.PropTypes.func,
    onExportClick: React.PropTypes.func,
    selected: React.PropTypes.string,
  },

  prefix: "bookmarks",

  render: function() {
    return (
      <div className={"option-section " + (this.props.selected==="save"?
        "visible":"invisible")}>
        <h1 className="section-title">
          Save/Restore
        </h1>
        <h2>
          {browser.i18n.getMessage("import_export_title")}
        </h2>
        <ul>
          <li>{browser.i18n.getMessage("import_export_help_added")}</li>
          <li>{browser.i18n.getMessage("import_export_help_support")}</li>
        </ul>
        <OptionButton
          title= {browser.i18n.getMessage("export_groups")}
          onClick= {this.props.onExportClick}
        />
        <ButtonFile
          title= {browser.i18n.getMessage("import_groups")}
          id= {"import-groups"}
          onFileSelected= {this.props.onImportClick}
        />
      </div>
    );
      /* TODO: end of bookmark auto-save
      React.DOM.div({
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
      ])*/
  },

});
