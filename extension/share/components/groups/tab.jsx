/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From={https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
class Tab extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dragOnTop: false,
      dragOnBottom: false,
      waitFirstMount: false,
    };

    this.handleOnMoveTabNewMenuClick = this.handleOnMoveTabNewMenuClick.bind(this);
    this.handleOnMoveTabMenuClick = this.handleOnMoveTabMenuClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.onClickOpenTab = this.onClickOpenTab.bind(this);
    this.handleChangePin = this.handleChangePin.bind(this);
    this.handleCloseTabClick = this.handleCloseTabClick.bind(this);
    this.handleTabDrop = this.handleTabDrop.bind(this);
    this.handleTabDragLeave = this.handleTabDragLeave.bind(this);
    this.handleTabDragOver = this.handleTabDragOver.bind(this);
    this.handleTabDragStart = this.handleTabDragStart.bind(this);
  }

  componentDidMount() {
    if ( !this.state.waitFirstMount ) {
      this.differedTimeOut = setTimeout((()=>{
        this.setState({
          waitFirstMount: true,
        });
      }).bind(this), 500);
    }
  }

  componentWillUnmount() {
    if ( this.differedTimeOut ) {
      clearTimeout(this.differedTimeOut);
    }
  }

  render() {
    let favicon = (
      <img
        alt=""
        className="tab-icon"
        src={(Utils.isPrivilegedURL(this.props.tab.favIconUrl || "")?"":(this.props.tab.favIconUrl)) || ""}
      />);

    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true,
      hiddenBySearch: !this.props.searchTabResult,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
    });

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
      <li
          className={tabClasses}
          onDragStart={this.handleTabDragStart}
          onDragOver={this.handleTabDragOver}
          onDragLeave={this.handleTabDragLeave}
          onDrop={this.handleTabDrop}
          onClick={this.handleTabClick}
          draggable={true}
          onMouseEnter={this.addMenuItem}
          onMouseLeave={this.removeMenuItem}
          contextMenu={"moveTabSubMenu" + this.props.tab.id}
        >
        {!Utils.isChrome() && this.state.waitFirstMount && this.createContextMenuTab()}
        {this.props.tab.pinned && <i
          className="pinned-icon fa fa-fw fa-thumb-tack"
        ></i>}
        {favicon}
        <span
            className={"tab-title"}
            title={tabTitle}
          >
          {this.props.tab.title}
      </span>
      <TabControls
          opened={this.props.opened}
          onCloseTab={this.handleCloseTabClick}
          onOpenTab={this.onClickOpenTab}
        />
    </li>);
  }

  createContextMenuTab() {
    let subMenusMoveTab = [];
    let sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
    for (let i of sortedIndex) {
      let g = this.props.groups[i];
      subMenusMoveTab.push(
        <menuitem
        key={this.props.tab.id+"-"+g.id}
        disabled={g.id === this.props.group.id}
        className={"?groupId=" + g.id}
        onClick={this.handleOnMoveTabMenuClick}
        label={Utils.getGroupTitle(g)}>
        </menuitem>);
    }

    subMenusMoveTab.push(<hr key={this.props.tab.id+"-separator"}/>);

    subMenusMoveTab.push(
      <menuitem
        key={this.props.tab.id+"-addgroup"}
        onClick={this.handleOnMoveTabNewMenuClick}
        label={browser.i18n.getMessage("add_group")}>
      </menuitem>);

    let contextMenuTab = (
      <menu
        type={"context"}
        id={"moveTabSubMenu" + this.props.tab.id}>
          <menu
            label={browser.i18n.getMessage("move_tab_group")}
            icon={"/share/icons/tabspace-active-32.png"/* doesn't work on menu parent*/}>
           {subMenusMoveTab}
          </menu>
           <menuitem
            type={"context"}
            icon={"/share/icons/pin-32.png"}
            label={browser.i18n.getMessage(this.props.tab.pinned ? "unpin_tab" : "pin_tab")}
            onClick={this.handleChangePin}
          ></menuitem>
          <menuitem
            type={"context"}
            icon={"/share/icons/plus-32.png"}
            onClick={this.onClickOpenTab}
            label={browser.i18n.getMessage("open_tab")}
          ></menuitem>
      </menu>);

    return contextMenuTab;
  }

  handleOnMoveTabNewMenuClick(event) {
    event.stopPropagation();

    this.props.onMoveTabToNewGroup(
      '',
      this.props.group.id,
      this.props.tabIndex,
    );
  }

  handleOnMoveTabMenuClick(event) {
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
  }

  handleTabClick(event) {
    event.stopPropagation();

    if ( this.props.allowClickSwitch ) {
      let group = this.props.group;
      let tab = this.props.tab;
      this.props.onTabClick(
        group.id,
        this.props.tabIndex,
        (event.button === 1), // Middle
      );
      window.close();
    }
  }

  onClickOpenTab( event ) {
    event.stopPropagation();
    this.handleOpenTabClick();
  }

  handleOpenTabClick() {
    let tab = this.props.tab;
    this.props.onOpenTab(
      tab
    );
  }

  handleChangePin(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    this.props.onChangePinState(
      this.props.group.id,
      this.props.tabIndex,
    );
  }

  handleCloseTabClick(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    this.props.onCloseTab(
      tab.id,
      group.id,
      this.props.tabIndex
    );
  }

  handleTabDrop(event) {
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
  }

  handleTabDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      dragOnTop: false,
      dragOnBottom: false,
    });
  }

  handleTabDragOver(event) {
    event.preventDefault();

    if (event.dataTransfer.getData("type") === "tab") {
      event.stopPropagation();
      let pos = event.pageY -
        (event.currentTarget.offsetParent.offsetTop // Group li
          -event.currentTarget.offsetParent.parentElement.scrollTop) // Remove scroll grouplis
        -event.currentTarget.offsetTop; // Tab li
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
  }

  handleTabDragStart(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    event.dataTransfer.setData("type", "tab");
    event.dataTransfer.setData("tab/index", this.props.tabIndex);
    event.dataTransfer.setData("tab/group", group.id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextProps.searchTabResult !== this.props.searchTabResult  ){
      return true;
    }

    if ( nextProps.tab.pinned !== this.props.tab.pinned
    || nextProps.tab.index !== this.props.tab.index
    || nextProps.tab.url !== this.props.tab.url
    || nextProps.tab.active !== this.props.tab.active
    || nextProps.tab.title !== this.props.tab.title ) {
      return true;
    }

    if ( this.state.dragOnTop !== nextState.dragOnTop
    || this.state.dragOnBottom !== nextState.dragOnBottom ){
      return true;
    }

    if ( nextProps.groups.length !== this.props.groups.length ) {
      return true;
    }

    if ( this.state.waitFirstMount !== nextState.waitFirstMount ) {
      return true;
    }

    return false;
  }
};

Tab.propTypes = {
  onTabClick: PropTypes.func,
  onGroupDrop: PropTypes.func,
  onMoveTabToNewGroup: PropTypes.func,
  group: PropTypes.object,
  tab: PropTypes.object.isRequired,
  tabIndex: PropTypes.number,
  opened: PropTypes.bool,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  searchTabResult: PropTypes.bool,
  groups: PropTypes.object,
  onChangePinState: PropTypes.func,
  allowClickSwitch: PropTypes.bool,
}
