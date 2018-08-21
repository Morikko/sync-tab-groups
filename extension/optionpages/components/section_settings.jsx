class SettingsSection extends React.Component {
  constructor(props) {
    super(props);

    this.clickOnVisible = this.clickOnVisible.bind(this);
    this.clickOnInvisible = this.clickOnInvisible.bind(this);
    this.clickOnExcluded = this.clickOnExcluded.bind(this);
    this.clickOnIncluded = this.clickOnIncluded.bind(this);
    this.clickOnPrivate = this.clickOnPrivate.bind(this);
    this.clickOnPrivateInvisible = this.clickOnPrivateInvisible.bind(this);
    this.handleRemoveUnknownHiddenTabsCheckboxChange =    
      this.handleRemoveUnknownHiddenTabsCheckboxChange.bind(this);
  }
  render() {
    return (
      <div
        className={"option-section " + (this.props.selected==="settings"?
        "visible":"invisible")}>
        <h1 className="section-title">
          {browser.i18n.getMessage("options_settings")}
        </h1>
        {this.getWindowsSubsection()}
        {this.getPinnedSubsection()}
        {this.getOpeningSubsection()}
        {this.getPrivateWindowsSubsection()}
        {this.getOthersSubsection()}
        {Utils.hasHideFunction() && this.getClosingSubsection()}
      </div>
    );
  }

  getWindowsSubsection() {
    return (
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
    );
  }

  getPinnedSubsection() {
    return (
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
    );
  }

  getOpeningSubsection() {
    return (
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
            <div className="double-buttons">
              <OptionButton
                title= {browser.i18n.getMessage("options_behaviors_tabsopening_reload")}
                onClick= {this.handleClickOnCloseAllHiddenTabs.bind(this)}
                highlight={true}
              />
            </div>
          </div>
        }
      />
    );
  }

  getClosingSubsection() {
    return (
      <SubSection
        title={"Closing Behavior"}
        tooltip={
          <div>
            Still experimental, read the manual page.
          </div>
        }
        content={
          <div>
            <div className="double-buttons">
              <OptionButton
                title= {"Close"}
                onClick= {this.clickOnClosingClose.bind(this)}
                key="closing-close"
                highlight={this.props.options.groups.closingState === OptionManager.CLOSE_NORMAL}
              />
              <OptionButton
                title= {"Hidden"}
                onClick= {this.clickOnClosingHidden.bind(this)}
                key="closing-hidden"
                highlight={this.props.options.groups.closingState === OptionManager.CLOSE_HIDDEN}
              />
            </div>
            <NiceCheckbox
              checked= {this.props.options.groups.discardedHide}
              label= {browser.i18n.getMessage("setting_discard_hidden_tab")}
              onCheckChange= {this.props.onOptionChange}
              id= "groups-discardedHide"
            />
            <NiceCheckbox
              checked= {this.props.options.groups.removeUnknownHiddenTabs}
              label= {browser.i18n.getMessage("setting_remove_unknown_hidden_tabs")}
              onCheckChange= {
                this.handleRemoveUnknownHiddenTabsCheckboxChange
              }
              id="groups-removeUnknownHiddenTabs"
            />
            <div className="double-buttons">
              <OptionButton
                title= {
                  browser.i18n.getMessage("setting_close_all_hidden_tabs")
                }
                onClick= {this.handleClickOnCloseAllHiddenTabs.bind(this)}
                highlight={true}
              />
            </div>
          </div>
        }
      />
    );
  }

  handleRemoveUnknownHiddenTabsCheckboxChange(id, val) {
    const msg = browser.i18n.getMessage("setting_confirm_unknown_hidden_tabs")
    if( val && !confirm(msg)) {
      this.props.onOptionChange(id, !val);
      return;
    }
    this.props.onOptionChange(id, val);
  }

  getPrivateWindowsSubsection() {
    return (
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
    );
  }

  getOthersSubsection() {
    return (
        <SubSection
          title={browser.i18n.getMessage("options_settings_others")}
          tooltip={undefined}
          content = {
            <div>
              <NiceCheckbox
                checked= {this.props.options.groups.removeEmptyGroup}
                label= {browser.i18n.getMessage("remove_empty_groups")}
                onCheckChange= {this.props.onOptionChange}
                id= "groups-removeEmptyGroup"
              />
              <NiceCheckbox
                checked={this.props.options.log.enable}
                label={browser.i18n.getMessage("setting_enable_error_log")}
                onCheckChange= {this.props.onOptionChange}
                id="log-enable"
              />
              <div className="double-buttons">
                <OptionButton
                  title= {browser.i18n.getMessage("setting_download_error_log")}
                  onClick= {(event) => this.props.downloadErrorLog()}
                  highlight={true}
                  disabled={!this.props.options.log.enable}
                />
              </div>
            </div>
          }
        />
    );
  }



  async handleClickOnUndiscardAllTabs() {

    const tabs = await browser.tabs.query({});
    let hadDiscarded = false;
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

  async handleClickOnCloseAllHiddenTabs() {
    const hiddenTabs = await browser.tabs.query({hidden: true});

    if( hiddenTabs.length > 0 ) {
      if (confirm(browser.i18n.getMessage("setting_confirm_close_all_hidden_tabs"))) {
          this.props.onCloseAllHiddenTabs();
      }
    } else {
      browser.notifications.create("CLOSE_HIDDEN_TABS", {
        "type": "basic",
        "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
        "title": "Sync Tab Groups",
        "message": browser.i18n.getMessage("setting_nothin_close_all_hidden_tabs"),
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
    if ( this.props.options.groups.closingState === OptionManager.CLOSE_HIDDEN){
      if (confirm(
        browser.i18n.getMessage("switch_pinned_included_disable_hidden"))
      ){
        this.props.onOptionChange("pinnedTab-sync", true);
      }
    } else {
      this.props.onOptionChange("pinnedTab-sync", true);
    }
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

  clickOnClosingClose(){
    this.props.onOptionChange("groups-closingState", OptionManager.CLOSE_NORMAL);
  }

  clickOnClosingAlive(){
    this.props.onOptionChange("groups-closingState", OptionManager.CLOSE_ALIVE);
  }

  clickOnClosingHidden(){
    if ( this.props.options.pinnedTab.sync ) {
      if (confirm(browser.i18n.getMessage("switch_hidden_disable_sync_pinned"))) {
        this.props.onOptionChange("groups-closingState", OptionManager.CLOSE_HIDDEN);
      }
    } else {
      this.props.onOptionChange("groups-closingState", OptionManager.CLOSE_HIDDEN);
    }
  }
};

SettingsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string,
};
