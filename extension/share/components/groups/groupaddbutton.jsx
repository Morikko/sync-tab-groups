import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Utils from '../../../background/utils/utils'

import {
  addButtonNavigationListener,
} from './wrapper/navigation'
import GroupNameEditor from './GroupNameEditor';

class GroupAddButton extends GroupNameEditor {
  constructor(props) {
    super(props);

    Object.assign(this.state, {
      draggingOverCounter: 0,
      tabIndex: -1,
      sourceGroup: -1,
    });

    this.handleClick = this.handleClick.bind(this);
    this.handleGroupDragOver = this.handleGroupDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);

  }

  render() {
    let buttonClasses = classNames({
      draggingOver: this.state.draggingOverCounter !== 0,
      hiddenBySearch: this.props.currentlySearching,
      addButton: true,
    });

    let button;
    if (this.state.editing) {
      button = super.render()
    } else {
      button = (
        <span className="add-button-title">
          <span>{browser.i18n.getMessage("add_group")}</span>
        </span>
      );
    }

    return (
      <div
        className={buttonClasses}
        onMouseUp={this.handleClick}
        onDrop={this.handleDrop}
        onDragOver={this.handleGroupDragOver}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onKeyDown={Utils.doActivateHotkeys(
          addButtonNavigationListener(this),
          this.props.hotkeysEnable)}
        tabIndex="0"
      >
        {button}
      </div>
    );
  }

  handleClick(event) {
    event.stopPropagation();
    if (!this.state.editing) {
      if (event.button === 1) { // Mouse middle click
        this.props.onClick('');
        this.resetButton();
      } else {
        this.setState({
          editing: true,
        });
      }
    }
  }

  handleGroupDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "group") {
      event.dataTransfer.dropEffect = "none"
    }
  }

  handleDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.getData("type") === "tab") {
      this.setState({
        draggingOverCounter: (this.state.draggingOverCounter === 1) ? 2 : 1,
      });
    } else {
      event.dataTransfer.dropEffect = "none"
    }
  }

  handleDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      draggingOverCounter: this.state.draggingOverCounter === 2 ? 1 : 0,
    });
  }

  handleDrop(event) {
    event.stopPropagation();

    this.setState({
      draggingOverCounter: 0,
    });

    this.setState({
      draggingOverCounter: 0,
      editing: true,
      sourceGroup: parseInt(event.dataTransfer.getData("tab/group")),
      tabIndex: parseInt(event.dataTransfer.getData("tab/index")),
    });
  }

  onTitleSet(event) {
    if (event) {
      event.stopPropagation();
    }
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
  }

}

GroupAddButton.propTypes = {
  onClick: PropTypes.func,
  onDrop: PropTypes.func,
  currentlySearching: PropTypes.bool,
}

export default GroupAddButton