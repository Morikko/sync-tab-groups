class MainBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maximized: false
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
      "fa-fw": true
    });

    let title_expand = this.props.maximized ? browser.i18n.getMessage("reduce_menu") : browser.i18n.getMessage("expand_menu");

    let label = browser.i18n.getMessage(this.props.isSync ? "synchronized_window" : "unsynchronized_window");

    return React.createElement(
      "li",
      { className: "mainbar" },
      React.createElement(
        "div",
        {
          className: classNames({
            "grouped-button": true,
            "group-visible": this.props.isSync,
            "incognito": this.props.isIncognito
          }),
          onClick: this.handleCheckChange },
        React.createElement("i", { className: classNames({
            "app-pref": true,
            "fa fa-fw": true,
            "fa-check-square-o": this.props.isSync,
            "fa-square-o": !this.props.isSync
          }) }),
        React.createElement(
          "span",
          null,
          label
        )
      ),
      React.createElement(
        "div",
        { className: "manage-button" },
        React.createElement("i", { className: "fa fa-fw fa-list" }),
        React.createElement(
          "span",
          null,
          "Manage groups"
        )
      ),
      React.createElement(
        "div",
        { className: "right-actions" },
        React.createElement("i", {
          className: "app-pref fa fa-fw fa-angle-double-down",
          title: browser.i18n.getMessage("expand_all_groups"),
          onClick: this.handleOpenAllExpand
        }),
        React.createElement("i", {
          className: "app-pref fa fa-fw fa-angle-double-up",
          title: browser.i18n.getMessage("reduce_all_groups"),
          onClick: this.handleCloseAllExpand
        }),
        React.createElement("i", {
          className: maximizerClasses,
          title: title_expand,
          onClick: this.props.onClickMaximize
        }),
        React.createElement("i", {
          className: "app-pref fa fa-fw fa-gear",
          title: browser.i18n.getMessage("open_preferences"),
          onClick: this.handleClickPref
        })
      )
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
  isIncognito: PropTypes.bool,
  currentWindowId: PropTypes.number.isRequired,
  handleAllChangeExpand: PropTypes.func
};