class InterfaceSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "interface" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        browser.i18n.getMessage("options_interface")
      ),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("label_select_sorting_type"),
        content: React.createElement(
          "div",
          null,
          React.createElement(OptionSelect, {
            selected: this.props.options.groups.sortingType,
            label: "",
            onValueChange: this.props.onOptionChange,
            id: "groups-sortingType",
            choices: [{
              value: OptionManager.SORT_CUSTOM,
              label: browser.i18n.getMessage("label_sort_custom")
            }, {
              value: OptionManager.SORT_ALPHABETICAL,
              label: browser.i18n.getMessage("label_sort_alphabetical")
            }, {
              value: OptionManager.SORT_LAST_ACCESSED,
              label: browser.i18n.getMessage("label_sort_accessed")
            }, {
              value: OptionManager.SORT_OLD_RECENT,
              label: browser.i18n.getMessage("label_sort_old")
            }, {
              value: OptionManager.SORT_RECENT_OLD,
              label: browser.i18n.getMessage("label_sort_recent")
            }] })
        ),
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_interface_sortexplanation_custom")
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_interface_sortexplanation_alphabetical")
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_interface_sortexplanation_last")
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_interface_sortexplanation_old")
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_interface_sortexplanation_recent")
          )
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("options_interface_groups"),
        content: React.createElement(
          "div",
          null,
          React.createElement(NiceCheckbox, {
            checked: this.props.options.popup.showTabsNumber,
            label: browser.i18n.getMessage("show_tabs_number"),
            onCheckChange: this.props.onOptionChange,
            id: "popup-showTabsNumber"
          })
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("toolbar_menu"),
        content: React.createElement(
          "div",
          null,
          React.createElement(NiceCheckbox, {
            checked: this.props.options.popup.showSearchBar,
            label: browser.i18n.getMessage("show_search_bar"),
            onCheckChange: this.props.onOptionChange,
            id: "popup-showSearchBar"
          }),
          React.createElement(NiceCheckbox, {
            checked: this.props.options.popup.whiteTheme,
            label: browser.i18n.getMessage("icon_option"),
            onCheckChange: this.props.onOptionChange,
            id: "popup-whiteTheme"
          })
        )
      }),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("options_interface_windows")
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.groups.showGroupTitleInWindow,
        label: browser.i18n.getMessage("show_title_window"),
        onCheckChange: this.props.onOptionChange,
        id: "groups-showGroupTitleInWindow" })
    );
  }
};

InterfaceSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string
};