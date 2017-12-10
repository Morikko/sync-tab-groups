/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const Tab = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    onGroupDrop: React.PropTypes.func,
    onMoveTabToNewGroup: React.PropTypes.func,
    group: React.PropTypes.object,
    tab: React.PropTypes.object.isRequired,
    tabIndex: React.PropTypes.number,
    opened: React.PropTypes.bool,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
    searchTabResult: React.PropTypes.string,
    groups: React.PropTypes.object,
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
      src: this.props.tab.favIconUrl
    });

    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true,
      hiddenBySearch: !this.props.searchTabResult,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
    });

    return (
      React.DOM.li({
          className: tabClasses,
          //onDrag: this.handleTabDrag,
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
        this.createMenuMoveTab(),
        favicon,
        React.DOM.span({
            className: "tab-title",
            title: this.props.tab.title,
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

  createMenuMoveTab: function() {
    let subMenusMoveTab = [];
    for (let g of this.props.groups) {
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

    let menuMoveTab = React.DOM.menu({
      type: "context",
      id: "moveTabSubMenu" + this.props.tab.id,
    }, React.DOM.menu({
      label: browser.i18n.getMessage("move_tab_group"),
      icon: "/icons/tabspace-active-32.png" // doesn't work
    }, subMenusMoveTab));

    return menuMoveTab;
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
  /* TODO to keep ?
  handleTabDrag: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    event.dataTransfer.setData("tab/index", tab.index);
    event.dataTransfer.setData("tab/group", group.id);

    this.props.onTabDrag(
      group.id,
      tab.index
    );

  },
  */

  handleTabDrop: function(event) {
    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
    });

    if (event.dataTransfer.getData("type") === "tab") {
      event.stopPropagation();
    }
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

  handleTabDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();
    //console.log(this.props.group.index + ".leave");

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

    /*
    this.props.onTabDragStart(
      group.id,
      tab.index
    );
    */
  }
});
