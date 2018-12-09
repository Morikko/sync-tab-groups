import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Utils from '../../../background/utils/utils'
import TASKMANAGER_CONSTANTS from '../../../background/utils/TASKMANAGER_CONSTANTS'

import GroupControls from './groupcontrols'
import TabList from './tablist'
import NiceCheckbox from '../forms/nicecheckbox'
import {
  Navigation,
  groupNavigationListener,
} from './wrapper/navigation'
import sharedVariable from './sharedVariable'
import GroupTitle from './GroupTitle';

class Group extends React.Component {
  constructor(props) {
    super(props);
    let openWindow = this.props.group.windowId !== browser.windows.WINDOW_ID_NONE;
    this.state = {
      // Removing is more priority
      closing: this.getClosingState(openWindow, this.props),
      removing: this.props.currentlyRemoving,
      editing: false,
      currentlySearching: this.props.currentlySearching,
      expanded: this.props.stateless ?
        false : this.props.group.expand,
      opened: openWindow,
      draggingOverCounter: 0, // Many drag enter/leave are fired, know if it is a really entering
      draggingOver: false,
      dragOnTop: false,
      dragOnBottom: false,
      waitFirstMount: false,
      hasFocus: false,
    };

    this.handleOpenInNewWindowClick = this.handleOpenInNewWindowClick.bind(this);
    this.handleGroupRemoveClick = this.handleGroupRemoveClick.bind(this);
    this.handleGroupCloseClick = this.handleGroupCloseClick.bind(this);
    this.handleGroupCloseAbortClick = this.handleGroupCloseAbortClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
    this.handleGroupEditClick = this.handleGroupEditClick.bind(this);
    this.handleGroupExpandClick = this.handleGroupExpandClick.bind(this);
    this.handleGroupDrop = this.handleGroupDrop.bind(this);
    this.handleGroupDragOver = this.handleGroupDragOver.bind(this);
    this.handleGroupDragEnter = this.handleGroupDragEnter.bind(this);
    this.handleGroupDragLeave = this.handleGroupDragLeave.bind(this);
    this.handleGroupDragStart = this.handleGroupDragStart.bind(this);
  }

  getClosingState(openWindow, props) {
    let closingState;
    if (openWindow) {
      closingState = props.currentlyClosing && !props.currentlyRemoving;
    } else {
      closingState = false;
    }
    return closingState;
  }

  findExpandedState(current_state, current_searching) {
    if (this.props.forceExpand) {
      return true;
    }
    if (this.props.forceReduce) {
      return false;
    }
    if (current_searching) {
      return true;
    } else {
      if (this.props.stateless)
        return this.state.expanded
      else
        return current_state;
    }
  }

  // When a component got new props, use this to update
  UNSAFE_componentWillReceiveProps(nextProps) {
    let openWindow = nextProps.group.windowId !== browser.windows.WINDOW_ID_NONE;
    let expanded_state = this.findExpandedState(nextProps.group.expand, nextProps.currentlySearching);

    this.setState({
      closing: this.getClosingState(openWindow, nextProps),
      removing: nextProps.currentlyRemoving,
      opened: openWindow,
      expanded: expanded_state,
      currentlySearching: nextProps.currentlySearching,
    });
  }

  componentDidMount() {
    if (!this.state.waitFirstMount) {
      this.differedTimeOut = setTimeout((() => {
        this.setState({
          waitFirstMount: true,
        });
      })
        .bind(this), 0);
    }
  }

  componentWillUnmount() {
    if (this.differedTimeOut) {
      clearTimeout(this.differedTimeOut);
    }
    if (this.expandedTimeOut) {
      clearTimeout(this.expandedTimeOut);
    }
  }

  getTitleElement() {
    return (
      <GroupTitle
        editing={this.state.editing}
        group={this.props.group}
        showTabsNumber={this.props.showTabsNumber}
        setEditing={(editing) => this.setState({editing})}
        defaultName={Utils.getGroupTitle(this.props.group)}
        onGroupTitleChange={this.props.onGroupTitleChange}
      />
    )
  }

