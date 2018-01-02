/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const Tab = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    onGroupDrop: React.PropTypes.func,
    onMoveTabToNewGroup: React.PropTypes.func,
    group: React.PropTypes.object,
    tab: React.PropTypes.object.isRequired,
    tabIndex: React.PropTypes.number,
    opened: React.PropTypes.bool,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
    searchTabResult: React.PropTypes.bool,
    groups: React.PropTypes.object,
    onChangePinState: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      dragOnTop: false,
      dragOnBottom: false,
    };
  },

  render: function() {
    let favicon = React.DOM.img({
      alt: "",
      className: "tab-icon",
      src: (Utils.isPrivilegedURL(this.props.tab.favIconUrl || "") ? "" : this.props.tab.favIconUrl) || ""
    });

    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true,
      hiddenBySearch: !this.props.searchTabResult,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
    });

    let offsetReduceSize = 25; // Icon
    offsetReduceSize += this.props.tab.pinned ? 20 : 0; // Pinned
    // Tab controls
    let offsetHoverReduceSize = offsetReduceSize + 20;

    let tabTitle;
    if (Utils.DEGUG_MODE) {
      tabTitle = "Tab Id: " + this.props.tab.id + "\n";
      tabTitle += "Tab Url: " + this.props.tab.url + "\n";
      tabTitle += "Tab Title: " + this.props.tab.title + "\n";
      tabTitle += "Tab FavIconUrl: " + this.props.tab.favIconUrl + "\n";
      tabTitle += "Tab Index: " + this.props.tab.index;
    } else {
      tabTitle = this.props.tab.title;
    }

    return (
      React.DOM.li({
          className: tabClasses,
          onDragStart: this.handleTabDragStart,
          onDragOver: this.handleTabDragOver,
          onDragLeave: this.handleTabDragLeave,
          onDrop: this.handleTabDrop,
          onClick: this.handleTabClick,
          draggable: true,
          onMouseEnter: this.addMenuItem,
          onMouseLeave: this.removeMenuItem,
          contextMenu: "moveTabSubMenu" + this.props.tab.id,
        },
        this.createContextMenuTab(),
        this.props.tab.pinned && React.DOM.i({
          className: "pinned-icon fa fa-fw fa-thumb-tack",
        }),
        favicon,
        React.DOM.span({
            className: "tab-title " + "max-width-" + offsetReduceSize + " max-width-hover-" + offsetHoverReduceSize,
            title: tabTitle,
          },
          this.props.tab.title,
          React.createElement(
            TabControls, {
              opened: this.props.opened,
              onCloseTab: this.handleCloseTabClick,
              onOpenTab: this.handleOpenTabClick,
            }
          )),
      )
    );
  },

  createContextMenuTab: function() {
    let subMenusMoveTab = [];
    let sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
    for (let i of sortedIndex) {
      let g = this.props.groups[i];
      subMenusMoveTab.push(React.DOM.menuitem({
        disabled: g.id === this.props.group.id,
        className: "?groupId=" + g.id,
        onClick: this.handleOnMoveTabMenuClick
      }, Utils.getGroupTitle(g)));
    }

    subMenusMoveTab.push(React.DOM.hr({}));

    subMenusMoveTab.push(React.DOM.menuitem({
      onClick: this.handleOnMoveTabNewMenuClick
    }, browser.i18n.getMessage("add_group")));

    let contextMenuTab = React.DOM.menu({
        type: "context",
        id: "moveTabSubMenu" + this.props.tab.id,
      },
      React.DOM.menu({
        label: browser.i18n.getMessage("move_tab_group"),
        icon: "/share/icons/tabspace-active-32.png" // doesn't work on menu parent
      }, subMenusMoveTab),
      React.DOM.menuitem({
        type: "context",
        icon: "/share/icons/pin-32.png",
        label: browser.i18n.getMessage(this.props.tab.pinned ? "unpin_tab" : "pin_tab"),
        onClick: this.handleChangePin,
      }),
      React.DOM.menuitem({
        type: "context",
        icon: "/share/icons/plus-32.png",
        onClick: this.handleOpenTabClick,
        label: browser.i18n.getMessage("open_tab")
      }));

    return contextMenuTab;
  },

  handleOnMoveTabNewMenuClick: function(event) {
    event.stopPropagation();

    console.log("add");

    this.props.onMoveTabToNewGroup(
      '',
      this.props.group.id,
      this.props.tabIndex,
    );
  },

  handleOnMoveTabMenuClick: function(event) {
    event.stopPropagation();

    let targetGroupId = parseInt(Utils.getParameterByName("groupId", event.target.className), 10);
    console.log(targetGroupId);

    if (targetGroupId >= 0) {
      this.props.onGroupDrop(
        this.props.group.id,
        this.props.tabIndex,
        targetGroupId,
      );
    }
  },

  handleTabClick: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    this.props.onTabClick(
      group.id,
      this.props.tabIndex
    );
    window.close();
  },

  handleOpenTabClick: function(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    this.props.onOpenTab(
      tab
    );
  },

  handleChangePin: function(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    this.props.onChangePinState(
      this.props.group.id,
      this.props.tabIndex,
    );
  },

  handleCloseTabClick: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    this.props.onCloseTab(
      tab.id,
      group.id,
      this.props.tabIndex
    );
  },

  handleTabDrop: function(event) {
    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
    });

    if (event.dataTransfer.getData("type") === "tab") {
      event.stopPropagation();

      let sourceGroup = parseInt(event.dataTransfer.getData("tab/group"), 10);
      let tabIndex = parseInt(event.dataTransfer.getData("tab/index"), 10);

      let targetTabIndex = -1;
      if (this.state.dragOnTop) {
        targetTabIndex = this.props.tabIndex;
      }
      if (this.state.dragOnBottom) {
        targetTabIndex = this.props.tabIndex + 1;
      }

      this.props.onGroupDrop(
        sourceGroup,
        tabIndex,
        this.props.group.id,
        targetTabIndex,
      );
    }
  },

  handleTabDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
    });
  },

  handleTabDragOver: function(event) {
    event.preventDefault();

    if (event.dataTransfer.getData("type") === "tab") {
      event.stopPropagation();
      let pos = event.pageY -
        event.currentTarget.offsetParent.offsetTop - // Group li
        event.currentTarget.offsetTop; // Tab li
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

  handleTabDragStart: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    event.dataTransfer.setData("type", "tab");
    event.dataTransfer.setData("tab/index", this.props.tabIndex);
    event.dataTransfer.setData("tab/group", group.id);
  }
});
