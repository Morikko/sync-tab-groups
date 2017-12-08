/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const GroupList = React.createClass({
  propTypes: {
    groups: React.PropTypes.object.isRequired,
    options: React.PropTypes.object.isRequired,
    currentWindowId: React.PropTypes.number,
    delayedTasks: React.PropTypes.object,
    onGroupAddClick: React.PropTypes.func,
    onGroupAddDrop: React.PropTypes.func,
    onMoveTabToNewGroup: React.PropTypes.func,
    onGroupClick: React.PropTypes.func,
    onGroupDrop: React.PropTypes.func,
    onGroupCloseClick: React.PropTypes.func,
    onGroupRemoveClick: React.PropTypes.func,
    onGroupTitleChange: React.PropTypes.func,
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    onOpenInNewWindowClick: React.PropTypes.func,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
    currentlySearching: React.PropTypes.bool,
    searchGroupResult: React.PropTypes.object,
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
    let groupListClasses = classNames({
      "group-list": true,
    });

    let groups = [];
    let sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
    for (let index of sortedIndex) {
      groups.push(
        React.createElement(Group, {
          key: this.props.groups[index].id,
          group: this.props.groups[index],
          currentWindowId: this.props.currentWindowId,
          currentlyClosing: this.isCurrently(TaskManager.CLOSE_REFERENCE, this.props.groups[index].id),
          currentlyRemoving: this.isCurrently(TaskManager.REMOVE_REFERENCE, this.props.groups[index].id),
          onGroupClick: this.props.onGroupClick,
          onGroupDrop: this.props.onGroupDrop,
          onMoveTabToNewGroup: this.props.onMoveTabToNewGroup,
          onGroupCloseClick: this.props.onGroupCloseClick,
          onGroupRemoveClick: this.props.onGroupRemoveClick,
          onGroupTitleChange: this.props.onGroupTitleChange,
          onTabClick: this.props.onTabClick,
          onTabDrag: this.props.onTabDrag,
          onTabDragStart: this.props.onTabDragStart,
          onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
          onCloseTab: this.props.onCloseTab,
          onOpenTab: this.props.onOpenTab,
          searchGroupResult: this.props.searchGroupsResults[index] || [], // For init
          currentlySearching: this.props.currentlySearching,
          showTabsNumber: this.props.options.popup.showTabsNumber,
          groups: this.props.groups,
        }));
    }

    return React.DOM.ul({
        className: groupListClasses
      },
      groups
    );
  },
});
