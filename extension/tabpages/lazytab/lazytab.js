/* Page example
  /tabpages/lazytab/lazytab.html?title=Gmail %E2%80%93 La messagerie avec espace de stockage gratuit de Google&url=https%3A//www.google.com/intl/fr/gmail/about/&favIconUrl=https%3A//www.google.com/gmail/about/images/favicon.ico

  Double imbrication
  /tabpages/lazytab/lazytab.html?title=Gestionnaire%20de%20modules%20compl%C3%A9mentaires&url=moz-extension%3A//68ddee50-febc-45b5-bd3d-f7c6264e02a5/tabpages/privileged-tab/privileged-tab.html%3Ftitle%3DGestionnaire%2520de%2520modules%2520compl%25C3%25A9mentaires%26url%3Dabout%253Aaddons%26favIconUrl%3Dchrome%253A%252F%252Fmozapps%252Fskin%252Fextensions%252FextensionGeneric-16.svg&favIconUrl=chrome%3A//mozapps/skin/extensions/extensionGeneric-16.svg
*/

if (window.location.search.length) {
  var params = new URLSearchParams(window.location.search),
    url = params.get('url') || 'about:blank',
    title = params.get('title') || 'New tab',
    favIconUrl = params.get('favIconUrl');

  document.getElementById('title').innerText = title || url;

  if (favIconUrl) {
    document.getElementById('favIconUrl').href = favIconUrl;
  }

  window.onfocus = window.onmousemove = () => window.location.href = url;

}

document.addEventListener("DOMContentLoaded", () => {
  let tab_link = document.getElementById('tab_link');

  if (tab_link) {
    tab_link.innerText = title;
    tab_link.href = url;
  }
});
