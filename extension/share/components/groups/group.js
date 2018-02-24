/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
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
      expanded: this.props.stateless ? false : this.props.group.expand,
      opened: openWindow,
      draggingOverCounter: 0, // Many drag enter/leave are fired, know if it is a really entering
      draggingOver: false,
      dragOnTop: false,
      dragOnBottom: false,
      newTitle: Utils.getGroupTitle(this.props.group),
      waitFirstMount: false
    };

    this.handleOpenInNewWindowClick = this.handleOpenInNewWindowClick.bind(this);
    this.handleGroupRemoveClick = this.handleGroupRemoveClick.bind(this);
    this.handleGroupCloseClick = this.handleGroupCloseClick.bind(this);
    this.handleGroupCloseAbortClick = this.handleGroupCloseAbortClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
    this.handleGroupEditClick = this.handleGroupEditClick.bind(this);
    this.handleGroupEditAbortClick = this.handleGroupEditAbortClick.bind(this);
    this.handleGroupEditSaveClick = this.handleGroupEditSaveClick.bind(this);
    this.handleGroupExpandClick = this.handleGroupExpandClick.bind(this);
    this.handleGroupTitleInputKey = this.handleGroupTitleInputKey.bind(this);
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
      if (this.props.stateless) return this.state.expanded;else return current_state;
    }
  }

  // When a component got new props, use this to update
  componentWillReceiveProps(nextProps) {
    let openWindow = nextProps.group.windowId !== browser.windows.WINDOW_ID_NONE;
    let expanded_state = this.findExpandedState(nextProps.group.expand, nextProps.currentlySearching);

    this.setState({
      closing: this.getClosingState(openWindow, nextProps),
      removing: nextProps.currentlyRemoving,
      opened: openWindow,
      expanded: expanded_state,
      currentlySearching: nextProps.currentlySearching
    });
  }

  componentDidMount() {
    if (!this.state.waitFirstMount) {
      this.differedTimeOut = setTimeout((() => {
        this.setState({
          waitFirstMount: true
        });
      }).bind(this), 0);
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

  render() {
    //console.log("Group Render");
    let titleElement;
    if (this.state.editing) {
      titleElement = React.createElement("input", {
        className: "",
        id: "text-editiong-" + this.props.group.id,
        autoFocus: true,
        type: "text",
        value: this.state.newTitle,
        onChange: (event => {
          this.setState({
            newTitle: event.target.value
          });
        }).bind(this),
        onClick: event => {
          event.stopPropagation();
        },
        onFocus: e => {
          e.target.select();
        },
        onKeyUp: this.handleGroupTitleInputKey
      });
    } else {
      let title = Utils.getGroupTitle(this.props.group);
      if (this.props.showTabsNumber) {
        title = title + "  (" + this.props.group.tabs.length + ")";
      }
      titleElement = React.createElement(
        "span",
        { className: "group-title-text" },
        title
      );
    }

    let groupClasses = classNames({
      active: this.props.group.windowId > -1,
      editing: this.state.editing,
      closing: this.state.closing,
      removing: this.state.removing,
      draggingOver: this.state.draggingOver,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
      expanded: this.state.expanded,
      focusGroup: this.props.currentWindowId === this.props.group.windowId,
      group: true,
      hiddenBySearch: !(this.props.searchGroupResult ? this.props.searchGroupResult.atLeastOneResult : true),
      incognito: this.props.group.incognito
    });

    let groupTitle;
    if (Utils.DEGUG_MODE) {
      groupTitle = "Group Id: " + this.props.group.id + "\n";
      groupTitle += "Group Index: " + this.props.group.index + "\n";
      groupTitle += "Group Window: " + this.props.group.windowId + "\n";
      groupTitle += "Group Position: " + this.props.group.position + "\n";
      groupTitle += "Incognito: " + this.props.group.incognito;
    } else {
      groupTitle = browser.i18n.getMessage("open_group");
    }

    return React.createElement(
      "li",
      {
        className: groupClasses,
        onClick: this.handleGroupClick,
        draggable: this.props.groupDraggable,
        onDragOver: this.handleGroupDragOver,
        onDragEnter: this.handleGroupDragEnter,
        onDragLeave: this.handleGroupDragLeave,
        onDragStart: this.handleGroupDragStart,
        onDrop: this.handleGroupDrop,
        title: groupTitle,
        style: { width: this.props.width },
        tabIndex: "0",
        onKeyDown: Utils.doActivateHotkeys(groupNavigationListener(this), this.props.hotkeysEnable)
      },
      React.createElement(
        "span",
        {
          className: "group-title"
        },
        titleElement,
        React.createElement(GroupControls, {
          closing: this.state.closing,
          removing: this.state.removing,
          editing: this.state.editing,
          expanded: this.state.expanded,
          opened: this.state.opened,
          onClose: this.handleGroupCloseClick,
          onRemove: this.handleGroupRemoveClick,
          onEdit: this.handleGroupEditClick,
          onEditAbort: this.handleGroupEditAbortClick,
          onEditSave: this.handleGroupEditSaveClick,
          onExpand: this.handleGroupExpandClick,
          onUndoCloseClick: this.handleGroupCloseAbortClick,
          onOpenInNewWindow: this.handleOpenInNewWindowClick
        })
      ),
      this.state.waitFirstMount /*&& this.state.expanded*/ && React.createElement(TabList, {
        tabs: this.props.group.tabs,
        group: this.props.group,
        onTabClick: this.props.onTabClick,
        onGroupDrop: this.props.onGroupDrop,
        onMoveTabToNewGroup: this.props.onMoveTabToNewGroup,
        opened: this.state.opened,
        onCloseTab: this.props.onCloseTab,
        onOpenTab: this.props.onOpenTab,
        searchTabsResults: this.props.searchGroupResult ? this.props.searchGroupResult.searchTabsResults : undefined,
        groups: this.props.groups,
        onChangePinState: this.props.onChangePinState,
        visible: this.state.expanded,
        allowClickSwitch: this.props.allowClickSwitch,
        hotkeysEnable: this.props.hotkeysEnable
      })
    );
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
      closing: false
    });

    // Already click once, do it now
    if (this.state.removing) {
      this.setState({
        removing: false
      });
      this.props.onGroupRemoveClick(TaskManager.FORCE, this.props.group.id);
      // Delayed close
    } else {
      this.setState({
        removing: true
      });
      this.props.onGroupRemoveClick(TaskManager.ASK, this.props.group.id);
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
      removing: false
    });

    // Already click once, do it now
    if (this.state.closing) {
      this.setState({
        closing: false
      });
      this.props.onGroupCloseClick(TaskManager.FORCE, this.props.group.id);
      // Delayed close
    } else {
      this.setState({
        closing: true
      });
      this.props.onGroupCloseClick(TaskManager.ASK, this.props.group.id);
    }
  }

  handleGroupCloseAbortClick(event) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.state.removing && !this.state.closing) {
      return;
    }

    this.props.onGroupCloseClick(TaskManager.CANCEL, this.props.group.id);
    this.props.onGroupRemoveClick(TaskManager.CANCEL, this.props.group.id);

    this.setState({
      closing: false,
      removing: false
    });
  }

  handleGroupClick(event) {
    if (event) {
      event.stopPropagation();
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
    } else {
      this.handleGroupExpandClick();
    }
  }

  handleGroupEditClick(event) {
    if (event) {
      event.stopPropagation();
    }

    if (this.state.editing) {
      // Useless
      return;
    }

    this.setState({
      editing: true
    });
  }

  handleGroupEditAbortClick(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.state.editing) {
      // Useless
      return;
    }

    this.setState({
      editing: false,
      newTitle: Utils.getGroupTitle(this.props.group)
    });
  }

  handleGroupEditSaveClick(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.state.editing) {
      // Useless
      return;
    }
    this.setState({
      editing: false,
      newTitle: Utils.getGroupTitle(this.props.group)
    });
    this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
  }

  handleGroupExpandClick(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.props.stateless) {
      this.props.onChangeExpand([this.props.group.id], !this.state.expanded);
    }
    this.setState({
      expanded: !this.state.expanded
    });
  }

  handleGroupTitleInputKey(event) {
    event.stopPropagation();
    if (event.keyCode === 13) {
      // Enter key
      this.setState({
        editing: false,
        newTitle: Utils.getGroupTitle(this.props.group)
      });
      this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
    }
  }

  handleGroupDrop(event) {
    event.stopPropagation();

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
      draggingOver: false,
      draggingOverCounter: 0
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

      this.props.onGroupChangePosition(parseInt(event.dataTransfer.getData("group/id"), 10), position);
    }
  }

  getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  handleGroupDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "group") {
      // Position of main group-list
      let pos = event.pageY - ( // Event loc Full page
      event.currentTarget.offsetTop // Group dist
      - event.currentTarget.parentElement.scrollTop); // Remove scroll grouplist
      let height = event.currentTarget.offsetHeight;
      // Bottom
      if (pos > height / 2 && pos <= height) {
        if (this.state.dragOnTop || !this.state.dragOnBottom) {
          this.setState({
            dragOnTop: false,
            dragOnBottom: true
          });
        }
      } else if (pos <= height / 2 && pos > 0) {
        if (!this.state.dragOnTop || this.state.dragOnBottom) {
          this.setState({
            dragOnTop: true,
            dragOnBottom: false
          });
        }
      } else {
        if (this.state.dragOnTop || this.state.dragOnBottom) {
          this.setState({
            dragOnTop: false,
            dragOnBottom: false
          });
        }
      }
    }
    if (event.dataTransfer.getData("type") === "tab") {
      this.setState({
        draggingOver: true
      });
    }
  }

  handleGroupDragEnter(event) {
    event.preventDefault();

    if (event.dataTransfer.getData("type") === "tab" && event.target.className.includes("group")) {
      event.stopPropagation();

      this.setState({
        draggingOverCounter: this.state.draggingOverCounter == 1 ? 2 : 1
      });

      if (this.state.draggingOverCounter === 0) {
        this.expandedTimeOut = setTimeout(() => {
          this.setState({
            expanded: true
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
      draggingOverCounter: this.state.draggingOverCounter == 2 ? 1 : 0
    });
    if (this.state.draggingOverCounter === 1 && this.expandedTimeOut >= 0) {
      clearTimeout(this.expandedTimeOut);
    }
  }

  handleGroupDragStart(event) {
    event.stopPropagation();

    event.dataTransfer.setData("type", "group");
    event.dataTransfer.setData("group/id", this.props.group.id);
  }
};

Group.propTypes = {
  group: PropTypes.object.isRequired,
  currentWindowId: PropTypes.number.isRequired,
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
  groups: PropTypes.object,
  onGroupChangePosition: PropTypes.func,
  onChangePinState: PropTypes.func,
  onChangeExpand: PropTypes.func,
  allowClickSwitch: PropTypes.bool,
  stateless: PropTypes.bool
};