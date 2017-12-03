function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setIcon(icon_url) {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = icon_url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

function copyToTheClipBoard() {
  let tab_url = getParameterByName('url');
  let input = document.createElement('input');
  input.value = tab_url;

  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
}

document.addEventListener("DOMContentLoaded", () => {

  let tab_title = getParameterByName('title').replace('+', ' '),
    tab_url = getParameterByName('url'),
    favIconUrl = getParameterByName('favIconUrl');
  // Set tab title
  document.title = tab_title;
  // Set tab icon
  setIcon(favIconUrl);

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
          onClick: copyToTheClipBoard
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
          React.DOM.ol({}, [
            React.DOM.li({}, browser.i18n.getMessage("open_url_help_method_part_1")),
            React.DOM.li({}, browser.i18n.getMessage("open_url_help_method_part_2")),
            React.DOM.li({}, browser.i18n.getMessage("open_url_help_method_part_3"))
          ])
        ]))
    ), document.getElementById("content"));

});
