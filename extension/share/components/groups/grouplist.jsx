/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
class GroupList extends React.Component{
  // Return if an action (close/remove) is pending on groupId
  isCurrently(action, groupId) {
    if (this.props.delayedTasks[action] !== undefined) {
      return this.props.delayedTasks[action].delayedTasks[groupId] !== undefined;
    } else {
      return false;
    }
  }

  render() {
    let groupListClasses = classNames({
      "group-list": true,
    });

    let groups = [];
    let sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
    for (let index of sortedIndex) {
      groups.push(
        <Group
          key= {this.props.groups[index].id}
          group= {this.props.groups[index]}
          currentWindowId= {this.props.currentWindowId}
          currentlyClosing= {this.isCurrently(TaskManager.CLOSE_REFERENCE, this.props.groups[index].id)}
          currentlyRemoving= {this.isCurrently(TaskManager.REMOVE_REFERENCE, this.props.groups[index].id)}
          onGroupClick= {this.props.onGroupClick}
          onGroupDrop= {this.props.onGroupDrop}
          onMoveTabToNewGroup= {this.props.onMoveTabToNewGroup}
          onGroupCloseClick= {this.props.onGroupCloseClick}
          onGroupRemoveClick= {this.props.onGroupRemoveClick}
          onGroupTitleChange= {this.props.onGroupTitleChange}
          onTabClick= {this.props.onTabClick}
          onOpenInNewWindowClick= {this.props.onOpenInNewWindowClick}
          onCloseTab= {this.props.onCloseTab}
          onOpenTab= {this.props.onOpenTab}
          searchGroupResult= {this.props.searchGroupsResults[index] || {}}
          currentlySearching= {this.props.currentlySearching}
          showTabsNumber= {this.props.options.popup.showTabsNumber}
          groups= {this.props.groups}
          groupDraggable= {this.props.options.groups.sortingType === OptionManager.SORT_CUSTOM}
          onGroupChangePosition= {this.props.onGroupChangePosition}
          onChangePinState= {this.props.onChangePinState}
          onChangeExpand= {this.props.onChangeExpand}
          allowClickSwitch={this.props.allowClickSwitch}
        />);
    }

    return (<ul className={groupListClasses}>
              {groups}
            </ul>);
  }
};

GroupList.propTypes = {
  groups: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  currentWindowId: PropTypes.number,
  delayedTasks: PropTypes.object,
  onGroupAddClick: PropTypes.func,
  onGroupAddDrop: PropTypes.func,
  onMoveTabToNewGroup: PropTypes.func,
  onGroupClick: PropTypes.func,
  onGroupDrop: PropTypes.func,
  onGroupCloseClick: PropTypes.func,
  onGroupRemoveClick: PropTypes.func,
  onGroupTitleChange: PropTypes.func,
  onTabClick: PropTypes.func,
  onOpenInNewWindowClick: PropTypes.func,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  currentlySearching: PropTypes.bool,
  searchGroupResult: PropTypes.object,
  onGroupChangePosition: PropTypes.func,
  onChangePinState: PropTypes.func,
  onChangeExpand: PropTypes.func,
  allowClickSwitch: PropTypes.bool,
}
