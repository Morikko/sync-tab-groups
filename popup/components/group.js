/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const Group = React.createClass({
  propTypes: {
    group: React.PropTypes.object.isRequired,
    currentWindowId: React.PropTypes.number.isRequired,
    currentlyClosing: React.PropTypes.bool.isRequired,
    currentlyRemoving: React.PropTypes.bool.isRequired,
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
    searchGroupResult: React.PropTypes.object,
    currentlySearching: React.PropTypes.bool,
    showTabsNumber: React.PropTypes.bool,
    groups: React.PropTypes.object,
  },

  getClosingState: function(openWindow, props) {
    let closingState;
    if (openWindow) {
      closingState = props.currentlyClosing && !props.currentlyRemoving;
    } else {
      closingState = false;
    }
    return closingState;
  },

  getInitialState: function() {
    let openWindow = this.props.group.windowId !== browser.windows.WINDOW_ID_NONE;
    return {
      // Removing is more priority
      closing: this.getClosingState(openWindow, this.props),
      removing: this.props.currentlyRemoving,
      editing: false,
      currentlySearching: this.props.currentlySearching,
      expanded: false,
      opened: openWindow,
      draggingOverCounter: 0,
      dragSourceGroup: false,
      dragOnTop: false,
      dragOnBottom: false,
      newTitle: Utils.getGroupTitle(this.props.group)
    };
  },

  findExpandedState: function(current_state, previous_searching, current_searching) {
    if (previous_searching !== current_searching) {
      return current_searching;
    } else {
      return current_state;
    }
  },

  // When a component got new props, use this to update
  componentWillReceiveProps: function(nextProps) {
    let openWindow = nextProps.group.windowId !== browser.windows.WINDOW_ID_NONE;
    let expanded_state = this.findExpandedState(
      this.state.expanded,
      this.state.currentlySearching,
      nextProps.currentlySearching
    );

    this.setState({
      closing: this.getClosingState(openWindow, nextProps),
      removing: nextProps.currentlyRemoving,
      opened: openWindow,
      expanded: expanded_state,
      currentlySearching: nextProps.currentlySearching,
    })
  },

  render: function() {

    let titleElement;
    if (this.state.editing) {
      titleElement = React.DOM.input({
        autoFocus: true,
        type: "text",
        defaultValue: Utils.getGroupTitle(this.props.group),
        onChange: (event) => {
          this.setState({
            newTitle: event.target.value
          });
        },
        onClick: (event) => {
          event.stopPropagation();
        },
        onFocus: (e) => {
          e.target.select();
        },
        onKeyUp: this.handleGroupTitleInputKey
      });
    } else {
      let title = Utils.getGroupTitle(this.props.group);
      if (this.props.showTabsNumber) {
        title = title + "  (" + this.props.group.tabs.length + ")";
      }
      titleElement = React.DOM.span({
          className: "group-title-text"
        },
        title
      );
    }

    let groupClasses = classNames({
      active: (this.props.group.windowId > -1),
      editing: this.state.editing,
      closing: this.state.closing,
      removing: this.state.removing,
      draggingOver: this.state.draggingOverCounter !== 0,
      dragSourceGroup: this.state.dragSourceGroup,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
      expanded: this.state.expanded,
      focusGroup: this.props.currentWindowId === this.props.group.windowId,
      group: true,
      hiddenBySearch: !this.props.searchGroupResult.atLeastOneResult,
    });

    return (
      React.DOM.li({
          className: groupClasses,
          onClick: this.handleGroupClick,
          draggable: this.props.groupDraggable,
          onDragOver: this.handleGroupDragOver,
          onDragEnter: this.handleGroupDragEnter,
          onDragLeave: this.handleGroupDragLeave,
          //onDrag: this.handleTabDrag,
          onDragStart: this.handleTabDragStart,
          onDrop: this.handleGroupDrop
        },
        React.DOM.span({
            className: "group-title"
          },
          titleElement,
          React.createElement(
            GroupControls, {
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
            }
          )
        ),
        this.state.expanded && React.createElement(
          TabList, {
            tabs: this.props.group.tabs,
            group: this.props.group,
            onTabClick: this.props.onTabClick,
            onTabDrag: this.props.onTabDrag,
            onTabDragStart: this.props.onTabDragStart,
            onTabDragEnd: this.props.onTabDragEnd,
            onGroupDrop: this.props.onGroupDrop,
            onMoveTabToNewGroup: this.props.onMoveTabToNewGroup,
            opened: this.state.opened,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            searchTabsResults: this.props.searchGroupResult.searchTabsResults,
            groups: this.props.groups,
          }
        )
      )
    );
  },

  handleOpenInNewWindowClick: function(event) {
    event.stopPropagation();
    this.props.onOpenInNewWindowClick(this.props.group.id);
  },

  handleGroupRemoveClick: function(event) {
    event.stopPropagation();
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

  },

  handleGroupCloseClick: function(event) {
    event.stopPropagation();
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

  },

  handleGroupCloseAbortClick: function(event) {
    event.stopPropagation();

    this.props.onGroupCloseClick(TaskManager.CANCEL, this.props.group.id);
    this.props.onGroupRemoveClick(TaskManager.CANCEL, this.props.group.id);

    this.setState({
      closing: false,
      removing: false
    });
  },

  handleGroupClick: function(event) {
    event.stopPropagation();
    // TODO
    return;
    if (this.props.currentWindowId !== this.props.group.windowId)
      this.props.onGroupClick(this.props.group.id);
    window.close();
  },

  handleGroupEditClick: function(event) {
    event.stopPropagation();
    this.setState({
      editing: !this.state.editing
    });
  },

  handleGroupEditAbortClick: function(event) {
    event.stopPropagation();
    this.setState({
      editing: false
    });
  },

  handleGroupEditSaveClick: function(event) {
    event.stopPropagation();
    this.setState({
      editing: false
    });
    this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
  },

  handleGroupExpandClick: function(event) {
    event.stopPropagation();
    this.setState({
      expanded: !this.state.expanded
    });
  },

  handleGroupTitleInputKey: function(event) {
    event.stopPropagation();
    if (event.keyCode === 13) { // Enter key
      this.setState({
        editing: false
      });
      this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
    }
  },

  handleGroupDrop: function(event) {
    event.stopPropagation();

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
      draggingOverCounter: 0,
    });
    // TODO
    return;
    // -0 to get
    let sourceGroup = parseInt(event.dataTransfer.getData("tab/group"), 10);
    let tabIndex = parseInt(event.dataTransfer.getData("tab/index"), 10);

    this.props.onGroupDrop(
      sourceGroup,
      tabIndex,
      this.props.group.id
    );
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "group") {
      let pos = event.clientY - event.currentTarget.offsetTop;
      let height = event.currentTarget.offsetHeight;
      // Bottom
      if (pos > height / 2 && pos <= height) {
        if (this.state.dragOnTop || !this.state.dragOnBottom) {
          this.setState({
            dragOnTop: false,
            dragOnBottom: true,
          });
        }
      } else if (pos <= height / 2 && pos > 0) {
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
  },

  handleGroupDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();
    //console.log(this.props.group.index + ".enter");
    if (event.dataTransfer.getData("type") === "tab") {
      let sourceGroupId = event.dataTransfer.getData("tab/group");
      let isSourceGroup = sourceGroupId == this.props.group.id;
      this.setState({
        dragSourceGroup: isSourceGroup
      });

      this.setState({
        draggingOverCounter: (this.state.draggingOverCounter == 1) ? 2 : 1
      });

    }
  },

  handleGroupDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();
    //console.log(this.props.group.index + ".leave");

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
      draggingOverCounter: this.state.draggingOverCounter == 2 ? 1 : 0
    });
  },

  handleTabDragStart: function(event) {
    event.stopPropagation();
    // TODO prepare group transfer
    event.dataTransfer.setData("type", "group");
    event.dataTransfer.setData("group/id", this.props.group.id);
    return;
    /*
    let group = this.props.group;
    let tab = this.props.tab;
    event.dataTransfer.setData("tab/index", this.props.tabIndex);
    event.dataTransfer.setData("tab/group", group.id);

    this.props.onTabDragStart(
      group.id,
      tab.index
    );
    */
  }
});
