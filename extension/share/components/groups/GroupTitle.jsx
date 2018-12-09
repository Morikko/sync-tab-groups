import React from 'react'
import GroupNameEditor from './GroupNameEditor';
import PropTypes from 'prop-types'
import Utils from '../../../background/utils/utils'

class GroupTitle extends GroupNameEditor {
  constructor(props) {
    super(props);
    this.state.editing = this.props.editing
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editing!==prevState.editing) {
      return { editing: nextProps.editing};
    } else return null;
  }

  render() {
    if (this.props.editing) {
      return super.render()
    } else {
      let title = this.props.defaultName;
      if (this.props.showTabsNumber) {
        title = title + "  (" + this.props.group.tabs.length + ")";
      }
      return (
        <span className="group-title-text">
          {title}
        </span>);
    }
  }

  onEditAbort(event) {
    if (event) {
      event.stopPropagation();
    }

    this.resetButton();
  }

  onTitleSet(event) {
    if (event) {
      event.stopPropagation();
    }

    this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
    this.resetButton();
  }

  resetButton() {
    this.setState({
      editing: false,
      newTitle: Utils.getGroupTitle(this.props.group),
    });
    this.props.setEditing(false)
  }
}

GroupTitle.propTypes = {
  group: PropTypes.object,
  showTabsNumber: PropTypes.bool,
  setEditing: PropTypes.func,
}


export default GroupTitle