class InterfaceSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "interface" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        "Interface"
      ),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("toolbar_menu")
      ),
      React.createElement(OptionSelect, {
        selected: this.props.options.groups.sortingType,
        label: browser.i18n.getMessage("label_select_sorting_type"),
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
        }] }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.popup.showTabsNumber,
        label: browser.i18n.getMessage("show_tabs_number"),
        onCheckChange: this.props.onOptionChange,
        id: "popup-showTabsNumber"
      }),
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
      }),
      React.createElement(
        "h2",
        null,
        "Windows"
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