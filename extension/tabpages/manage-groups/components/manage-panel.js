class ManagePanelStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchfilter: '',
      maximized: this.props.options.popup.maximized,
      searchGroupsResults: {} /*searchResults.searchGroupsResults*/
      , atLeastOneResult: true /*searchResults.atLeastOneResult*/
    };
  }

  render() {
    return React.createElement(
      "ul",
      { id: "manage-panel" },
      React.createElement(
        "li",
        null,
        React.createElement(
          "div",
          { className: classNames({
              "left-list": true,
              "half": !this.props.singleMode }) },
          React.createElement(GroupList
          /*** Functions ***/
          , { onMoveTabToNewGroup: this.props.onGroupAddDrop,
            onGroupCloseClick: this.props.onGroupCloseClick,
            onGroupRemoveClick: this.props.onGroupRemoveClick,
            onGroupTitleChange: this.props.onGroupTitleChange,
            onTabClick: this.props.onTabClick,
            onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            onGroupClick: this.props.onGroupClick,
            onGroupDrop: this.props.onGroupDrop,
            onGroupChangePosition: this.props.onGroupChangePosition,
            onChangePinState: this.props.onChangePinState,
            onChangeExpand: this.props.onChangeExpand
            /*** Data ***/
            , groups: this.props.groups,
            options: this.props.options,
            currentWindowId: this.props.currentWindowId,
            delayedTasks: this.props.delayedTasks
            /*** Options ***/
            , searchGroupsResults: this.state.searchGroupsResults,
            currentlySearching: this.state.searchfilter.length > 0,
            allowClickSwitch: false,
            stateless: true
          })
        ),
        React.createElement(
          "div",
          { className: classNames({
              "right-list": true,
              "half": true,
              "invisible": this.props.singleMode }) },
          React.createElement(GroupList
          /*** Functions ***/
          , { onMoveTabToNewGroup: this.props.onGroupAddDrop,
            onGroupCloseClick: this.props.onGroupCloseClick,
            onGroupRemoveClick: this.props.onGroupRemoveClick,
            onGroupTitleChange: this.props.onGroupTitleChange,
            onTabClick: this.props.onTabClick,
            onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            onGroupClick: this.props.onGroupClick,
            onGroupDrop: this.props.onGroupDrop,
            onGroupChangePosition: this.props.onGroupChangePosition,
            onChangePinState: this.props.onChangePinState,
            onChangeExpand: this.props.onChangeExpand
            /*** Data ***/
            , groups: this.props.groups,
            options: this.props.options,
            currentWindowId: this.props.currentWindowId,
            delayedTasks: this.props.delayedTasks
            /*** Options ***/
            , searchGroupsResults: this.state.searchGroupsResults,
            currentlySearching: this.state.searchfilter.length > 0,
            allowClickSwitch: false,
            stateless: true
          })
        )
      ),
      React.createElement(
        "li",
        null,
        React.createElement(
          "div",
          { className: "belowActions" },
          React.createElement(
            "div",
            { className: "left" },
            React.createElement("i", {
              className: "app-pref fa fa-fw fa-angle-double-down",
              title: browser.i18n.getMessage("expand_all_groups"),
              onClick: this.handleOpenAllExpand
            }),
            React.createElement("i", {
              className: "app-pref fa fa-fw fa-angle-double-up",
              title: browser.i18n.getMessage("reduce_all_groups"),
              onClick: this.handleCloseAllExpand
            })
          ),
          React.createElement(
            "div",
            { className: classNames({
                "center": true
              }) },
            React.createElement(GroupAddButton, {
              onClick: this.props.onGroupAddClick,
              onDrop: this.props.onGroupAddDrop,
              currentlySearching: false
            })
          ),
          React.createElement(
            "div",
            { className: classNames({
                "right": true,
                "invisible": this.props.singleMode }) },
            React.createElement("i", {
              className: "app-pref fa fa-fw fa-angle-double-down",
              title: browser.i18n.getMessage("expand_all_groups"),
              onClick: this.handleOpenAllExpand
            }),
            React.createElement("i", {
              className: "app-pref fa fa-fw fa-angle-double-up",
              title: browser.i18n.getMessage("reduce_all_groups"),
              onClick: this.handleCloseAllExpand
            })
          )
        )
      )
    );
  }
}

const ManagePanel = (() => {
  return ReactRedux.connect(state => {
    return {
      groups: state.get("tabgroups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(ManagePanelStandAlone);
})();