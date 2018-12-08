import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Utils from '../../../../background/utils/utils'
import Action from './Action'

class ActionsMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPanel: "menu",
      menuPosition: ActionsMenu.POSITION.TOP,
      show: false,
      maxHeight: window.innerHeight/2,
    };

    this.closeMenuTimeout = undefined;
    this.getHtmlTagFromAction = this.getHtmlTagFromAction.bind(this)
  }

  render() {
    const menu = (
      <div  className={classNames({
        "tab-actions-menu": true,
        "top": this.state.menuPosition === ActionsMenu.POSITION.TOP,
        "bottom": this.state.menuPosition === ActionsMenu.POSITION.BOTTOM,
        "middle": this.state.menuPosition === ActionsMenu.POSITION.MIDDLE,
        "show": true,
      })}>
        {this.renderPanel()}
      </div>
    )
    const fullClassNames = "fa fa-fw fa-exchange tab-actions "
      + this.props.customClassNames || ""
    return (
      <i
        key="tooltip"
        title={browser.i18n.getMessage("tab_show_actions_menu")}
        className={fullClassNames}
        onClick={this.handleOpenExtraActions.bind(this)}
        onMouseLeave={this.handleMouseLeaveExtraActions.bind(this)}
        onMouseEnter={this.handleMouseEnterExtraActions.bind(this)}>
        {this.state.show && menu}
      </i>
    )
  }

  renderPanel() {
    if (this.state.currentPanel === "menu") {
      return this.renderMenuPanel()
    } else {
      return this.renderExtraPanel(this.props.extraPanels[this.state.currentPanel])
    }
  }

  renderExtraPanel(panelTemplate) {
    return (
      <div className={classNames({
        "tab-move-to-group-panel": true,
        "hiddenBySearch": this.state.currentPanel === "menu",
      })}
      style={{maxHeight: this.state.maxHeight}}>
        <span
          className="row"
          onClick={((event)=> {
            if (event) event.stopPropagation();
            this.switchToPanel("menu");
          }).bind(this)}>
          <i className="fa fa-fw fa-chevron-left" />
          {"Back"}
        </span>
        <span className="separator"></span>
        {panelTemplate.map(this.getHtmlTagFromAction)}
      </div>
    )
  }

  getHtmlTagFromAction(action) {
    if (action === "separator") {
      return <span className="separator"></span>
    }

    return (
      <span
        key={action.key}
        className="row"
        disabled={action.disabled}
        onClick={((event)=>{
          if (event) {
            event.stopPropagation();
          }
          if (typeof action.action === "function") {
            action.action();
          } else {
            this.switchToPanel(action.action)
          }
          if (action.close) this.closeExtraActions();
        }).bind(this)}>
        {action.icon}
        {action.message}
      </span>
    )
  }

  renderMenuPanel() {
    return (
      <div className={classNames({
        "tab-actions-panel": true,
        "hiddenBySearch": this.state.currentPanel !== "menu",
      })}>
        {this.props.actions.map(this.getHtmlTagFromAction)}
      </div>
    )
  }


  handleOpenExtraActions(event) {
    if (event) {
      event.stopPropagation();
    }

    let parentGroupList = Utils.getParentElement(event.target, "group-list");

    let pos = Utils.getOffset(event.target, parentGroupList),
      height = parentGroupList.clientHeight;

    let menuPosition = ActionsMenu.POSITION.MIDDLE;

    if (pos < (height/2 + 34)) {
      menuPosition = ActionsMenu.POSITION.TOP;
    } else {
      menuPosition = ActionsMenu.POSITION.BOTTOM;
    }

    this.setState({
      menuPosition: menuPosition,
      show: !this.state.show,
      currentPanel: "menu",
      maxHeight: height/2,
    })
  }

  handleMouseLeaveExtraActions(event) {
    this.closeMenuTimeout = setTimeout(()=>{
      this.closeExtraActions();
      this.closeMenuTimeout = undefined;
    }, 500);
  }

  handleMouseEnterExtraActions(event) {
    if (this.closeMenuTimeout) {
      clearTimeout(this.closeMenuTimeout);
    }
  }

  switchToPanel(panel) {
    this.setState({
      currentPanel: panel,
    });
  }

  closeExtraActions() {
    this.setState({
      show: false,
      currentPanel: "menu",
    });
  }

  componentDidMount() {
    if (!this.state.waitFirstMount) {
      this.differedTimeOut = setTimeout(()=>{
        this.setState({
          waitFirstMount: true,
        });
      }, 500);
    }
  }

  componentWillUnmount() {
    if (this.differedTimeOut) {
      clearTimeout(this.differedTimeOut);
    }

    if (this.closeMenuTimeout) {
      clearTimeout(this.closeMenuTimeout);
    }
  }

}

ActionsMenu.propTypes = {
  actions: PropTypes.array,
  extraPanels: PropTypes.object,
  customClassNames: PropTypes.string,
}

ActionsMenu.POSITION = Object.freeze({
  TOP: Symbol("TOP"),
  MIDDLE: Symbol("Middle"),
  BOTTOM: Symbol("BOTTOM"),
})

export default ActionsMenu
export {
  Action,
}