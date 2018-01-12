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
      tab_title = "Title" + ": " + title,
      tab_url = "URL" + ": " + url,
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

  ReactDOM.render(React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'title' },
      React.createElement('img', {
        src: '../../share/icons/tabspace-active-64.png',
        alt: 'Sync Tab Groups icon',
        width: '64',
        height: '64'
      }),
      'Sync Tab Groups'
    ),
    React.createElement(
      'div',
      { className: 'tab_information' },
      React.createElement(
        'h1',
        { className: 'privileged-url' },
        tab_information
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          tab_title
        ),
        React.createElement(
          'li',
          null,
          tab_url
        )
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: handleCopyClipBoard
        },
        copy_url
      )
    ),
    React.createElement(
      'div',
      { className: 'help' },
      React.createElement(
        'h1',
        { className: 'privileged-url' },
        privileged_url
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          { className: 'help_1' },
          privileged_url_help_reason
        ),
        React.createElement(
          'ul',
          { className: 'list_help' },
          React.createElement(
            'li',
            null,
            'chrome: URLs'
          ),
          React.createElement(
            'li',
            null,
            'javascript: URLs'
          ),
          React.createElement(
            'li',
            null,
            'data: URLs'
          ),
          React.createElement(
            'li',
            null,
            'file: URLs (i.e., files on the filesystem)'
          ),
          React.createElement(
            'li',
            null,
            'privileged about: URLs (for example, about:config, about:addons, about:debugging)'
          )
        ),
        React.createElement(
          'li',
          { className: 'help_2' },
          open_url_help_method
        ),
        React.createElement(
          'ol',
          null,
          React.createElement(
            'li',
            null,
            open_url_help_method_part_1
          ),
          React.createElement(
            'li',
            null,
            open_url_help_method_part_2
          ),
          React.createElement(
            'li',
            null,
            open_url_help_method_part_3
          )
        )
      )
    )
  ), document.getElementById("content"));
});