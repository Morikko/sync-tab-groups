var TestManager = TestManager || {};
var Session = Session || {};

Session.createGroup = function(
  tabsLength,
  pinnedTabs = 0,
  privilegedLength = 0,
  extensionUrlLength = 0,
  incognito = false,
  title = "",
) {
  let tabs = [];
  let index = 0;
  for (let i = 0; i < tabsLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfTabURLs)
    tab.index=index++;
    if (pinnedTabs>0){
      tab.pinned = true;
      pinnedTabs--;
    }
    tabs.push(
      tab
    );
  }
  for (let i = 0; i < privilegedLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfPrivTabURLs)
    tab.index=index++;
    tabs.push(
      tab
    );
  }
  for (let i = 0; i < extensionUrlLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfExtensionTabURLs)
    tab.index=index++;
    tabs.push(
      tab
    );
  }

  GroupManager.addGroups([
    new bg.GroupManager.Group(
      id = GroupManager.createUniqueGroupId(),
      title = title,
      tabs = tabs,
      windowId = browser.windows.WINDOW_ID_NONE,
      incognito = incognito,
    )
  ]);
}

/**
 * 5 groups:  2x7 + 2x7(Pinned) + 1x7(Private) + Empty + 1x7(Priv/Ext)
 */
Session.setLightSession = function() {
  bg.GroupManager.removeAllGroups();
  Session.createGroup(7, 0, 0, 0, false, "Normal 1");
  Session.createGroup(7, 0, 0, 0, false, "Normal 2");
  Session.createGroup(7, 2, 0, 0, false, "Pinned 1");
  Session.createGroup(7, 2, 0, 0, false, "Pinned 2");
  Session.createGroup(7, 0, 0, 0, true, "Private");
  Session.createGroup(0, 0, 0, 0, false, "");
  Session.createGroup(7, 0, 1, 1, false, "Special URLs");
}

/**
 * 20 groups:  12x(8-14) + 4xEmpty + 4x7(Priv/Ext)
 */
Session.setHeavySession = function() {

}

Session.getRandomTab = function(tabs) {
  return  Utils.getCopy(tabs[Math.floor(Math.random() * tabs.length)]);
}

Session.ListOfTabURLs = [{
    "title": "New Tab",
    "url": "about:newtab",
    "favIconUrl": "chrome://branding/content/icon32.png"
  },
  {
    "title": "Issues · Morikko/sync-tab-groups",
    "url": "https://github.com/Morikko/sync-tab-groups/issues",
    "favIconUrl": "https://assets-cdn.github.com/favicon.ico"
  },
  {
    "title": "Font Awesome Icons",
    "url": "http://fontawesome.io/icons/",
    "favIconUrl": "http://fontawesome.io/assets/ico/favicon.ico",
  },
  {
    "title": "Debugging - Mozilla | MDN",
    "url": "https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging",
    "favIconUrl": "https://cdn.mdn.mozilla.net/static/img/favicon32.7f3da72dcea1.png"
  }
];

Session.ListOfPrivTabURLs = [{
  "title": "Debugging",
  "url": "about:debugging",
  "favIconUrl": "chrome://branding/content/icon32.png"
}];

Session.ListOfExtensionTabURLs = [{
  "title": "Debugging",
  "url": "moz-extension://68ddee50-febc-45b5-bd3d-f7c6264e02a5/tabpages/privileged-tab/privileged-tab.html?title=Debugging%20with%20Firefox%20Developer%20Tools&url=about%3Adebugging&favIconUrl=undefineds",
  "favIconUrl": "chrome://branding/content/icon32.png"
}];


/**
 *
 */
TestManager.createTab = function(
  url,
  title = "No title",
  pinned = false,
  active = false
) {
  return {
    url: url,
    title: title,
    pinned: pinned,
    active: active
  }
};

TestManager.tabmoc = [
  TestManager.createTab("https://start.fedoraproject.org/", "Projet Fedora - Page d'accueil"),
  TestManager.createTab("https://www.google.fr/", "Google"),
  TestManager.createTab("https://stackoverflow.com/", "Stack Overflow"),
  TestManager.createTab("http://fontawesome.io/", "Font Awesome"),
  TestManager.createTab("https://developer.mozilla.org/fr/", "Mozilla"),
  TestManager.createTab("https://developer.mozilla.org/fr/", "Mozilla"),
  TestManager.createTab("about:addons", "Add Ons"),
  TestManager.createTab("about:newtab", "New Tab"),
]

TestManager.GroupWithoutPinned_1 = function() {
  return new GroupManager.Group(
    GroupManager.createUniqueGroupId(),
    title = "Group Without Pinned 1",
    tabs = [
      TestManager.tabmoc[0],
      TestManager.tabmoc[1],
      TestManager.tabmoc[2],
    ],
    windowId = browser.windows.WINDOW_ID_NONE);
}
