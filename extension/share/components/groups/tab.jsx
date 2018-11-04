import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Utils from '../../../background/utils/utils'

import TabControls from './tabcontrols'
import NiceCheckbox from '../forms/nicecheckbox'
import sharedVariable from './sharedVariable'
import {
  Navigation,
  tabNavigationListener,
} from './wrapper/navigation'

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOnTop: false,
      dragOnBottom: false,
      waitFirstMount: false,
      hasFocus: false,
    };

    this.handleOnMoveTabNewMenuClick = this.handleOnMoveTabNewMenuClick.bind(this);
    this.handleOnMoveTabMenuClick = this.handleOnMoveTabMenuClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleOpenTabClick = this.handleOpenTabClick.bind(this);
    this.handleChangePin = this.handleChangePin.bind(this);
    this.handleCloseTabClick = this.handleCloseTabClick.bind(this);
    this.handleTabDrop = this.handleTabDrop.bind(this);
    this.handleTabDragLeave = this.handleTabDragLeave.bind(this);
    this.handleTabDragOver = this.handleTabDragOver.bind(this);
    this.handleTabDragStart = this.handleTabDragStart.bind(this);
  }

  componentDidMount() {
    if (!this.state.waitFirstMount) {
      this.differedTimeOut = setTimeout((()=>{
        this.setState({
          waitFirstMount: true,
        });
      }).bind(this), 500);
    }
  }

  componentWillUnmount() {
    if (this.differedTimeOut) {
      clearTimeout(this.differedTimeOut);
    }
  }

  getfavIconUrl(favIconUrl) {
    if (!favIconUrl) {
      return "";
    }
    if (favIconUrl !== "chrome://branding/content/icon32.png"
      && Utils.isPrivilegedURL(favIconUrl)) {
      return "";
    }
    return favIconUrl;
  }

  render() {
    let favicon = (
      <img
        alt=""
        className="tab-icon"
        src={this.getfavIconUrl(this.props.tab.favIconUrl)}
      />
    );

    const active = this.props.selected !== undefined
      ? false
      : this.props.tab.active;

    let tabClasses = classNames({
      hasFocus: this.state.hasFocus,
      hoverStyle: this.props.hoverStyle,
      active: active,
      tab: true,
      hiddenBySearch: !this.props.searchTabResult,
      dragTopBorder: this.state.dragOnTop,
      dragBottomBorder: this.state.dragOnBottom,
    });

    let tabTitle;
    if (Utils.DEBUG_MODE) {
      tabTitle = JSON.stringify(this.props.tab, null, 4);
    } else {
      tabTitle = this.props.tab.title;
    }

    let checkbox = this.props.selected !== undefined
      ? (
        <NiceCheckbox
          checked= {this.props.selected}
          onCheckChange= {()=>{
            this.props.onTabClick(
              this.props.group.id,
              this.props.tabIndex,
              this.props.selected
            );
          }}
          label= {""}
          id={"selected-tab-"+this.props.tab.id}
          disabled={false}
        />
      )
      : null;

    const hasFocusIcon = this.state.hasFocus
      ? (
        <i className="arrow-focus fa fa-fw fa-angle-right"></i>
      ) : null;
    const pinnedIcon = this.props.tab.pinned
      ? (<i className="pinned-icon fa fa-fw fa-thumb-tack"></i>)
      : null;

    const hiddenIcon = this.props.tab.hidden
      ? (<i className="hidden-icon fa fa-fw fa-eye-slash"
        title="This tab is hidden."
      ></i>)
      : null;

    const tabTitleSpan = (
      <span className={"tab-title"}>
        {this.props.tab.title}
      </span>
    );

    const tabControls = (
      <TabControls
        opened={this.props.opened}
        onCloseTab={this.handleCloseTabClick}
        onOpenTab={this.handleOpenTabClick}
        onPinChange={this.handleChangePin}
        onRemoveHiddenTab={this.props.onRemoveHiddenTab}
        isPinned={this.props.tab.pinned}
        groups={this.props.groups}
        group={this.props.group}
        tab={this.props.tab}
        handleOnMoveTabMenuClick={this.handleOnMoveTabMenuClick}
        handleOnMoveTabNewMenuClick={this.handleOnMoveTabNewMenuClick}
        controlsEnable={this.props.controlsEnable}
      />
    );

    return (
      <li
        className={tabClasses}
        onDragStart={this.handleTabDragStart}
        onDragOver={this.handleTabDragOver}
        onDragLeave={this.handleTabDragLeave}
        onDrop={this.handleTabDrop}
        onMouseUp={this.handleTabClick}
        draggable={this.props.draggable}
        onMouseEnter={this.addMenuItem}
        onMouseLeave={this.removeMenuItem}
        contextMenu={"moveTabSubMenu" + this.props.tab.id}
        title={tabTitle}
        tabIndex="0"
        onFocus={(e)=>{
          e.stopPropagation();
          if ((typeof Navigation !== 'undefined')
          && Navigation.KEY_PRESSED_RECENTLY) {
            this.setState({
              hasFocus: true,
            })
          }
        }}
        onBlur={(e)=>{
          e.stopPropagation();
          this.setState({
            hasFocus: false,
          })
        }}
        onKeyDown={this.props.hotkeysEnable
          ? Utils.doActivateHotkeys(
            tabNavigationListener(this),
            this.props.hotkeysEnable)
          : undefined}
      >
        {checkbox}
        {pinnedIcon}
        {hiddenIcon}
        {favicon}
        {hasFocusIcon}
        {tabTitleSpan}
        {tabControls}
      </li>);
  }

  handleOnMoveTabNewMenuClick(event) {
    if (event) {
      event.stopPropagation();
    }

    this.props.onMoveTabToNewGroup(
      '',
      this.props.group.id,
      this.props.tabIndex,
    );
  }

  handleOnMoveTabMenuClick(event) {
    if (event) {
      event.stopPropagation();
    }

    let targetGroupId = parseInt(Utils.getParameterByName("groupId", event.target.className), 10);

    if (targetGroupId >= 0) {
      this.props.onGroupDrop(
        this.props.group.id,
        this.props.tabIndex,
        targetGroupId,
      );
    }
  }

  handleTabClick(event) {
    if (event) {
      event.stopPropagation();
    }

    this.onTabClick((event && event.button === 1)); // Middle
  }

  onTabClick(newWindow) {
    if (this.props.allowClickSwitch) {
      let group = this.props.group;
      this.props.onTabClick(
        group.id,
        this.props.tabIndex,
        newWindow,
      );
      window.close();
    } else if (this.props.selected !== undefined) {
      this.props.onTabClick(
        this.props.group.id,
        this.props.tabIndex,
        this.props.selected
      );
    }
  }

  handleOpenTabClick(event) {
    if (event) {
      event.stopPropagation();
    }
    this.onClickOpenTab();
  }

  onClickOpenTab() {
    let tab = this.props.tab;
    this.props.onOpenTab(
      tab
    );
  }

  handleChangePin(event) {
    if (event) {
      event.stopPropagation();
    }

    this.props.onChangePinState(
      this.props.group.id,
      this.props.tabIndex,
    );
  }

  handleCloseTabClick(event) {
    if (event) {
      event.stopPropagation();
    }

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

    if (sharedVariable.dragType === "tab") {
      event.stopPropagation();
      let pos = event.pageY // Position of the cursor
          - Utils.getOffset(event.currentTarget);

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

    sharedVariable.dragType = "tab";

    event.dataTransfer.setData("type", "tab");
    event.dataTransfer.setData("tab/index", this.props.tabIndex);
    event.dataTransfer.setData("tab/group", group.id);
  }
  /* TODO to correct or to remove (doesn't update on group rename)
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
  */
}

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

export default Tab