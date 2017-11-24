var TestManager = TestManager || {};

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
    1000,
    title = "Group Without Pinned 1",
    tabs = [
      TestManager.tabmoc[0],
      TestManager.tabmoc[1],
      TestManager.tabmoc[2],
    ],
    windowId = browser.windows.WINDOW_ID_NONE);
}
