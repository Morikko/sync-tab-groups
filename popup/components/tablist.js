/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const TabList = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    tabs: React.PropTypes.array.isRequired,
    opened: React.PropTypes.bool.isRequired,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
    onGroupDrop: React.PropTypes.func,
    onMoveTabToNewGroup: React.PropTypes.func,
    searchTabsResults: React.PropTypes.object,
    groups: React.PropTypes.object,
    onChangePinState: React.PropTypes.func,
  },

  render: function() {
    return (
      React.DOM.ul({
          className: "tab-list"
        },
        this.props.tabs.map((tab, index) => {
          return React.createElement(Tab, {
            key: index,
            group: this.props.group,
            tabIndex: index,
            tab: tab,
            onTabClick: this.props.onTabClick,
            onGroupDrop: this.props.onGroupDrop,
            onMoveTabToNewGroup: this.props.onMoveTabToNewGroup,
            opened: this.props.opened,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            searchTabResult: this.props.searchTabsResults[index]||[],
            groups: this.props.groups,
            onChangePinState: this.props.onChangePinState,
          });
        })
      )
    );
  }
});
