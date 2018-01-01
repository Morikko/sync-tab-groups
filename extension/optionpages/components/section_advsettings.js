const AdvSettingsSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    selected: React.PropTypes.string,
  },

  prefix: "groups",

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  render: function() {
    return React.DOM.div({
      className: "option-section " + (this.props.selected==="advanced"?
          "visible":"invisible")
    }, [
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("group_title")
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.syncNewWindow,
        label: browser.i18n.getMessage("new_window"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-syncNewWindow",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.removeEmptyGroup,
        label: browser.i18n.getMessage("remove_empty_groups"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-removeEmptyGroup",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.showGroupTitleInWindow,
        label: browser.i18n.getMessage("show_title_window"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-showGroupTitleInWindow",
      }),
      React.createElement(OptionSelect, {
        selected: this.props.options.sortingType,
        label: browser.i18n.getMessage("label_select_sorting_type"),
        onValueChange: this.props.onOptionChange,
        id: this.prefix + "-sortingType",
        choices: [
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
        ]
      }),
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("pinned_tabs_title")
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.sync,
        label: browser.i18n.getMessage("sync_pinned_tabs"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("private_window_title")
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.sync,
        label: browser.i18n.getMessage("new_private_window"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.removeOnClose,
        label: browser.i18n.getMessage("close_private_window"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-removeOnClose",
      }),
    ]);
  },

});
