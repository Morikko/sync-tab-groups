class SaveSection extends React.Component {
  render() {
    return (
      <div className={"option-section " + (this.props.selected==="save"?
        "visible":"invisible")}>
        <h1 className="section-title">
          Groups
        </h1>
        <SubSection
          title={browser.i18n.getMessage("import_export_title")}
          tooltip={
            <ul>
              <li>{browser.i18n.getMessage("import_export_help_added")}</li>
              <li>{browser.i18n.getMessage("import_export_help_support")}</li>
            </ul>
          }
          content = {
            <div>
              <OptionButton
                title= {browser.i18n.getMessage("export_groups")}
                onClick= {this.props.onExportClick}
                enabled={true}
              />
              <ButtonFile
                title= {browser.i18n.getMessage("import_groups")}
                id= {"import-groups"}
                onFileSelected= {this.props.onImportClick}
              />
            </div>
          }
        />
        <SubSection
          title={"Cleaning (Dangerous)"}
          tooltip={
            <ul>
              <li>{"Remove all groups:"}</li>
              <ul>
                <li>{"Once done, you can't recover your groups if you don't have export them manually."}</li>
              </ul>
              {/*
              <li>{"Reload your groups"}</li>
              <ul>
                <li>{"Load the groups saved on the disk and replace the one in memory (actually visible in your browser)."}</li>
                <li>{"This function is only provided in error case, if your groups in memory have been corrupted."}</li>
                <li>{"In any cases, it is better to contact me on Github or with a mail. In that case, reporting the error messages from the browser (Ctrl+Maj+J) will be greatly helpful."}</li>
                <li>{"Be aware, that your groups in memory are overwritten and lost after this operation."}</li>
              </ul>
              */}
            </ul>
          }
          content = {
            <div className="dangerous-zone">
              <OptionButton
                title= {"Remove all groups"}
                onClick= {this.handleClickOnRemoveAllGroups.bind(this)}
                enabled={true}
              />
              {/*
              <OptionButton
                title= {"Reload your groups"}
                onClick= {this.handleClickOnReloadGroups.bind(this)}
                enabled={true}
              />
              */}
            </div>
          }
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
  }

  handleClickOnRemoveAllGroups() {
    if (confirm("Are you sure you want to remove all the groups?")) {
        this.props.onDeleteAllGroups();
    }
  }

  handleClickOnReloadGroups() {
    if (confirm("Are you sure you want to reload your groups from the disk?")) {
        this.props.onReloadGroups();
    }
  }
};

SaveSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onDeleteAllGroups: PropTypes.func,
  onReloadGroups: PropTypes.func,
  selected: PropTypes.string,
};