  getGroupClasses() {
    let groupInWindow = this.props.selectionFilter !== undefined
      ? false
      : (this.props.currentWindowId === this.props.group.windowId);

    let isOpen = this.props.selectionFilter !== undefined
      ? this.props.selectionFilter.selected
      : (this.props.group.windowId > -1);
    return classNames({
      hasFocus: this.state.hasFocus,
      hoverStyle: this.props.hoverStyle,
      active: isOpen,
      editing: this.state.editing,
      closing: this.state.closing,
      removing: this.state.removing,
      draggingOver: this.state.draggingOver,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
      expanded: this.state.expanded,
      focusGroup: groupInWindow,
      group: true,
      hiddenBySearch: !(
        this.props.searchGroupResult ?
          this.props.searchGroupResult.atLeastOneResult :
          true),
      incognito: this.props.group.incognito,
    });
  }

  getGroupTitle() {
    let groupTitle;
    if (Utils.DEBUG_MODE) {
      const groupWithoutTabs = Utils.getCopy(this.props.group);
      groupWithoutTabs.tabs =  groupWithoutTabs.tabs.length + " tabs"
      groupTitle = JSON.stringify(groupWithoutTabs, null, 4);
    } else {
      groupTitle = browser.i18n.getMessage("open_group");
    }
    return groupTitle;
  }

  getGroupControls() {
    return (
      <GroupControls
        closing={this.state.closing}
        removing={this.state.removing}
        editing={this.state.editing}
        expanded={this.state.expanded}
        opened={this.state.opened}
        onClose={this.handleGroupCloseClick}
        onRemove={this.handleGroupRemoveClick}
        onEdit={this.handleGroupEditClick}
        onExpand={this.handleGroupExpandClick}
        onUndoCloseClick={this.handleGroupCloseAbortClick}
        onOpenInNewWindow={this.handleOpenInNewWindowClick}
        controlsEnable={this.props.controlsEnable}
        onRemoveHiddenTabsInGroup={this.props.onRemoveHiddenTabsInGroup}
        hasHiddenTabs={this.props.group.tabs.filter(tab => tab.hidden).length > 0}
        groupId={this.props.group.id}
      />
    );
  }

  getTabList() {
    let selectionFilter = this.props.selectionFilter !== undefined
      ? this.props.selectionFilter.tabs
      : undefined;
    return (
      <TabList
        tabs={this.props.group.tabs}
        group={this.props.group}
        onTabClick={this.props.onTabClick}
        onGroupDrop={this.props.onGroupDrop}
        onMoveTabToNewGroup={this.props.onMoveTabToNewGroup}
        opened={this.state.opened}
        onCloseTab={this.props.onCloseTab}
        onOpenTab={this.props.onOpenTab}
        onRemoveHiddenTab={this.props.onRemoveHiddenTab}
        searchTabsResults={(
          this.props.searchGroupResult
            ? this.props.searchGroupResult.searchTabsResults
            : undefined)}
        groups={this.props.groups}
        onChangePinState={this.props.onChangePinState}
        visible={this.state.expanded}
        allowClickSwitch={this.props.allowClickSwitch}
        hotkeysEnable={this.props.hotkeysEnable}
        selectionFilter={selectionFilter}
        hoverStyle={this.props.hoverStyle}
        controlsEnable={this.props.controlsEnable}
        draggable={this.props.draggable}
      />
    );
  }

