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
    });

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

    return (
      React.DOM.li({
          className: tabClasses,
          //onDrag: this.handleTabDrag,
          onDragStart: this.handleTabDragStart,
          onClick: this.handleTabClick,
          draggable: true,
          onMouseEnter: this.addMenuItem,
          onMouseLeave: this.removeMenuItem,
          contextMenu: "moveTabSubMenu" + this.props.tab.id,
        },
        menuMoveTab,
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
