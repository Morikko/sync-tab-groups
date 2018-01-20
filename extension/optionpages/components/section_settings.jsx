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
              Settings
            </h1>
            <SubSection
              title={browser.i18n.getMessage("state_new_normal_window")}
              tooltip={
                  <div>
                    <h2>Window Help:</h2>
                    <ul>
                      <li>Invisible</li>
                      <ul>
                        <li>New windows created without the Extension are Invisible.</li>
                      </ul>
                      <li>Visible</li>
                      <ul>
                        <li>New windows created without the Extension are Visible as a new unnamed group.</li>
                      </ul>
                      <li>Any window can be changed to visible/invisible from the Menu.</li>
                    </ul>
                  </div>
              }
              content={
                <div>
                  <OptionButton
                    title= {"Visible"}
                    onClick= {this.clickOnVisible}
                    enabled={this.props.options.groups.syncNewWindow}
                  />
                  <OptionButton
                    title= {"Invisible"}
                    onClick= {this.clickOnInvisible}
                    enabled={!this.props.options.groups.syncNewWindow}
                  />
                </div>
              }
            />
            <SubSection
              title={browser.i18n.getMessage("pinned_tabs_title")}
              tooltip={
                [
                  <h2 key="help_pinned_title">Pinned Tabs Help:</h2>,
                  <ul key="help_pinned_content">
                    <li>Excluded</li>
                    <ul>
                      <li>Pinned tabs are not part of any groups.</li>
                      <li>Switching/closing actions don't impact the pinned tabs.</li>
                      <li>Use case: Global Tabs (Mail tab, Music tab...)</li>
                    </ul>
                    <li>Included</li>
                    <ul>
                      <li>Pinned tabs are part of the group in the window.</li>
                      <li>Switching/closing actions close and save the pinned tabs in the group.</li>
                      <li>Use case: Important tabs for the group.</li>
                    </ul>
                  </ul>
                ]
              }
              content={
                [
                  <OptionButton
                    title= {"Excluded"}
                    onClick= {this.clickOnExcluded}
                    key="pinned-excluded"
                    enabled={!this.props.options.pinnedTab.sync}
                  />,
                  <OptionButton
                    title= {"Included"}
                    onClick= {this.clickOnIncluded}
                    key="pinned-included"
                    enabled={this.props.options.pinnedTab.sync}
                  />,
                ]
              }
            />
            <SubSection
              title={"Tab Opening Behavior"}
              tooltip={
                <ul>
                  <li>Discarded (Faster and Lighter)</li>
                  <ul>
                    <li>Tabs are not fully loaded on opening.</li>
                    <li>The tabs are only loaded once you click on it. After, they stay loaded.</li>
                  </ul>
                  <li>Full</li>
                  <ul>
                    <li>Tabs are completely loaded on opening.</li>
                    <li>Consume more memory and network data.</li>
                  </ul>
                  <li>Limits (In both cases)</li>
                  <ul>
                    <li>Tabs History are not restored. (Limited by the browser)</li>
                    <li>Temporary data (forms...) added before tabs were closed are lost. (Limited by the browser)</li>
                  </ul>
                </ul>
              }
              content = {
                [<OptionButton
                  title= {"Discarded"}
                  onClick= {this.clickOnOpenDiscarded.bind(this)}
                  enabled={this.props.options.groups.discardedOpen}
                  key="opening-tab-discarded"
                />,
                <OptionButton
                  title= {"Full"}
                  onClick= {this.clickOnOpenFull.bind(this)}
                  enabled={!this.props.options.groups.discardedOpen}
                  key="opening-tab-full"
                />,]
              }
            />
            <SubSection
              title={browser.i18n.getMessage("private_window_title")}
              tooltip={
                <ul>
                  <li>Private (Respect the private behavior)</li>
                  <ul>
                    <li>New private windows are visible as a new private groups</li>
                    <li>Groups opened in private windows are private as well.</li>
                    <li>Private groups are not saved on the disk</li>
                    <li>A private group closed is automatically deleted.</li>
                    <li>A restart of the browser will closed and deleted all the private groups.</li>
                  </ul>
                  <li>Invisible</li>
                  <ul>
                    <li>New private windows are visible as a new private groups</li>
                  </ul>
                  <li>Any private window can be changed from private/invisible from the Menu.</li>
                </ul>
              }
              content = {
                [<OptionButton
                  title= {"Private"}
                  onClick= {this.clickOnPrivate}
                  enabled={this.props.options.privateWindow.sync}
                  key="private-window-private"
                />,
                <OptionButton
                  title= {"Invisible"}
                  onClick= {this.clickOnPrivateInvisible}
                  enabled={!this.props.options.privateWindow.sync}
                  key="private-window-invisible"
                />,]
              }
            />
            <h2>
              Others
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
