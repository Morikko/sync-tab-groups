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
const GroupAddButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    onDrop: React.PropTypes.func,
    currentlySearching: React.PropTypes.bool,
  },

  getInitialState: function() {
    return {
      draggingOverCounter: 0
    };
  },

  render: function() {
    let buttonClasses = classNames({
      draggingOver: this.state.draggingOverCounter !== 0,
      group: true,
      hiddenBySearch: this.props.currentlySearching,
      addButton: true
    });

    return (
      React.DOM.li(
        {
          className: buttonClasses,
          onClick: this.handleClick,
          onDrop: this.handleDrop,
          onDragOver: this.handleGroupDragOver,
          onDragEnter: this.handleDragEnter,
          onDragLeave: this.handleDragLeave
        },
        React.DOM.span(
          {className: "group-title"},
          browser.i18n.getMessage("add_group"),
        )
      )
    );
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.onClick();
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();

    let draggingCounterValue = (this.state.draggingOverCounter == 1) ? 2 : 1;
    this.setState({draggingOverCounter: draggingCounterValue});
  },

  handleDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.state.draggingOverCounter == 2) {
      this.setState({draggingOverCounter: 1});
    } else if (this.state.draggingOverCounter == 1) {
      this.setState({draggingOverCounter: 0});
    }
  },

  handleDrop: function(event) {
    event.stopPropagation();

    this.setState({draggingOverCounter: 0});

    let sourceGroup = parseInt(event.dataTransfer.getData("tab/group"), 10);
    let tabIndex = parseInt(event.dataTransfer.getData("tab/index"), 10);

    this.props.onDrop(
      sourceGroup,
      tabIndex
    );
  }
});
