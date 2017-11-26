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
const Tab = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    tab: React.PropTypes.object.isRequired,
    tabIndex: React.PropTypes.number,
    opened: React.PropTypes.bool,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
  },

  render: function() {
    let favicon = React.DOM.img({
      alt: "",
      className: "tab-icon",
      src: this.props.tab.favIconUrl
    });

    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true
    });

    return (
      React.DOM.li({
          className: tabClasses,
          onDrag: this.handleTabDrag,
          onDragStart: this.handleTabDragStart,
          onClick: this.handleTabClick,
          draggable: true
        },
        favicon,
        React.DOM.span({
            className: "tab-title",
          },
          this.props.tab.title,
          React.createElement(
            TabControls, {
              opened: this.props.opened,
              onCloseTab: this.handleCloseTabClick,
              onOpenTab: this.handleOpenTabClick,
            }
          )),
      )
    );
  },

  handleTabClick: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    this.props.onTabClick(
      group.id,
      this.props.tabIndex
    );
  },

  handleOpenTabClick: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    this.props.onOpenTab(
      group.id,
      tab
    );
  },

  handleCloseTabClick: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    this.props.onCloseTab(
      tab.id,
      group.id,
      this.props.tabIndex
    );
  },

  handleTabDrag: function(event) {
    event.stopPropagation();
    /* TODO to keep ?
    let group = this.props.group;
    let tab = this.props.tab;
    event.dataTransfer.setData("tab/index", tab.index);
    event.dataTransfer.setData("tab/group", group.id);

    this.props.onTabDrag(
      group.id,
      tab.index
    );
    */
  },

  handleTabDragStart: function(event) {
    event.stopPropagation();

    let group = this.props.group;
    let tab = this.props.tab;
    event.dataTransfer.setData("tab/index", this.props.tabIndex);
    event.dataTransfer.setData("tab/group", group.id);

    this.props.onTabDragStart(
      group.id,
      tab.index
    );
  }
});
