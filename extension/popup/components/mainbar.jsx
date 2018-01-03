class MainBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      maximized: false,
    };

    this.handleClickPref = this.handleClickPref.bind(this);
    this.handleCloseAllExpand = this.handleCloseAllExpand.bind(this);
    this.handleOpenAllExpand = this.handleOpenAllExpand.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  render() {
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
          <span>{browser.i18n.getMessage("synchronized_window")}</span>
        </div>
        <div className="manage-button">
          Manage groups
        </div>
        <div className="right-actions">
          <i
            className="app-pref fa fa-fw fa-angle-double-down"
            title={browser.i18n.getMessage("expand_all_groups")}
            onClick={this.handleOpenAllExpand}
          />
          <i
            className="app-pref fa fa-fw fa-angle-double-up"
            title={browser.i18n.getMessage("reduce_all_groups")}
            onClick={this.handleCloseAllExpand}
          />
          <i
            className={maximizerClasses}
            title={title_expand}
            onClick={this.props.onClickMaximize}
          />
          <i
            className="app-pref fa fa-fw fa-gear"
            title={browser.i18n.getMessage("open_preferences")}
            onClick={this.handleClickPref}
          />
        </div>

      </li>
    );
  }

  handleOpenAllExpand(event) {
    this.props.handleAllChangeExpand(true);
  }

  handleCloseAllExpand(event) {
    this.props.handleAllChangeExpand(false);
  }

  handleClickPref(event) {
    event.stopPropagation();
    this.props.onClickPref();
    window.close();
  }

  handleCheckChange(event) {
    event.stopPropagation();
    this.props.onChangeWindowSync(this.props.currentWindowId, !this.props.isSync);
  }

  handleGroupDragOver(event) {
    event.stopPropagation();
  }

  handleDragEnter(event) {
    event.stopPropagation();
  }

  handleDragLeave(event) {
    event.stopPropagation();
  }

  handleDrop(event) {
    event.stopPropagation();
  }
};

MainBar.propTypes = {
  onChangeWindowSync: PropTypes.func,
  onClickPref: PropTypes.func,
  onClickMaximize: PropTypes.func,
  isSync: PropTypes.bool,
  currentWindowId: PropTypes.number.isRequired,
  handleAllChangeExpand: PropTypes.func,
};
