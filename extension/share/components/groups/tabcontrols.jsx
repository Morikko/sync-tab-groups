import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Utils from '../../../background/utils/utils'
import getGroupIndexSortedByPosition from '../../../background/core/getGroupIndexSortedByPosition'
import ActionsMenu from './controls/ActionsMenu'
import Action from './controls/Action'

class TabControls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      waitFirstMount: false,
    };
  }

  render() {
    let controls = [];

    if (this.props.controlsEnable) {
      controls = ([
        this.createExtraActionsMenu(),
        <i
          key="close"
          title={browser.i18n.getMessage("close_tab")}
          className="tab-edit fa fa-fw fa-times"
          onClick={this.props.onCloseTab}
        ></i>,
      ]);
    }

    return (<span className="tab-controls"
      onMouseUp={(e)=>e.stopPropagation()}>
      {controls}
    </span>);
  }

  createExtraActionsMenu() {
    const actions = [
      this.getMoveAction(),
      this.getTabOpenAction(),
      this.getTabPinAction(),
    ]
    if (this.props.tab.hidden) {
      actions.push(this.getHiddenRemoveAction())
    }

    return (
      <ActionsMenu
        actions={actions}
        menuPosition={this.state.menuPosition}
        extraPanels={{
          move: this.createMoveTabToGroupPanel(),
        }}
      />
    )
  }

  getHiddenRemoveAction() {
    return new Action({
      key: "hidden_remove",
      action: this.props.onRemoveHiddenTab.bind(null, this.props.tab.id),
      close: true,
      icon: <i className="fa fa-fw fa-eye-slash" />,
      message: browser.i18n.getMessage("close_hidden_tab"),
    })
  }

  getMoveAction() {
    return new Action({
      key: "move_tab",
      action: "move",
      close: false,
      icon: <img src="/share/icons/tabspace-active-32.png" />,
      message: browser.i18n.getMessage("move_tab_group"),
    })
  }

  getTabOpenAction() {
    return new Action({
      key: "tab_open",
      action: this.props.onOpenTab,
      close: true,
      icon: <i className="fa fa-fw fa-plus" />,
      message: browser.i18n.getMessage("open_tab"),
    })
  }

  getTabPinAction() {
    return new Action({
      key: "tab_pin",
      action: this.props.onPinChange,
      close: true,
      icon: <i className="fa fa-fw fa-thumb-tack" />,
      message: browser.i18n.getMessage(this.props.isPinned ? "unpin_tab" : "pin_tab"),
    })
  }

  createMoveTabToGroupPanel() {
    const sortedIndex = getGroupIndexSortedByPosition(this.props.groups);
    const subMenusMoveTab = [];

    for (let i of sortedIndex) {
      const g = this.props.groups[i];
      const prefix = g.windowId !== browser.windows.WINDOW_ID_NONE
        ? "[OPEN] "
        : "";
      subMenusMoveTab.push(
        new Action({
          disabled: g.id === this.props.group.id,
          key: this.props.tab.id+"-"+g.id,
          action: this.props.handleOnMoveTabMenuClick.bind(null, g.id),
          close: true,
          message: prefix + Utils.getGroupTitle(g),
        })
      )
    }

    subMenusMoveTab.push("separator")

    subMenusMoveTab.push(
      new Action({
        key: this.props.tab.id+"-new",
        action: this.props.handleOnMoveTabNewMenuClick,
        close: true,
        icon: <i className="fa fa-fw fa-plus" />,
        message: browser.i18n.getMessage("add_group"),
      })
    )

    return subMenusMoveTab
  }

}

TabControls.propTypes = {
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
}

TabControls.POSITION = Object.freeze({
  TOP: Symbol("TOP"),
  MIDDLE: Symbol("Middle"),
  BOTTOM: Symbol("BOTTOM"),
})

export default TabControls