class MainBar extends React.Component {
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

    let title_expand = this.props.maximized ? browser.i18n.getMessage("reduce_menu") : browser.i18n.getMessage("expand_menu");

    let labelSynchronized = browser.i18n.getMessage("synchronized_window");
    let titleSynchronized = browser.i18n.getMessage(
      (this.props.isSync?"change_window_invisible":"change_window_visible")
    );

    return (
      <li className="mainbar">
        <div
          id="change-visibility"
          className={classNames({
            "grouped-button": true,
            "group-visible": this.props.isSync,
            "incognito": this.props.isIncognito,
          })}
          onClick={this.handleCheckChange}
          title={titleSynchronized}>
          <i className={classNames({
            "app-pref": true,
            "fa fa-fw": true,
            "fa-check-square-o": this.props.isSync,
            "fa-square-o": !this.props.isSync,
          })}/>
          <span>{labelSynchronized}</span>
        </div>
        <div  className="manage-button"
              id="open-manager"
              onClick={this.handleClickManageButton}
              title={browser.i18n.getMessage("open_manager")}>
          <i className="fa fa-fw fa-list"/>
          <span>{browser.i18n.getMessage("group_manager")}</span>
        </div>
        <div className="right-actions">
          <i
            className="app-pref fa fa-fw fa-angle-double-down expand-groups"
            title={browser.i18n.getMessage("expand_all_groups")}
            onClick={this.handleOpenAllExpand}
          />
          <i
            className="app-pref fa fa-fw fa-angle-double-up reduce-groups"
            title={browser.i18n.getMessage("reduce_all_groups")}
            onClick={this.handleCloseAllExpand}
          />
          <i
            id="maximize-popup"
            className={maximizerClasses}
            title={title_expand}
            onClick={this.props.onClickMaximize}
          />
          <i
            id="open-preferences"
            className="app-pref fa fa-fw fa-gear"
            title={browser.i18n.getMessage("contextmenu_preferences")}
            onClick={this.handleClickPref}
          />
        </div>

      </li>
    );
  }

  handleClickManageButton(event) {
    event.stopPropagation();
    Utils.openUrlOncePerWindow(browser.extension.getURL(
      "/tabpages/manage-groups/manage-groups.html"
    )).then(()=>{ // Let time to window to Open
      window.close();
    })
  }

  handleOpenAllExpand(event) {
    event.stopPropagation();
    this.props.handleAllChangeExpand(true);
  }

  handleCloseAllExpand(event) {
    event.stopPropagation();
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
  isIncognito: PropTypes.bool,
  currentWindowId: PropTypes.number.isRequired,
  handleAllChangeExpand: PropTypes.func,
};
