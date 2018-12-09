import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import ActionsMenu from './controls/ActionsMenu'
import Action from './controls/Action'

class GroupControls extends React.Component {
  constructor(props) {
    super(props);
  }

  getUndoControls() {
    const overHelp = this.props.closing
      ? browser.i18n.getMessage("undo_closing")
      : browser.i18n.getMessage("undo_removing");

    return [
      <i
        title={overHelp}
        key="undo"
        className="group-undo group-control fa fa-fw fa-undo"
        onClick={this.props.onUndoCloseClick}
      ></i>,
    ];
  }

  render() {
    const expanderClasses = classNames({
      "group-expand": true,
      "group-control": true,
      "fa": true,
      "fa-fw": true,
      "fa-chevron-down": !this.props.expanded,
      "fa-chevron-up": this.props.expanded,
    });

    return (
      <span
        className="group-controls"
        onMouseUp={(e)=>e.stopPropagation()}>
        {this.getOpenNewWindowButton()}
        {this.getUndoClosingButton()}
        {this.getUndoRemovingButton()}
        {this.getCloseButton()}
        {this.getRemoveButton()}
        {this.getTooltipOpenerButton()}
        <i
          className={expanderClasses}
          onClick={this.props.onExpand}
          title={this.getExpandTitle()}
        ></i>
      </span>);
  }

  getRemoveButton() {
    if (this.props.controlsEnable && !this.props.editing
      && !this.props.closing) {
      const overHelp = this.props.removing
        ? browser.i18n.getMessage("force_removing")
        : browser.i18n.getMessage("remove_group");

      return (
        <i
          key="remove"
          title={overHelp}
          className="group-close group-control fa fa-fw fa-trash"
          onClick={this.props.onRemove}
        ></i>
      );
    }
  }

  getCloseButton() {
    if (this.props.controlsEnable && !this.props.editing
      && this.props.opened && !this.props.removing) {
      const overHelp = this.props.closing
        ? browser.i18n.getMessage("force_closing")
        : browser.i18n.getMessage("close_group");

      return (
        <i
          key="close"
          title={overHelp}
          className="group-close group-control fa fa-fw fa-times"
          onClick={this.props.onClose}
        ></i>
      );
    }
  }

  getUndoRemovingButton() {
    if (this.props.controlsEnable && !this.props.editing
      && this.props.removing) {
      return this.getUndoControls();
    }
  }

  getUndoClosingButton() {
    if (this.props.controlsEnable && !this.props.editing
      && this.props.closing) {
      return this.getUndoControls();
    }
  }

  getOpenNewWindowButton() {
    if (this.props.controlsEnable && !this.props.closing
      && !this.props.removing && !this.props.opened
      && !this.props.editing) {
      return (
        <i
          key="open_window"
          className="group-edit group-control fa fa-fw fa-window-maximize"
          title={browser.i18n.getMessage("open_window_group")}
          onClick={this.props.onOpenInNewWindow}
        ></i>
      );
    }
  }

  getTooltipOpenerButton() {
    if (!this.props.closing && !this.props.removing
      && this.props.controlsEnable && !this.props.editing) {

      const actions = [this.getEditActionTooltip()]
      if (this.props.hasHiddenTabs) actions.push(this.getHiddenRemoveActionTooltip())

      return (
        <ActionsMenu
          actions={actions}
          customClassNames="group-edit group-control"
        />
      )
    }
  }

  getExpandTitle() {
    return this.props.expanded
      ? browser.i18n.getMessage("hide_tabs")
      : browser.i18n.getMessage("show_tabs");
  }

  getHiddenRemoveActionTooltip() {
    return new Action({
      key: "hidden_remove",
      action: this.props.onRemoveHiddenTabsInGroup.bind(null, this.props.groupId),
      close: true,
      icon: <i className="fa fa-fw fa-eye-slash" />,
      message: browser.i18n.getMessage("close_hidden_tabs_in_group"),
    })
  }

  getEditActionTooltip() {
    return new Action({
      key: "edit",
      action: this.props.onEdit,
      close: true,
      icon: <i className="fa fa-fw fa-pencil" />,
      message: browser.i18n.getMessage("rename_group"),
    })
  }
}

GroupControls.propTypes = {
  expanded: PropTypes.bool.isRequired,
  opened: PropTypes.bool.isRequired,
  closing: PropTypes.bool,
  removing: PropTypes.bool,
  editing: PropTypes.bool,
  onClose: PropTypes.func,
  onRemove: PropTypes.func,
  onEdit: PropTypes.func,
  onEditAbort: PropTypes.func,
  onEditSave: PropTypes.func,
  onExpand: PropTypes.func,
  onUndoCloseClick: PropTypes.func,
  onOpenInNewWindow: PropTypes.func,
}

export default GroupControls