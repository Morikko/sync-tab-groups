/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const GroupControls = React.createClass({
  propTypes: {
    expanded: React.PropTypes.bool.isRequired,
    opened: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onEdit: React.PropTypes.func,
    onEditAbort: React.PropTypes.func,
    onEditSave: React.PropTypes.func,
    onExpand: React.PropTypes.func,
    onUndoCloseClick: React.PropTypes.func,
    onOpenInNewWindow: React.PropTypes.func
  },

  getEditControls: function() {
    let controls;
    if (this.props.editing) {
      controls = [
        React.DOM.i({
          className: "group-edit fa fa-fw fa-check",
          onClick: this.props.onEditSave
        }),
        React.DOM.i({
          className: "group-edit fa fa-fw fa-ban",
          onClick: this.props.onEditAbort
        })
      ];
    } else {
      controls = React.DOM.i({
        title: browser.i18n.getMessage("rename_group"),
        className: "group-edit fa fa-fw fa-pencil",
        onClick: this.props.onEdit
      });
    }

    return controls;
  },

  getClosingControls: function() {
    let overHelp;
    if (this.props.closing) {
      overHelp = browser.i18n.getMessage("undo_closing");
    } else if (this.props.removing) {
      overHelp = browser.i18n.getMessage("undo_removing");
    }
    return [
      React.DOM.i({
        title: overHelp,
        className: "group-edit group-close-undo fa fa-fw fa-undo",
        onClick: this.props.onUndoCloseClick
      })
    ];
  },

  render: function() {
    let editControls = [];
    if (!(this.props.closing || this.props.removing)) {
      editControls = this.getEditControls();
    }

    let expanderClasses = classNames({
      "group-expand": true,
      "fa": true,
      "fa-fw": true,
      "fa-chevron-down": !this.props.expanded,
      "fa-chevron-up": this.props.expanded
    });

    let openedControls = [];
    // Open in new window button
    if (!this.props.opened &&
      !this.props.closing &&
      !this.props.removing) {
      openedControls.push(
        React.DOM.i({
          className: "group-edit fa fa-fw fa-window-maximize",
          title: browser.i18n.getMessage("open_window_group"),
          onClick: this.props.onOpenInNewWindow
        })
      );
    }

    // Before closing
    if (this.props.closing) {
      openedControls.push(this.getClosingControls());
    }

    // Close button
    if (this.props.opened && !this.props.removing) {
      let overHelp;
      if (this.props.closing) {
        overHelp = browser.i18n.getMessage("force_closing");
      } else {
        overHelp = browser.i18n.getMessage("close_group");
      }
      openedControls.push(
        React.DOM.i({
          title: overHelp,
          className: "group-edit fa fa-fw fa-times",
          onClick: this.props.onClose
        })
      );
    }

    if (!this.props.closing) {
      let overHelp;
      if (this.props.removing) {
        overHelp = browser.i18n.getMessage("force_removing");
      } else {
        overHelp = browser.i18n.getMessage("remove_group");
      }
      openedControls.push(
        React.DOM.i({
          title: overHelp,
          className: "group-edit fa fa-fw fa-trash",
          onClick: this.props.onRemove
        })
      );
    }

    if (this.props.removing) {
      openedControls.push(this.getClosingControls());
    }

    let expand_title = this.props.expanded ? browser.i18n.getMessage("hide_tabs") : browser.i18n.getMessage("show_tabs");
    return React.DOM.span({
        className: "group-controls"
      },
      editControls,
      openedControls,
      React.DOM.i({
        className: expanderClasses,
        onClick: this.props.onExpand,
        title: expand_title,
      })
    );
  }
});
