/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    propTypes: {
      groups: React.PropTypes.object.isRequired,
      onGroupAddClick: React.PropTypes.func,
      onGroupAddDrop: React.PropTypes.func,
      onGroupClick: React.PropTypes.func,
      onGroupDrop: React.PropTypes.func,
      onGroupCloseClick: React.PropTypes.func,
      onGroupRemoveClick: React.PropTypes.func,
      onGroupTitleChange: React.PropTypes.func,
      onTabClick: React.PropTypes.func,
      onTabDrag: React.PropTypes.func,
      onTabDragStart: React.PropTypes.func,
      onOpenInNewWindowClick: React.PropTypes.func,
      onChangeWindowSync: React.PropTypes.func,
      onClickPref: React.PropTypes.func,
      onCloseTab: React.PropTypes.func,
      onOpenTab: React.PropTypes.func,
      onOptionChange: React.PropTypes.func,
    },

    getInitialState: function() {
      return {
        searchfilter: '',
        maximized: this.props.options.popup.maximized,
      };
    },

    // When a component got new props, use this to update
    componentWillReceiveProps: function(nextProps) {
      this.setState({
        maximized: nextProps.options.popup.maximized,
      });
    },

    // Return if an action (close/remove) is pending on groupId
    isCurrently: function(action, groupId) {
      if (this.props.delayedTasks[action] !== undefined) {
        return this.props.delayedTasks[action].delayedTasks[groupId] !== undefined;
      } else {
        return false;
      }
    },

    render: function() {
      let isWindowSync = false;
      let searchGroupsResults = [];
      let atLeastOneResult = this.state.searchfilter.length === 0;

      // Apply search
      for (let i = 0; i < this.props.groups.length; i++) {
        if (this.props.groups[i].windowId === this.props.currentWindowId) {
          isWindowSync = true;
        }
        searchGroupsResults[i] = {
          atLeastOneResult: false,
          searchTabsResults: [],
        };
        // Search in group title
        if (Utils.search(this.props.groups[i].title, this.state.searchfilter)) {
          searchGroupsResults[i].atLeastOneResult = true;
          atLeastOneResult = true;
        }

        for (let j = 0; j < this.props.groups[i].tabs.length; j++) {
          // Search in tab title
          if (Utils.search(this.props.groups[i].tabs[j].title, this.state.searchfilter)) {
            searchGroupsResults[i].atLeastOneResult = true;
            searchGroupsResults[i].searchTabsResults[j] = true;
            atLeastOneResult = true;
          }
        }
      }

      let mainClasses = classNames({
        "group-list": true,
        "menu-maximized": this.state.maximized,
        "menu-minimized": !this.state.maximized,
      });

      let searchbar = [];
      if (this.props.options.popup.showSearchBar) {
        searchbar.push(
          React.createElement(SearchBar, {
            onSearchChange: this.onSearchChange,
          }));
      }

      return React.DOM.ul({
          className: mainClasses
        },
        React.createElement(MainBar, {
          onChangeWindowSync: this.props.onChangeWindowSync,
          onClickPref: this.props.onClickPref,
          isSync: isWindowSync,
          currentWindowId: this.props.currentWindowId,
          maximized: this.state.maximized,
          onClickMaximize: this.onClickMaximize,
        }),
        searchbar,
        this.props.groups.map((group, index) => {
          return React.createElement(Group, {
            key: group.id,
            group: group,
            currentWindowId: this.props.currentWindowId,
            currentlyClosing: this.isCurrently(TaskManager.CLOSE_REFERENCE, group.id),
            currentlyRemoving: this.isCurrently(TaskManager.REMOVE_REFERENCE, group.id),
            onGroupClick: this.props.onGroupClick,
            onGroupDrop: this.props.onGroupDrop,
            onGroupCloseClick: this.props.onGroupCloseClick,
            onGroupRemoveClick: this.props.onGroupRemoveClick,
            onGroupTitleChange: this.props.onGroupTitleChange,
            onTabClick: this.props.onTabClick,
            onTabDrag: this.props.onTabDrag,
            onTabDragStart: this.props.onTabDragStart,
            onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            searchGroupResult: searchGroupsResults[index],
            currentlySearching: this.state.searchfilter.length > 0,
            showTabsNumber: this.props.options.popup.showTabsNumber,
          });
        }),
        React.createElement(
          GroupAddButton, {
            onClick: this.props.onGroupAddClick,
            onDrop: this.props.onGroupAddDrop,
            currentlySearching: this.state.searchfilter.length > 0,
          }
        ),
        React.DOM.li({
            className: "no-search-result" + (!atLeastOneResult ? "" : " hiddenBySearch")
          },
          'No search result for "' + this.state.searchfilter + '".')
      );
    },

    onSearchChange: function(searchValue) {
      this.setState({
        searchfilter: searchValue
      });
    },

    onClickMaximize: function() {
      this.props.onOptionChange("popup-maximized", !this.state.maximized);
      this.setState({
        maximized: !this.state.maximized,
      });
    }
  });

  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(GroupListStandalone);
})();