  render() {
    const checkbox = this.props.selectionFilter !== undefined
      ? (
        <NiceCheckbox
          checked= {
            this.props.selectionFilter.selected===this.props.group.tabs.length
            && this.props.selectionFilter.selected > 0
          }
          onCheckChange= {()=>{
            this.props.onGroupClick(
              this.props.group.id,
              this.props.selectionFilter.selected
            );
          }}
          label= {""}
          indeterminate={this.props.selectionFilter.selected>0
            && this.props.selectionFilter.selected
          !==this.props.group.tabs.length}
          id={"selected-group-"+this.props.group.id}
          disabled={this.props.group.tabs.length===0}
        />
      )
      : null;

    const onKeyDownListener = this.props.hotkeysEnable
      ? Utils.doActivateHotkeys(groupNavigationListener(this), this.props.hotkeysEnable)
      : undefined;

    const onFocusEvent = (e)=>{
      if ((typeof Navigation !== 'undefined')
      && Navigation["KEY_PRESSED_RECENTLY"]) {
        this.setState({
          hasFocus: true,
        })
      }
    };

    const onBlurEvent = (e)=>{
      this.setState({
        hasFocus: false,
      })
    };

    const groupStyle = {
      width: this.props.width,
    };

    const tabList = this.state.waitFirstMount && this.state.expanded
      ? this.getTabList()
      : null;

    const hasFocusIcon = this.state.hasFocus
      ? (
        <i className="arrow-focus fa fa-fw fa-angle-right"></i>
      ) : null;


    const openedIcon = (this.state.opened && this.props.selectionFilter == null)
      ? (
        <span className="window-open">
        OPEN
        </span>
      )
      : null;

    return (
      <li
        className={this.getGroupClasses()}
        onMouseUp={this.handleGroupClick}
        draggable={this.props.groupDraggable && this.props.draggable}
        onDragOver={this.handleGroupDragOver}
        onDragEnter={this.handleGroupDragEnter}
        onDragLeave={this.handleGroupDragLeave}
        onDragStart={this.handleGroupDragStart}
        onDrop={this.handleGroupDrop}
        title={this.getGroupTitle()}
        style={groupStyle}
        onFocus={onFocusEvent}
        onBlur={onBlurEvent}
        tabIndex="0"
        onKeyDown={onKeyDownListener}
      >

        <span className={"group-title"}>
          {checkbox}
          {openedIcon}
          {hasFocusIcon}
          {this.getTitleElement()}
          {this.getGroupControls()}
        </span>

        {tabList}

      </li>);
  }

  handleOpenInNewWindowClick(event) {
    if (event) {
      event.stopPropagation();
    }
    this.props.onOpenInNewWindowClick(this.props.group.id);
  }

