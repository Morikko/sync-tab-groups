/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
class GroupAddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingOverCounter: 0,
      editing: false,
      newTitle: '',
      tabIndex: -1,
      sourceGroup: -1
    };

    this.onEditAbort = this.onEditAbort.bind(this);
    this.onTitleSet = this.onTitleSet.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleGroupDragOver = this.handleGroupDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  render() {
    let buttonClasses = classNames({
      draggingOver: this.state.draggingOverCounter !== 0,
      hiddenBySearch: this.props.currentlySearching,
      addButton: true
    });

    let button;
    if (this.state.editing) {
      button = React.createElement(
        "span",
        { className: "group-title" },
        React.createElement(
          "span",
          null,
          browser.i18n.getMessage("group_name") + ': '
        ),
        React.createElement("input", {
          className: "max-width-115",
          autoFocus: true,
          type: "text",
          onChange: event => {
            this.setState({
              newTitle: event.target.value
            });
          },
          onClick: e => e.stopPropagation(),
          onMouseUp: e => e.stopPropagation(),
          onFocus: e => {
            e.target.select();
          }
        }),
        React.createElement(
          "span",
          {
            className: "groupadd-controls",
            onMouseUp: e => e.stopPropagation() },
          React.createElement("i", {
            className: "group-edit fa fa-fw fa-check",
            onClick: this.onTitleSet
          }),
          React.createElement("i", {
            className: "group-edit fa fa-fw fa-ban",
            onClick: this.onEditAbort
          })
        )
      );
    } else {
      button = React.createElement(
        "span",
        { className: "group-title" },
        React.createElement(
          "span",
          null,
          browser.i18n.getMessage("add_group")
        )
      );
    }

    return React.createElement(
      "div",
      {
        className: buttonClasses,
        onMouseUp: this.handleClick,
        onDrop: this.handleDrop,
        onDragOver: this.handleGroupDragOver,
        onDragEnter: this.handleDragEnter,
        onDragLeave: this.handleDragLeave,
        onKeyDown: Utils.doActivateHotkeys(addButtonNavigationListener(this), this.props.hotkeysEnable),
        tabIndex: "0"
      },
      button
    );
  }

  onEditAbort(event) {
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      editing: false,
      newTitle: ''
    });
  }

  resetButton() {
    this.setState({
      editing: false,
      newTitle: '',
      tabIndex: -1,
      sourceGroup: -1
    });
  }

  onTitleSet(event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.state.tabIndex >= 0 && this.state.sourceGroup >= 0) {
      this.props.onDrop(this.state.newTitle, this.state.sourceGroup, this.state.tabIndex);
    } else {
      this.props.onClick(this.state.newTitle);
    }
    this.resetButton();
  }

  handleClick(event) {
    event.stopPropagation();
    if (!this.state.editing) {
      if (event.button === 1) {
        // Mouse middle click
        this.props.onClick('');
        this.resetButton();
      } else {
        this.setState({
          editing: true
        });
      }
    }
  }

  handleGroupDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "group") {
      event.dataTransfer.dropEffect = "none";
    }
  }

  handleDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "tab") {
      this.setState({
        draggingOverCounter: this.state.draggingOverCounter == 1 ? 2 : 1
      });
    } else {
      event.dataTransfer.dropEffect = "none";
    }
  }

  handleDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      draggingOverCounter: this.state.draggingOverCounter == 2 ? 1 : 0
    });
  }

  handleDrop(event) {
    event.stopPropagation();

    this.setState({
      draggingOverCounter: 0
    });

    this.setState({
      draggingOverCounter: 0,
      editing: true,
      sourceGroup: parseInt(event.dataTransfer.getData("tab/group")),
      tabIndex: parseInt(event.dataTransfer.getData("tab/index"))
    });
  }

};

GroupAddButton.propTypes = {
  onClick: PropTypes.func,
  onDrop: PropTypes.func,
  currentlySearching: PropTypes.bool
};