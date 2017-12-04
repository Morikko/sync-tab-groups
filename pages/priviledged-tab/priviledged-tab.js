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
    React.DOM.div({},
      React.DOM.div({
        className: "title"
      }, [
        React.DOM.img({
          src: "../../icons/tabspace-active-64.png",
          alt: "Sync Tab Groups icon",
          width: "64",
          height: "64"
        }),
        "Sync Tab Groups"
      ]), React.DOM.div({
        className: "tab_information"
      }, [
        React.DOM.h1({
          className: "privileged-url"
        }, browser.i18n.getMessage("tab_information")),
        React.DOM.ul({}, [
          React.DOM.li({}, browser.i18n.getMessage("tab_title") + ": " + tab_title),
          React.DOM.li({}, browser.i18n.getMessage("tab_address") + ": " + tab_url),
        ]),
        React.createElement(OptionButton, {
          title: browser.i18n.getMessage("copy_url"),
          onClick: handleCopyClipBoard
        }),
      ]),
      React.DOM.div({
          className: "help"
        },
        React.DOM.h1({
          className: "privileged-url"
        }, browser.i18n.getMessage("privileged_url")),
        React.DOM.ul({
          className: "list_help",
        }, [
          React.DOM.li({
            className: "help_1"
          }, browser.i18n.getMessage("privileged_url_help_reason")),
          React.DOM.ul({}, [
            React.DOM.li({}, "chrome: URLs"),
            React.DOM.li({}, "javascript: URLs"),
            React.DOM.li({}, "data: URLs"),
            React.DOM.li({}, "file: URLs (i.e., files on the filesystem)"),
            React.DOM.li({}, "privileged about: URLs (for example, about:config, about:addons, about:debugging)"),
          ]),
          React.DOM.li({
            className: "help_2"
          }, browser.i18n.getMessage("open_url_help_method")),
          React.DOM.li({
            className: "help_2"
          }, browser.i18n.getMessage("open_url_help_method")),
          React.DOM.ol({}, [
            React.DOM.li({}, browser.i18n.getMessage("open_url_help_method_part_1")),
            React.DOM.li({}, browser.i18n.getMessage("open_url_help_method_part_2")),
            React.DOM.li({}, browser.i18n.getMessage("open_url_help_method_part_3"))
          ])
        ]))
    ), document.getElementById("content"));

});
