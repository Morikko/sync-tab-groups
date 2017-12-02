/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
        React.createElement(SearchBar, {
          onSearchChange: this.onSearchChange,
        }),
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
