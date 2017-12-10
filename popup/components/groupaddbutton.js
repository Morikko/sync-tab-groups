/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
const GroupAddButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    onDrop: React.PropTypes.func,
    currentlySearching: React.PropTypes.bool,
  },

  getInitialState: function() {
    return {
      draggingOverCounter: 0,
      editing: false,
      newTitle: '',
      tabIndex: -1,
      sourceGroup: -1,
    };
  },

  render: function() {
    let buttonClasses = classNames({
      draggingOver: this.state.draggingOverCounter !== 0,
      hiddenBySearch: this.props.currentlySearching,
      addButton: true
    });

    let button = [];
    if (this.state.editing) {
      button.push(browser.i18n.getMessage("group_name") + ': ');
      button.push(React.DOM.input({
        autoFocus: true,
        type: "text",
        onChange: (event) => {
          this.setState({
            newTitle: event.target.value
          });
        },
        onClick: (event) => {
          event.stopPropagation();
        },
        onFocus: (e) => {
          e.target.select();
        },
        onKeyUp: this.handleGroupTitleInputKey
      }));
      button.push(
        React.DOM.span({
          className: "groupadd-controls"
        }, [
          React.DOM.i({
            className: "group-edit fa fa-fw fa-check",
            onClick: this.onTitleSet
          }),
          React.DOM.i({
            className: "group-edit fa fa-fw fa-ban",
            onClick: this.onEditAbort
          })
        ])
      );
    } else {
      button.push(
        React.DOM.span({

          },
          browser.i18n.getMessage("add_group"))
      );
    }

    return (
      React.DOM.li({
          className: buttonClasses,
          onClick: this.handleClick,
          onDrop: this.handleDrop,
          onDragOver: this.handleGroupDragOver,
          onDragEnter: this.handleDragEnter,
          onDragLeave: this.handleDragLeave
        },
        React.DOM.span({
            className: "group-title"
          },
          button)
      )
    );
  },

  onEditAbort: function(event) {
    event.stopPropagation();
    this.setState({
      editing: false,
      newTitle: '',
    });
  },

  resetButton: function() {
    this.setState({
      editing: false,
      newTitle: '',
      tabIndex: -1,
      sourceGroup: -1
    });
  },

  onTitleSet: function(event) {
    event.stopPropagation();
    if (this.state.tabIndex >= 0 && this.state.sourceGroup >= 0) {
      this.props.onDrop(
        this.state.newTitle,
        this.state.sourceGroup,
        this.state.tabIndex,
      );
    } else {
      this.props.onClick(this.state.newTitle);
    }
    this.resetButton();
  },

  handleGroupTitleInputKey: function(event) {
    event.stopPropagation();
    if (event.keyCode === 13) { // Enter key
      this.onTitleSet(event);
    }
  },

  handleClick: function(event) {
    event.stopPropagation();
    if (!this.state.editing) {
      if (event.button === 1) { // Mouse middle click
        this.props.onClick('');
        this.resetButton();
      } else {
        this.setState({
          editing: true
        });
      }
    }
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "group") {
      event.dataTransfer.dropEffect = "none"
    }
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "tab") {
      this.setState({
        draggingOverCounter: (this.state.draggingOverCounter == 1) ? 2 : 1
      });
    } else {
      event.dataTransfer.dropEffect = "none"
    }
  },

  handleDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();
    /*
    if (this.state.draggingOverCounter === 1) {
      event.dataTransfer.dropEffect = "move";
    }
    */
    this.setState({
      draggingOverCounter: this.state.draggingOverCounter == 2 ? 1 : 0
    });
  },

  handleDrop: function(event) {
    event.stopPropagation();

    this.setState({
      draggingOverCounter: 0,
    });

    //TODO:
    return;

    this.setState({
      draggingOverCounter: 0,
      editing: true,
      sourceGroup: parseInt(event.dataTransfer.getData("tab/group")),
      tabIndex: parseInt(event.dataTransfer.getData("tab/index"))
    });
  },

});
