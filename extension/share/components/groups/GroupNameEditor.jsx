import React from 'react'

class GroupNameEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      newTitle: '',
    };

    this.onEditAbort = this.onEditAbort.bind(this);
    this.onTitleSet = this.onTitleSet.bind(this);
  }

  render() {
    return (
      <span className="edit-group-title">
        <span>
          {browser.i18n.getMessage("group_name") + ': '}
        </span>
        <input
          className="max-width-115"
          autoFocus
          type="text"
          onChange={(event) => {
            this.setState({
              newTitle: event.target.value,
            });
          }}
          onClick={(e)=>e.stopPropagation()}
          onMouseUp={(e)=>e.stopPropagation()}
          onFocus={(e) => {
            e.target.select();
          }}
        />
        <span
          className="groupadd-controls"
          onMouseUp={(e)=>e.stopPropagation()}>
          <i
            className="group-edit fa fa-fw fa-check"
            onClick={this.onTitleSet}
          ></i>
          <i
            className="group-edit fa fa-fw fa-ban"
            onClick={this.onEditAbort}
          ></i>
        </span>
      </span>
    );
  }

  onEditAbort(event) {
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      editing: false,
      newTitle: '',
    });
  }

  resetButton() {
    this.setState({
      editing: false,
      newTitle: '',
    });
  }

  onTitleSet(event) {
    if (event) {
      event.stopPropagation();
    }
    this.resetButton();
  }
}

export default GroupNameEditor