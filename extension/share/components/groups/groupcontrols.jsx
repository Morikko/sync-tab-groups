/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
class GroupControls extends React.Component {
  getEditControls() {
    let controls;
    if (this.props.editing) {
      controls = [
        <i
          key="rename_agree"
          className="group-edit fa fa-fw fa-check"
          onClick={this.props.onEditSave}
        ></i>,
        <i
          key="rename_abort"
          className="group-edit fa fa-fw fa-ban"
          onClick={this.props.onEditAbort}
        ></i>
      ];
    } else {
      controls = (<i
        key="rename"
        title={browser.i18n.getMessage("rename_group")}
        className={"group-edit fa fa-fw fa-pencil"}
        onClick={this.props.onEdit}
      ></i>);
    }

    return controls;
  }

  getClosingControls() {
    let overHelp;
    if (this.props.closing) {
      overHelp = browser.i18n.getMessage("undo_closing");
    } else if (this.props.removing) {
      overHelp = browser.i18n.getMessage("undo_removing");
    }
    return [
      <i
        title={overHelp}
        key="undo"
        className="group-undo fa fa-fw fa-undo"
        onClick={this.props.onUndoCloseClick}
      ></i>
    ];
  }

  render() {
    let controls = [];
    if (!(this.props.closing || this.props.removing)) {
      controls.push(this.getEditControls());
    }

    if (!this.props.editing) {
      // Open in new window button
      if (!this.props.opened &&
        !this.props.closing &&
        !this.props.removing) {
        controls.push(
          <i
            key="open_window"
            className="group-edit fa fa-fw fa-window-maximize"
            title={browser.i18n.getMessage("open_window_group")}
            onClick={this.props.onOpenInNewWindow}
          ></i>
        );
      }

      // Before closing
      if (this.props.closing) {
        controls.push(this.getClosingControls());
      }

      // Close button
      if (this.props.opened && !this.props.removing) {
        let overHelp;
        if (this.props.closing) {
          overHelp = browser.i18n.getMessage("force_closing");
        } else {
          overHelp = browser.i18n.getMessage("close_group");
        }
        controls.push(
          <i
            key="close"
            title={overHelp}
            className="group-close fa fa-fw fa-times"
            onClick={this.props.onClose}
          ></i>
        );
      }

      if (!this.props.closing) {
        let overHelp;
        if (this.props.removing) {
          overHelp = browser.i18n.getMessage("force_removing");
        } else {
          overHelp = browser.i18n.getMessage("remove_group");
        }
        controls.push(
          <i
            key="remove"
            title={overHelp}
            className="group-close fa fa-fw fa-trash"
            onClick={this.props.onRemove}
          ></i>
        );
      }

      if (this.props.removing) {
        controls.push(this.getClosingControls());
      }
    }

    let expanderClasses = classNames({
      "group-expand": true,
      "fa": true,
      "fa-fw": true,
      "fa-chevron-down": !this.props.expanded,
      "fa-chevron-up": this.props.expanded
    });

    let expand_title = this.props.expanded ? browser.i18n.getMessage("hide_tabs") : browser.i18n.getMessage("show_tabs");
    return (
      <span
        className="group-controls">
      {controls}
      <i
        className={expanderClasses}
        onClick={this.props.onExpand}
        title={expand_title}
      ></i>
    </span>);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextProps.expanded !== this.props.expanded
    || nextProps.opened !== this.props.opened
    || nextProps.closing !== this.props.closing
    || nextProps.removing !== this.props.removing
    || nextProps.editing !== this.props.editing) {
      return true;
    }

    return false;
  }
};

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
  onOpenInNewWindow: PropTypes.func
}
