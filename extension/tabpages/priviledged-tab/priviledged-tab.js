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
      '"Sync Tab Groups"'
    ),
    React.createElement(
      'div',
      { className: 'tab_information' },
      React.createElement(
        'h1',
        { className: 'privileged-url' },
        browser.i18n.getMessage("tab_information")
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          browser.i18n.getMessage("tab_title") + ": " + tab_title
        ),
        React.createElement(
          'li',
          null,
          browser.i18n.getMessage("tab_address") + ": " + tab_url
        )
      ),
      React.createElement(OptionButton, {
        title: browser.i18n.getMessage("copy_url"),
        onClick: handleCopyClipBoard
      })
    ),
    React.createElement(
      'div',
      { className: 'help' },
      React.createElement(
        'h1',
        { className: 'privileged-url' },
        browser.i18n.getMessage("privileged_url")
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          { className: 'help_1' },
          browser.i18n.getMessage("privileged_url_help_reason")
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
          browser.i18n.getMessage("open_url_help_method")
        ),
        React.createElement(
          'ol',
          null,
          React.createElement(
            'li',
            null,
            browser.i18n.getMessage("open_url_help_method_part_1")
          ),
          React.createElement(
            'li',
            null,
            browser.i18n.getMessage("open_url_help_method_part_2")
          ),
          React.createElement(
            'li',
            null,
            browser.i18n.getMessage("open_url_help_method_part_3")
          )
        )
      )
    )
  ), document.getElementById("content"));
});