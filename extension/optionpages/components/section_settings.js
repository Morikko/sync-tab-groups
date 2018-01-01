const SettingsSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    selected: React.PropTypes.string
  },

  prefix: "groups",

  componentWillReceiveProps: function (nextProps) {
    this.setState({});
  },

  render: function () {
    return React.createElement(
      "div",
      {
        className: "option-section " + (this.props.selected === "settings" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        "Settings"
      ),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("group_title")
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.groups.syncNewWindow,
        label: browser.i18n.getMessage("new_window"),
        onCheckChange: this.props.onOptionChange,
        id: "groups-syncNewWindow"
      }),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("pinned_tabs_title")
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.pinnedTab.sync,
        label: browser.i18n.getMessage("sync_pinned_tabs"),
        onCheckChange: this.props.onOptionChange,
        id: "pinnedTab-sync"
      }),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("private_window_title")
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.privateWindow.sync,
        label: browser.i18n.getMessage("new_private_window"),
        onCheckChange: this.props.onOptionChange,
        id: "privateWindow-sync"
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.privateWindow.removeOnClose,
        label: browser.i18n.getMessage("close_private_window"),
        onCheckChange: this.props.onOptionChange,
        id: "privateWindow-removeOnClose"
      }),
      React.createElement(
        "h2",
        null,
        "Others"
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.groups.removeEmptyGroup,
        label: browser.i18n.getMessage("remove_empty_groups"),
        onCheckChange: this.props.onOptionChange,
        id: "groups-removeEmptyGroup"
      })
    );
  }

});