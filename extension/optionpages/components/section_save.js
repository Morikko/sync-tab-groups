class SaveSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "save" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        "Groups"
      ),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("import_export_title"),
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("import_export_help_added")
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("import_export_help_support")
          )
        ),
        content: React.createElement(
          "div",
          null,
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("export_groups"),
            onClick: this.props.onExportClick,
            enabled: true
          }),
          React.createElement(ButtonFile, {
            title: browser.i18n.getMessage("import_groups"),
            id: "import-groups",
            onFileSelected: this.props.onImportClick
          })
        )
      }),
      React.createElement(SubSection, {
        title: "Cleaning (Dangerous)",
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Remove all groups:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Once done, you can't recover your groups if you don't have export them manually."
            )
          )
        ),
        content: React.createElement(
          "div",
          { className: "dangerous-zone" },
          React.createElement(OptionButton, {
            title: "Remove all groups",
            onClick: this.handleClickOnRemoveAllGroups.bind(this),
            enabled: true
          })
        )
      })
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
  selected: PropTypes.string
};