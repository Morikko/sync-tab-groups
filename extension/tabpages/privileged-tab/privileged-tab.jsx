/** Page Example
  moz-extension://68ddee50-febc-45b5-bd3d-f7c6264e02a5/tabpages/privileged-tab/privileged-tab.html?title=Debugging%20with%20Firefox%20Developer%20Tools&url=about%3Adebugging&favIconUrl=undefined
 */

function handleCopyClipBoard() {
  let params = new URLSearchParams(window.location.search),
      url = params.get('url') || 'about:blank';
  let input = document.createElement('input');
  input.value = url;

  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
}
document.addEventListener("DOMContentLoaded", () => {

  let params = new URLSearchParams(window.location.search),
      url = params.get('url') || 'about:blank',
      title = params.get('title') || 'New tab',
      favIconUrl = params.get('favIconUrl'),
      tab_information = "Current Tab Information",
      tab_title = ("Title")+ ": " + title,
      tab_url = ("URL")+ ": " + url,
      copy_url = "Copy URL in the clipboard",
      privileged_url = "About Privileged URLs",
      privileged_url_help_reason = "Sync Tab Groups can't open directly privileged URLs for security reason:",
      open_url_help_method = "But you can open it manually:",
      open_url_help_method_part_1 = "Click on the button",
      open_url_help_method_part_2 = "Paste the URL in the address bar",
      open_url_help_method_part_3 = "Press Enter";


  // Set tab title
  document.title = title;
  // Set tab icon
  document.getElementById('favIconUrl').href = favIconUrl;

  ReactDOM.render(
    (<div>
      <div className="title">
        <img
          src="../../share/icons/tabspace-active-64.png"
          alt="Sync Tab Groups icon"
          width="64"
          height="64"
        />
        Sync Tab Groups
      </div>
      <div className="tab_information">
        <h1 className="privileged-url">
          {tab_information}
        </h1>
        <ul>
          <li>{tab_title}</li>
          <li>{tab_url}</li>
        </ul>
        <button
          type="button"
          onClick={handleCopyClipBoard}
        >{copy_url}</button>
      </div>
      <div className="help">
        <h1 className="privileged-url">
          {privileged_url}
        </h1>
        <ul>
          <li className="help_1">{privileged_url_help_reason}</li>
          <ul className="list_help">
            <li>chrome: URLs</li>
            <li>javascript: URLs</li>
            <li>data: URLs</li>
            <li>file: URLs (i.e., files on the filesystem)</li>
            <li>privileged about: URLs (for example, about:config, about:addons, about:debugging)</li>
          </ul>
          <li className="help_2">{open_url_help_method}</li>
          <ol>
            <li>{open_url_help_method_part_1}</li>
            <li>{open_url_help_method_part_2}</li>
            <li>{open_url_help_method_part_3}</li>
          </ol>
        </ul>
      </div>
    </div>)
    , document.getElementById("content"));

});
