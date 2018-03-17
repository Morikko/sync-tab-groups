class SettingsSection extends React.Component {
  constructor(props) {
    super(props);

    this.clickOnVisible = this.clickOnVisible.bind(this);
    this.clickOnInvisible = this.clickOnInvisible.bind(this);
    this.clickOnExcluded = this.clickOnExcluded.bind(this);
    this.clickOnIncluded = this.clickOnIncluded.bind(this);
    this.clickOnPrivate = this.clickOnPrivate.bind(this);
    this.clickOnPrivateInvisible = this.clickOnPrivateInvisible.bind(this);
  }
  render() {
    return (
      <div
        className={"option-section " + (this.props.selected==="settings"?
            "visible":"invisible")}>
            <h1 className="section-title">
              {browser.i18n.getMessage("options_settings")}
            </h1>
            <SubSection
              title={browser.i18n.getMessage("state_new_normal_window")}
              tooltip={
                    <div>
                      <ul>
                      <li>{browser.i18n.getMessage("options_behaviors_help_title_invisible")}</li>
                      <ul>
                        <li>{browser.i18n.getMessage("options_behaviors_help_invisible")}</li>
                      </ul>
                      <li>{browser.i18n.getMessage("options_behaviors_help_title_visible")}</li>
                      <ul>
                        <li>{browser.i18n.getMessage("options_behaviors_help_visible_new")}</li>
                      </ul>
                      <li>{browser.i18n.getMessage("options_behaviors_help_change_visibility")}</li>
                    </ul>
                  </div>
              }
              content={
                <div className="double-buttons">
                  <OptionButton
                    title= {browser.i18n.getMessage("options_behaviors_help_title_visible")}
                    onClick= {this.clickOnVisible}
                    highlight={this.props.options.groups.syncNewWindow}
                  />
                  <OptionButton
                    title= {browser.i18n.getMessage("options_behaviors_help_title_invisible")}
                    onClick= {this.clickOnInvisible}
                    highlight={!this.props.options.groups.syncNewWindow}
                  />
                </div>
              }
            />
            <SubSection
              title={browser.i18n.getMessage("pinned_tabs_title")}
              tooltip={
                  <div>
                    <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_pinned_excluded")}</li>
                    <ul>
                      <li>{browser.i18n.getMessage("options_behaviors_pinned_excluded_notpart")}</li>
                      <li>{browser.i18n.getMessage("options_behaviors_pinned_excluded_switching")}</li>
                      <li>{browser.i18n.getMessage("options_behaviors_pinned_excluded_usecase")}</li>
                    </ul>
                    <li>{browser.i18n.getMessage("options_behaviors_pinned_included")}</li>
                    <ul>
                      <li>{browser.i18n.getMessage("options_behaviors_pinned_included_part")}</li>
                      <li>{browser.i18n.getMessage("options_behaviors_pinned_included_switching")}</li>
                      <li>{browser.i18n.getMessage("options_behaviors_pinned_included_usecase")}</li>
                    </ul>
                  </ul>
                </div>
              }
              content={
                <div className="double-buttons">
                  <OptionButton
                    title= {browser.i18n.getMessage("options_behaviors_pinned_excluded")}
                    onClick= {this.clickOnExcluded}
                    key="pinned-excluded"
                    highlight={!this.props.options.pinnedTab.sync}
                  />
                  <OptionButton
                    title= {browser.i18n.getMessage("options_behaviors_pinned_included")}
                    onClick= {this.clickOnIncluded}
                    key="pinned-included"
                    highlight={this.props.options.pinnedTab.sync}
                  />
                </div>
              }
            />
            <SubSection
              title={browser.i18n.getMessage("options_behaviors_tabsopening")}
              tooltip={
              <div>
                <ul>
                  <li>{browser.i18n.getMessage("options_behaviors_tabsopening_discarded")}</li>
                  <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_discarded_lighter")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_discarded_notfullyloaded")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_discarded_loadedclick")}</li>
                  </ul>
                  <li>{browser.i18n.getMessage("options_behaviors_tabsopening_full")}</li>
                  <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_full_loadedopening")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_full_heavier")}</li>
                  </ul>
                  <li>{browser.i18n.getMessage("options_behaviors_tabsopening_limits")}</li>
                  <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_limits_history")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_limits_temporary")}</li>
                  </ul>
                  <li>{browser.i18n.getMessage("options_behaviors_tabsopening_recommendation")}</li>
                  <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_recommendation_button", [browser.i18n.getMessage("options_behaviors_tabsopening_reload")])}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_recommendation_state")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_tabsopening_recommendation_update")}</li>
                  </ul>
                </ul>
              </div>
              }
              content = {
                <div className="subsection-left">
                  <div className="double-buttons">
                  <OptionButton
                    title= {browser.i18n.getMessage("options_behaviors_tabsopening_discarded")}
                    onClick= {this.clickOnOpenDiscarded.bind(this)}
                    highlight={this.props.options.groups.discardedOpen}
                    key="opening-tab-discarded"
                  />
                  <OptionButton
                    title= {browser.i18n.getMessage("options_behaviors_tabsopening_full")}
                    onClick= {this.clickOnOpenFull.bind(this)}
                    highlight={!this.props.options.groups.discardedOpen}
                    key="opening-tab-full"
                  />
                </div>
                <OptionButton
                  title= {browser.i18n.getMessage("options_behaviors_tabsopening_reload")}
                  onClick= {this.handleClickOnUndiscardAllTabs.bind(this)}
                  highlight={true}
                />
                </div>
              }
            />
            <SubSection
              title={browser.i18n.getMessage("private_window_title")}
              tooltip={
                <div>
                  <ul>
                  <li>{browser.i18n.getMessage("options_behaviors_private")}</li>
                  <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_private_visible")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_private_groups")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_private_notsaved")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_private_autoremoved")}</li>
                    <li>{browser.i18n.getMessage("options_behaviors_private_restart")}</li>
                  </ul>
                  <li>{browser.i18n.getMessage("options_behaviors_private_invisible")}</li>
                  <ul>
                    <li>{browser.i18n.getMessage("options_behaviors_private_invisible_creation")}</li>
                  </ul>
                  <li>{browser.i18n.getMessage("options_behaviors_private_changestate")}</li>
                </ul>
                </div>
              }
              content = {
                <div className="double-buttons">
                  <OptionButton
                  title= {browser.i18n.getMessage("options_behaviors_private")}
                  onClick= {this.clickOnPrivate}
                  highlight={this.props.options.privateWindow.sync}
                  key="private-window-private"
                />
                <OptionButton
                  title= {browser.i18n.getMessage("options_behaviors_private_invisible")}
                  onClick= {this.clickOnPrivateInvisible}
                  highlight={!this.props.options.privateWindow.sync}
                  key="private-window-invisible"
                />
              </div>
              }
            />
            <h2>
              {browser.i18n.getMessage("options_settings_others")}
            </h2>
            <NiceCheckbox
              checked= {this.props.options.groups.removeEmptyGroup}
              label= {browser.i18n.getMessage("remove_empty_groups")}
              onCheckChange= {this.props.onOptionChange}
              id= "groups-removeEmptyGroup"
            />
      </div>
    );
  }



  async handleClickOnUndiscardAllTabs() {

    let tabs = await browser.tabs.query({}),
      hadDiscarded = false;
    tabs.forEach(async (tab)=>{
        if( tab.url.includes(Utils.LAZY_PAGE_URL)) {
          hadDiscarded = true;
        }
      });

    if( hadDiscarded ) {
      if (confirm(browser.i18n.getMessage("options_behaviors_tabsopening_confirm_reload"))) {
          this.props.onUndiscardLazyTabs();
      }
    } else {
      browser.notifications.create("RELOAD_TABS", {
        "type": "basic",
        "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
        "title": "Sync Tab Groups",
        "message": browser.i18n.getMessage("options_behaviors_tabsopening_nothing_reload"),
      });
    }

  }

  clickOnVisible() {
    this.props.onOptionChange("groups-syncNewWindow", true);
  }

  clickOnInvisible() {
    this.props.onOptionChange("groups-syncNewWindow", false);
  }

  clickOnExcluded() {
    this.props.onOptionChange("pinnedTab-sync", false);
  }

  clickOnIncluded() {
    this.props.onOptionChange("pinnedTab-sync", true);
  }

  clickOnPrivate() {
    this.props.onOptionChange("privateWindow-sync", true);
  }

  clickOnPrivateInvisible() {
    this.props.onOptionChange("privateWindow-sync", false);
  }

  clickOnOpenFull() {
    this.props.onOptionChange("groups-discardedOpen", false);
  }

  clickOnOpenDiscarded() {
    this.props.onOptionChange("groups-discardedOpen", true);
  }
};

SettingsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string,
};
