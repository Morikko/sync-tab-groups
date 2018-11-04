import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Utils from '../../background/utils/utils'

class SubSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipVisible: false,
      isOnTop: true,
    };
    this.setVisible = this.setVisible.bind(this);
    this.setInvisible = this.setInvisible.bind(this);
    this.updatePosition = this.updatePosition.bind(this);

    this.count = 0;
  }

  render() {
    let tooltipClass = classNames({
      "tooltip-visible": this.state.tooltipVisible,
      "tooltip-invisible": !this.state.tooltipVisible,
    }, "subsection tooltip");

    return (
      <div
        style={{
          //backgroundColor: "blue"
        }}
        className={tooltipClass}
        onMouseEnter={this.setVisible}
        onMouseLeave={this.setInvisible}
        onMouseMove={this.updatePosition}
      >
        {this.getTitle()}
        {this.getTooltip()}
        {this.getContent()}
      </div>
    );
  }

  setVisible(event) {
    this.setState({tooltipVisible: true})
    this.setPosition(
      event
    )
  }

  setInvisible(event) {
    this.setState({tooltipVisible: false})
  }

  setPosition(event) {
    let height = event.currentTarget.offsetHeight;

    if (height > (window.innerHeight/2)) {
      let pos = event.pageY
          - Utils.getOffset(event.currentTarget);
      if (pos > (height/2)) {
        this.setState({isOnTop: false})
      } else {
        this.setState({isOnTop: true})
      }
    } else {
      let pos = event.pageY;
      if (pos > (window.innerHeight/2)) {
        this.setState({isOnTop: false})
      } else {
        this.setState({isOnTop: true})
      }
    }


  }

  updatePosition(event) {
    this.count++;

    if (this.count===7) {
      this.setPosition(event);
      this.count = 0;
    }
  }

  getTooltip() {
    if (this.props.tooltip === undefined)
      return null;

    let style = {
      maxHeight: (window.innerHeight-200)+"px",
    };

    let tooltipClass = classNames({
      "tooltip-top": this.state.isOnTop,
      "tooltip-bottom": !this.state.isOnTop,
    }, "tooltiptext")

    return (
      <div
        className={tooltipClass}
        style={style}
      >
        {this.getTitleTooltip()}
        {this.props.tooltip}
      </div>
    );
  }

  getContent() {
    return (
      <div className="subsection-content">
        {this.props.content}
      </div>
    );
  }

  getTitle() {
    if (this.props.title === undefined)
      return null;
    return (
      <h2>
        {this.props.title}
      </h2>
    );
  }

  getTitleTooltip() {
    if (this.props.title === undefined)
      return null;
    return (
      <h2>
        {this.props.title + " "
        + browser.i18n.getMessage("options_help_title") + ": "}
      </h2>
    );
  }

  getId() {
    return this.props.title.toLowerCase().replace(" ", "_").replace("/", "_");
  }
}

SubSection.propTypes = {
  content: PropTypes.object,
  tooltip: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default SubSection