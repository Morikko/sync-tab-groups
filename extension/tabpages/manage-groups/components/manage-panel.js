class ManagePanelStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchfilter: '',
      maximized: this.props.options.popup.maximized,
      searchGroupsResults: {} /*searchResults.searchGroupsResults*/
      , atLeastOneResult: true /*searchResults.atLeastOneResult*/
    };
    this.update = this.update.bind(this);
  }

  update() {
    this.forceUpdate();
  }

  componentDidMount() {
    window.addEventListener("resize", this.update);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.update);
  }

  render() {
    let width = this.props.singleMode ? window.innerWidth - 28 : window.innerWidth / 2 - 28;

    return React.createElement(
      "ul",
      { id: "manage-panel" },
      React.createElement(
        "li",
        { className: "group-lists" },
        React.createElement(
          "div",
          { className: classNames({
              "left-list": true,
              "half": !this.props.singleMode }) },
          React.createElement(
            "div",
            { className: "group-action left" },
            React.createElement("i", {
              className: "app-pref fa fa-fw fa-angle-double-down",
              title: browser.i18n.getMessage("expand_all_groups"),
              onClick: this.handleOpenAllExpand
            }),
            React.createElement("i", {
              className: "app-pref fa fa-fw fa-angle-double-up",
              title: browser.i18n.getMessage("reduce_all_groups"),
              onClick: this.handleCloseAllExpand
            }),
            React.createElement(SearchBar, {
              onSearchChange: this.onSearchLeftChange.bind(this) })
          ),
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
            stateless: true,
            width: width
          })
        ),
        React.createElement(
          "div",
          { className: classNames({
              "right-list": true,
              "half": true,
              "invisible": this.props.singleMode }) },
          React.createElement(
            "div",
            { className: "group-action right" },
            React.createElement(SearchBar, {
              onSearchChange: this.onSearchRightChange.bind(this) }),
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
            stateless: true,
            width: width
          })
        )
      ),
      React.createElement(
        "li",
        null,
        React.createElement(
          "div",
          { className: "belowActions" },
          React.createElement(GroupAddButton, {
            onClick: this.props.onGroupAddClick,
            onDrop: this.props.onGroupAddDrop,
            currentlySearching: false
          })
        )
      )
    );
  }

  onSearchLeftChange(searchValue) {

    /*
    let searchResults = this.applySearch(searchValue);
    this.setState({
      searchfilter: searchValue,
      searchGroupsResults: searchResults.searchGroupsResults,
      atLeastOneResult: searchResults.atLeastOneResult,
    });
    */
  }

  onSearchRightChange(searchValue) {
    /*
    let searchResults = this.applySearch(searchValue);
    this.setState({
      searchfilter: searchValue,
      searchGroupsResults: searchResults.searchGroupsResults,
      atLeastOneResult: searchResults.atLeastOneResult,
    });
    */
  }

  applySearch(searchValue) {
    if (searchValue.length === 0) {
      // TODO Improve this redundent
      var context = document.querySelectorAll(".group-title, .tab-title");
      var instance = new Mark(context);
      instance.unmark({
        "element": "span",
        "className": "highlight"
      });
      return {
        searchGroupsResults: [],
        atLeastOneResult: true
      };
    }

    let searchGroupsResults = [];
    let atLeastOneResult = searchValue.length === 0;

    // Apply search
    for (let i = 0; i < this.props.groups.length; i++) {
      searchGroupsResults[i] = {
        atLeastOneResult: false,
        searchTabsResults: []
      };
      // Search in group title
      if (Utils.search(this.props.groups[i].title, searchValue)) {
        searchGroupsResults[i].atLeastOneResult = true;
        atLeastOneResult = true;
      }

      for (let j = 0; j < this.props.groups[i].tabs.length; j++) {
        // Search in tab title
        if (Utils.search(this.props.groups[i].tabs[j].title, searchValue)) {
          searchGroupsResults[i].atLeastOneResult = true;
          searchGroupsResults[i].searchTabsResults[j] = true;
          atLeastOneResult = true;
        } else {
          searchGroupsResults[i].searchTabsResults[j] = false;
        }
      }
    }

    var context = document.querySelectorAll(".group-title, .tab-title");
    var instance = new Mark(context);
    instance.unmark({
      "element": "span",
      "className": "highlight",
      done() {
        instance.mark(searchValue.split(' '), {
          "element": "span",
          "className": "highlight"
        });
      }
    });

    return {
      searchGroupsResults: searchGroupsResults,
      atLeastOneResult: atLeastOneResult
    };
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