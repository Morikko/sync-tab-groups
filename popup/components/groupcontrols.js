/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
    if ( this.props.closing) {
      overHelp = browser.i18n.getMessage("undo_closing");
    }
    else if ( this.props.removing ) {
      overHelp = browser.i18n.getMessage("undo_removing");
    }
    return [
      React.DOM.i({
        title: overHelp,
        className: "group-close-undo fa fa-fw fa-undo",
        onClick: this.props.onUndoCloseClick
      })
    ];
  },

  render: function() {
    let groupControls;
    if (this.props.closing || this.props.removing) {
      groupControls = this.getClosingControls();
    } else {
      groupControls = this.getEditControls();
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
    if ( !this.props.opened
      && !this.props.closing
      && !this.props.removing ) {
      openedControls.push(
        React.DOM.i({
          className: "group-edit fa fa-fw fa-window-maximize",
          title: browser.i18n.getMessage("open_window_group"),
          onClick: this.props.onOpenInNewWindow
        })
      );
    }

    // Close button
    if (this.props.opened &&  !this.props.removing  ) {
      let overHelp;
      if ( this.props.closing) {
        overHelp = browser.i18n.getMessage("force_closing");
      }
      else {
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

    if ( !this.props.closing  ) {
      let overHelp;
      if ( this.props.removing) {
        overHelp = browser.i18n.getMessage("force_removing");
      }
      else {
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

    let expand_title = this.props.expanded?browser.i18n.getMessage("hide_tabs"):browser.i18n.getMessage("show_tabs");
    return React.DOM.span({
        className: "group-controls"
      },
      groupControls,
      openedControls,
      React.DOM.i({
        className: expanderClasses,
        onClick: this.props.onExpand,
        title: expand_title,
      })
    );
  }
});
