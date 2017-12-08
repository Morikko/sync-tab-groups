/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/

const PopupMenu = (() => {
  const PopupMenuStandalone = React.createClass({
    propTypes: {
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
      let searchResults = this.applySearch('');
      return {
        searchfilter: '',
        maximized: this.props.options.popup.maximized,
        searchGroupsResults: searchResults.searchGroupsResults,
        atLeastOneResult: searchResults.atLeastOneResult,
      };
    },

    // When a component got new props, use this to update
    componentWillReceiveProps: function(nextProps) {
      // In case of change in groups
      let searchResults = this.applySearch(this.state.searchfilter);
      this.setState({
        maximized: nextProps.options.popup.maximized,
        searchGroupsResults: searchResults.searchGroupsResults,
        atLeastOneResult: searchResults.atLeastOneResult,
      });
    },

    render: function() {
      let isWindowSync = false;

      let searchbar = [];
      if (this.props.options.popup.showSearchBar) {
        searchbar.push(
          React.createElement(SearchBar, {
            onSearchChange: this.onSearchChange,
          }));
      }

      for (let i = 0; i < this.props.groups.length; i++) {
        if (this.props.groups[i].windowId === this.props.currentWindowId) {
          isWindowSync = true;
        }
      }

      let menuClasses = classNames({
        "menu-maximized": this.state.maximized,
        "menu-minimized": !this.state.maximized,
      });

      return React.DOM.ul({
          className: menuClasses
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
        React.createElement(GroupList, {
          groups: this.props.groups,
          options: this.props.options,
          currentWindowId: this.props.currentWindowId,
          delayedTasks: this.props.delayedTasks,
          onGroupClick: this.props.onGroupClick,
          onGroupDrop: this.props.onGroupDrop,
          onMoveTabToNewGroup: this.props.onGroupAddDrop,
          onGroupCloseClick: this.props.onGroupCloseClick,
          onGroupRemoveClick: this.props.onGroupRemoveClick,
          onGroupTitleChange: this.props.onGroupTitleChange,
          onTabClick: this.props.onTabClick,
          onTabDrag: this.props.onTabDrag,
          onTabDragStart: this.props.onTabDragStart,
          onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
          onCloseTab: this.props.onCloseTab,
          onOpenTab: this.props.onOpenTab,
          searchGroupsResults: this.state.searchGroupsResults,
          currentlySearching: this.state.searchfilter.length > 0,
        }),
        React.createElement(
          GroupAddButton, {
            onClick: this.props.onGroupAddClick,
            onDrop: this.props.onGroupAddDrop,
            currentlySearching: this.state.searchfilter.length > 0,
          }
        ),
        React.DOM.li({
            className: "no-search-result" + (!this.state.atLeastOneResult ? "" : " hiddenBySearch")
          },
          'No search result for "' + this.state.searchfilter + '".')
      );
    },

    // Change window size
    onClickMaximize: function() {
      this.props.onOptionChange("popup-maximized", !this.state.maximized);
      this.setState({
        maximized: !this.state.maximized,
      });
    },

    onSearchChange: function(searchValue) {
      let searchResults = this.applySearch(searchValue);
      this.setState({
        searchfilter: searchValue,
        searchGroupsResults: searchResults.searchGroupsResults,
        atLeastOneResult: searchResults.atLeastOneResult,
      });

    },

    applySearch: function(searchValue) {
      let searchGroupsResults = [];
      let atLeastOneResult = searchValue.length === 0;

      // Apply search
      for (let i = 0; i < this.props.groups.length; i++) {
        searchGroupsResults[i] = {
          atLeastOneResult: false,
          searchTabsResults: [],
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
          }
        }
      }

      return {
        searchGroupsResults: searchGroupsResults,
        atLeastOneResult: atLeastOneResult,
      };
    },

    componentDidMount: function() {
      /* TODO: window not focus by default
      var body = document.querySelector('body');

      // Give the document focus
      window.focus();

      // Remove focus from any focused element
      if (document.activeElement) {
          document.activeElement.blur();
      }

      document.querySelector('#search-input').focus();

      body.onkeydown = function(e) {
        if (!e.metaKey) {
          e.preventDefault();
        }

        console.log("Key from body");

        // Add new group
        if (e.keyCode === 45) { // Insert
          document.querySelector('.addButton').click();
        }
        // From Tab: Up tab Or group if first
        // From Group: Up Group Or last tab
        if (e.keyCode === 38) { // Up
          document.querySelector('.addButton');
        }
        // From Tab: Down tab Or next group if last
        // From Group: Down Group or first tab
        if (e.keyCode === 40) { // Down
          document.querySelector('body');
        }
        // Only up group
        if (e.keyCode === 33) { // Page up
          document.querySelector('body');
        }

        // Only down group
        if (e.keyCode === 33) { // Page down
          document.querySelector('body');
        }

        // Go first group
        if (e.keyCode === 36) { // Home (First)
          document.querySelector('body');
        }

        // Go last group
        if (e.keyCode === 35) { // End
          document.querySelector('body');
        }

        // Focus the search bar
        if ( e.ctrlKey && e.keyCode === 70 ) { // Ctrl + F
          document.querySelector('#search-input').focus();
        }

      };
      */
    },

  });

  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(PopupMenuStandalone);
})();
