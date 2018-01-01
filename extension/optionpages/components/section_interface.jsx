const InterfaceSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    selected: React.PropTypes.string,
  },

  prefix: "popup",

  render: function() {
    return (
      <div className={"option-section " + (this.props.selected==="interface"?
        "visible":"invisible")}>
        <h1 className="section-title">
          Interface
        </h1>
        <h2>
          {browser.i18n.getMessage("toolbar_menu")}
        </h2>
        <OptionSelect
          selected= {this.props.options.groups.sortingType}
          label= {browser.i18n.getMessage("label_select_sorting_type")}
          onValueChange= {this.props.onOptionChange}
          id="groups-sortingType"
          choices= { [
            {
              value: OptionManager.SORT_CUSTOM,
              label: browser.i18n.getMessage("label_sort_custom"),
            },
            {
              value: OptionManager.SORT_ALPHABETICAL,
              label: browser.i18n.getMessage("label_sort_alphabetical"),
            },
            {
              value: OptionManager.SORT_LAST_ACCESSED,
              label: browser.i18n.getMessage("label_sort_accessed"),
            },
            {
              value: OptionManager.SORT_OLD_RECENT,
              label: browser.i18n.getMessage("label_sort_old"),
            },
            {
              value: OptionManager.SORT_RECENT_OLD,
              label: browser.i18n.getMessage("label_sort_recent"),
            },
          ]} />
          <NiceCheckbox
            checked= {this.props.options.popup.showTabsNumber}
            label= {browser.i18n.getMessage("show_tabs_number")}
            onCheckChange= {this.props.onOptionChange}
            id="popup-showTabsNumber"
          />
          <NiceCheckbox
            checked= {this.props.options.popup.showSearchBar}
            label= {browser.i18n.getMessage("show_search_bar")}
            onCheckChange= {this.props.onOptionChange}
            id="popup-showSearchBar"
          />
          <NiceCheckbox
            checked= {this.props.options.popup.whiteTheme}
            label= {browser.i18n.getMessage("icon_option")}
            onCheckChange= {this.props.onOptionChange}
            id="popup-whiteTheme"
          />
        <h2>
          Windows
        </h2>
        <NiceCheckbox
          checked={this.props.options.groups.showGroupTitleInWindow}
          label={browser.i18n.getMessage("show_title_window")}
          onCheckChange={this.props.onOptionChange}
          id="groups-showGroupTitleInWindow"/>
      </div>
      );
  },

});