  handleGroupRemoveClick(event) {
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      editing: false,
      closing: false,
    });

    // Already click once, do it now
    if (this.state.removing) {
      this.setState({
        removing: false,
      });
      this.props.onGroupRemoveClick(TASKMANAGER_CONSTANTS.FORCE, this.props.group.id);
      // Delayed close
    } else {
      this.setState({
        removing: true,
      });
      this.props.onGroupRemoveClick(TASKMANAGER_CONSTANTS.ASK, this.props.group.id);
    }

  }

  handleGroupCloseClick(event) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.state.opened) {
      return;
    }

    this.setState({
      editing: false,
      removing: false,
    });

    // Already click once, do it now
    if (this.state.closing) {
      this.setState({
        closing: false,
      });
      this.props.onGroupCloseClick(TASKMANAGER_CONSTANTS.FORCE, this.props.group.id);
      // Delayed close
    } else {
      this.setState({
        closing: true,
      });
      this.props.onGroupCloseClick(TASKMANAGER_CONSTANTS.ASK, this.props.group.id);
    }

  }

  handleGroupCloseAbortClick(event) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.state.removing && !this.state.closing) {
      return;
    }

    this.props.onGroupCloseClick(TASKMANAGER_CONSTANTS.CANCEL, this.props.group.id);
    this.props.onGroupRemoveClick(TASKMANAGER_CONSTANTS.CANCEL, this.props.group.id);

    this.setState({
      closing: false,
      removing: false,
    });
  }

  handleGroupClick(event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.state.closing || this.state.removing) {
      return;
    }

    if (this.props.allowClickSwitch) {
      if (this.props.currentWindowId !== this.props.group.windowId) {
        // Close and middle click
        if (event && event.button === 1 && this.props.group.windowId === browser.windows.WINDOW_ID_NONE) {
          this.props.onOpenInNewWindowClick(this.props.group.id);
        } else {
          this.props.onGroupClick(this.props.group.id);
        }
      }
      window.close();
    } else if (event && event.button === 1 && this.props.selectionFilter) {
      this.props.onGroupClick(
        this.props.group.id,
        this.props.selectionFilter.selected
      );
    } else {
      this.handleGroupExpandClick();
    }
  }

  handleGroupEditClick(event) {
    if (event) {
      event.stopPropagation();
    }

    if (this.state.editing) { // Useless
      return;
    }

    this.setState({
      editing: true,
    });
  }

  handleGroupExpandClick(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.props.stateless) {
      this.props.onChangeExpand([this.props.group.id], !this.state.expanded)
    }
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  handleGroupDrop(event) {
    event.stopPropagation();

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
      draggingOver: false,
      draggingOverCounter: 0,
    });
    if (this.expandedTimeOut >= 0) {
      clearTimeout(this.expandedTimeOut);
    }

    if (event.dataTransfer.getData("type") === "tab") {

      let sourceGroup = parseInt(event.dataTransfer.getData("tab/group"), 10);
      let tabIndex = parseInt(event.dataTransfer.getData("tab/index"), 10);

      // Push at the end of the group
      this.props.onGroupDrop(sourceGroup, tabIndex, this.props.group.id);
    }

    if (event.dataTransfer.getData("type") === "group") {
      let position = -1;
      if (this.state.dragOnTop) {
        position = this.props.group.position;
      }
      if (this.state.dragOnBottom) {
        position = this.props.group.position + 1;
      }

      this.props.onGroupChangePosition(parseInt(event.dataTransfer.getData("group/id"), 10), position,);
    }
  }

  handleGroupDragOver(event) {
    event.stopPropagation();
    event.preventDefault();

    if (sharedVariable.dragType === "group") {
      // Position of main group-list
      let pos = event.pageY - /*Event loc Full page*/
                  Utils.getOffset(event.currentTarget);

      let height = event.currentTarget.offsetHeight;

      // Bottom
      if (pos > height / 2 && pos <= height) {
        if (this.state.dragOnTop || !this.state.dragOnBottom) {
          this.setState({
            dragOnTop: false,
            dragOnBottom: true,
          });
        }
      } else
      if (pos <= height / 2 && pos > 0) {
        if (!this.state.dragOnTop || this.state.dragOnBottom) {
          this.setState({
            dragOnTop: true,
            dragOnBottom: false,
          });
        }
      } else {
        if (this.state.dragOnTop || this.state.dragOnBottom) {
          this.setState({
            dragOnTop: false,
            dragOnBottom: false,
          });
        }
      }
    }
    if (sharedVariable.dragType === "tab") {
      this.setState({
        draggingOver: true,
      });
    }
  }

  handleGroupDragEnter(event) {
    event.preventDefault();

    if (sharedVariable.dragType === "tab" && event.target.className.includes("group")) {
      event.stopPropagation();

      this.setState({
        draggingOverCounter: (this.state.draggingOverCounter === 1) ?
          2 : 1,
      });

      if (this.state.draggingOverCounter === 0) {
        this.expandedTimeOut = setTimeout(() => {
          this.setState({
            expanded: true,
          });
        }, 1500);
      }
    }
  }

  handleGroupDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
      draggingOver: false,
      draggingOverCounter: this.state.draggingOverCounter === 2 ?
        1 : 0,
    });
    if (this.state.draggingOverCounter === 1 && this.expandedTimeOut >= 0) {
      clearTimeout(this.expandedTimeOut);
    }
  }

  handleGroupDragStart(event) {
    event.stopPropagation();

    sharedVariable.dragType = "group";

    event.dataTransfer.setData("type", "group");
    event.dataTransfer.setData("group/id", this.props.group.id);
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
  currentWindowId: PropTypes.number,
  currentlyClosing: PropTypes.bool.isRequired,
  currentlyRemoving: PropTypes.bool.isRequired,
  onGroupClick: PropTypes.func,
  onGroupDrop: PropTypes.func,
  onGroupCloseClick: PropTypes.func,
  onGroupRemoveClick: PropTypes.func,
  onGroupTitleChange: PropTypes.func,
  onTabClick: PropTypes.func,
  onOpenInNewWindowClick: PropTypes.func,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  searchGroupResult: PropTypes.object,
  currentlySearching: PropTypes.bool,
  showTabsNumber: PropTypes.bool,
  groups: PropTypes.array,
  onGroupChangePosition: PropTypes.func,
  onChangePinState: PropTypes.func,
  onChangeExpand: PropTypes.func,
  allowClickSwitch: PropTypes.bool,
  stateless: PropTypes.bool,
}

export default Group