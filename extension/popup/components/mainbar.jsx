const MainBar = React.createClass({
  propTypes: {
    onChangeWindowSync: React.PropTypes.func,
    onClickPref: React.PropTypes.func,
    onClickMaximize: React.PropTypes.func,
    isSync: React.PropTypes.bool,
    currentWindowId: React.PropTypes.number.isRequired,
  },

  getInitialState: function() {
    return {
      maximized: false,
    };
  },

  render: function() {
    let id = "window-is-sync";

    let maximizerClasses = classNames({
      "icon-maximized": !this.props.maximized,
      "icon-minimized": this.props.maximized,
      "fa-expand": !this.props.maximized,
      "fa-compress": this.props.maximized,
      "app-maximize": true,
      "fa": true,
      "fa-fw": true,
    });

    let title_expand = this.props.maximized? browser.i18n.getMessage("reduce_menu"):browser.i18n.getMessage("expand_menu");

    return (
      <li className="mainbar">
        <div className={"grouped-button "
                + (this.props.isSync?"window-grouped":"not-window-grouped")}
             onClick={this.handleCheckChange}>
          <i className={"app-pref fa fa-fw fa-"+(this.props.isSync?"check-":"")+"square-o"}/>
          {browser.i18n.getMessage("synchronized_window")}
        </div>
        <div className="manage-button">
          Manage groups
        </div>
        <div className="right-actions">
          <i
            className="app-pref fa fa-fw fa-gear"
            title={browser.i18n.getMessage("open_preferences")}
            onClick={this.handleClickPref}
          />
          <i
            className={maximizerClasses}
            title={title_expand}
            onClick={this.props.onClickMaximize}
          />
        </div>

      </li>
    );
  },

  handleClickPref: function(event) {
    event.stopPropagation();
    this.props.onClickPref();
    window.close();
  },

  handleCheckChange: function(event) {
    event.stopPropagation();
    this.props.onChangeWindowSync(this.props.currentWindowId, !this.props.isSync);
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
  },

  handleDragLeave: function(event) {
    event.stopPropagation();
  },

  handleDrop: function(event) {
    event.stopPropagation();
  }
});
