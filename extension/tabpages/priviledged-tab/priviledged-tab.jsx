function handleCopyClipBoard() {
  Utils.copyToTheClipBoard(Utils.getParameterByName('url'));
}

document.addEventListener("DOMContentLoaded", () => {

  let tab_title = Utils.getParameterByName('title').replace('+', ' '),
    tab_url = Utils.getParameterByName('url'),
    favIconUrl = Utils.getParameterByName('favIconUrl');
  // Set tab title
  document.title = tab_title;
  // Set tab icon
  Utils.setIcon(favIconUrl);

  ReactDOM.render(
    (<div>
      <div className="title">
        <img
          src="../../share/icons/tabspace-active-64.png"
          alt="Sync Tab Groups icon"
          width="64"
          height="64"
        />
        "Sync Tab Groups"
      </div>
      <div className="tab_information">
        <h1 className="privileged-url">
          {browser.i18n.getMessage("tab_information")}
        </h1>
        <ul>
          <li>{browser.i18n.getMessage("tab_title") + ": " + tab_title}</li>
          <li>{browser.i18n.getMessage("tab_address") + ": " + tab_url}</li>
        </ul>
        <OptionButton
          title={browser.i18n.getMessage("copy_url")}
          onClick={handleCopyClipBoard}
        />
      </div>
      <div className="help">
        <h1 className="privileged-url">
          {browser.i18n.getMessage("privileged_url")}
        </h1>
        <ul>
          <li className="help_1">{browser.i18n.getMessage("privileged_url_help_reason")}</li>
          <ul className="list_help">
            <li>chrome: URLs</li>
            <li>javascript: URLs</li>
            <li>data: URLs</li>
            <li>file: URLs (i.e., files on the filesystem)</li>
            <li>privileged about: URLs (for example, about:config, about:addons, about:debugging)</li>
          </ul>
          <li className="help_2">{browser.i18n.getMessage("open_url_help_method")}</li>
          <ol>
            <li>{browser.i18n.getMessage("open_url_help_method_part_1")}</li>
            <li>{browser.i18n.getMessage("open_url_help_method_part_2")}</li>
            <li>{browser.i18n.getMessage("open_url_help_method_part_3")}</li>
          </ol>
        </ul>
      </div>
    </div>)
    , document.getElementById("content"));

});
