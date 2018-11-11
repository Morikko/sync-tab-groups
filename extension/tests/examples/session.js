import Utils from '../../background/utils/utils'
import TAB_CONSTANTS from '../../background/core/TAB_CONSTANTS'

import TestManager from '../utils/TestManager'

const Session = {};

/**
 * @returns {Array<Tab>} tabs
 */
Session.createTabs = function({
  tabsLength= 0,
  pinnedTabs= 0,
  lazyMode= false, // Note= Real Groups never have this types (urls are filtered)
  privilegedLength= 0,
  openPrivileged= false, // Note= Real Groups never have this types (urls are filtered)
  extensionUrlLength= 0,
  active=-1, // -1: last, -2 or >= tabs.length: nothing, else the tab
  fakeTab=true,
}={}) {
  let tabs = [];
  let index = 0;
  let normalTabsLength = tabsLength-privilegedLength-extensionUrlLength;
  for (let i = 0; i < normalTabsLength; i++) {
    let tab = fakeTab
      ?Session.getFakeTab()
      :Session.getRandomTab(Session.ListOfTabURLs);
    index++;
    tabs.push(
      tab
    );
  }
  for (let i = 0; i < privilegedLength && index<tabsLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfPrivTabURLs)
    if (openPrivileged) {
      tab.url = Utils.getPrivilegedURL(tab.title, tab.url, tab.favIconUrl);
    }
    index++;
    tabs.push(
      tab
    );
  }
  for (let i = 0; i < extensionUrlLength && index<tabsLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfExtensionTabURLs)
    index++;
    tabs.push(
      tab
    );
  }

  // Randomize Tabs order
  Utils.shuffleArray(tabs);

  // Set indexes
  tabs = tabs.map((tab, index)=>{
    tab.index = index;
    // Create different ids for tests compatibility
    tab.id = String(Date.now()) + tab.url.length + index;
    if (index===active) {
      tab.active = true;
    } else {
      if (lazyMode) {
        tab.url = Utils.getDiscardedURL(tab.title, tab.url, tab.favIconUrl);
      }
    }
    return tab;
  });

  if (tabs.length && active === -1) {
    tabs[tabs.length-1].active = true;
  }

  // Pinned the first ones
  let safePinnedTabs = Math.min(pinnedTabs, tabsLength)
  for (let i = 0; i < safePinnedTabs; i++) {
    tabs[i].pinned = true;
  }

  return tabs;
}

/**
 * @returns {Array} [Group id, Group Object] if global true
 * @returns {Group} [Group Object] if global false
 */
Session.createGroup = function({
  tabsLength= 0,
  pinnedTabs= 0,
  lazyMode= false,
  privilegedLength= 0,
  openPrivileged= false,
  extensionUrlLength= 0,
  global= false,
  incognito= false,
  active= -1,
  fakeTab=true,
  title="",
  windowId=browser.windows.WINDOW_ID_NONE,
}={}) {
  let tabs = Session.createTabs({
    tabsLength,
    pinnedTabs,
    lazyMode,
    privilegedLength,
    openPrivileged,
    extensionUrlLength,
    incognito,
    active,
    fakeTab,
  });
  let group = new window.Background.GroupManager.Group({
    id: (Date.now()-TestManager.getRandom(1000, Date.now())),
    title,
    tabs,
    windowId,
    incognito,
  });
  if (global) {
    return [window.Background.GroupManager.addGroups([
      group,
    ])[0], group];
  } else {
    return group;
  }
}

/**
 * Create groupsLength groups and return the array with all the created groups
 * params.groupsLength is always a number
 * Other params are either single or an array with a length of groupsLength
 * If params.title is single, it will be used as a prefix and the nbr of the groups is added behind (with a space between)
 * @param {Object} params - Option for the creation
      - groups{Array} if params.global to false
      - [ids{Array}, groups{Array}]  if params.global to true
 */
Session.createArrayGroups = function(params={}) {
  params = Object.assign({
    groupsLength: 0,
    tabsLength: 0,
    pinnedTabs: 0,
    lazyMode: false,
    privilegedLength: 0,
    openPrivileged: false,
    extensionUrlLength: 0,
    global: false,
    incognito: false,
    active: -1,
    fakeTab: true,
    title: "",
    windowId: browser.windows.WINDOW_ID_NONE,
  }, params);

  // Prepare params
  for (let pro in params) {
    if (typeof params[pro] !== "string" && params[pro].length !== undefined
      && params[pro].length !== params.groupsLength) {
      window.Background.LogManager.error(Error(""), {
        args: arguments,
        paramName: pro,
        paramValue: params[pro],
      }, {logs: null});
      throw Error("");
    }
  }

  // Create Groups
  let groups = [], ids = [];
  for (let i=0; i<params.groupsLength; i++) {
    let groupParam = {};
    for (let pro in params) {
      if (params[pro].length === undefined) {
        groupParam[pro] = params[pro];
      } else {
        groupParam[pro] = params[pro][i];
      }
    }
    if (typeof params.title === "string") {
      groupParam.title = params.title + " " + i;
    } else {
      groupParam.title = params.title[i];
    }

    let group, id;
    if (params.global) {
      [id, group] = Session.createGroup(
        groupParam
      );
      ids.push(id);
    } else {
      group = Session.createGroup(
        groupParam
      );
    }
    groups.push(group);
  }

  return params.global?[ids, groups]:groups;
}

Session.addTabToGroup = async function(group, tab_params) {
  let tab = Session.createTab(tab_params)

  if (group.id) { // Local Mode
    let realIndex = window.Background.TabManager.secureIndex(tab_params.index, tab, group.tabs);
    group.tabs.splice(realIndex, 0, tab);
  } else { // Global
    let id = group;
    await window.Background.GroupManager.addTabInGroupId(id, tab, {targetIndex: tab.index});
  }
}


/**
 * 5 groups:  2x7 + 2x7(Pinned) + 1x7(Private) + Empty + 1x7(Priv/Ext)
 */
Session.setLightSession = function() {
  window.Background.GroupManager.removeAllGroups();
  Session.createArrayGroups({
    groupsLength: 7,
    global: true,
    fakeTab: false,
    tabsLength: [7,7,7,7,7,0,7],
    pinnedTabs: [0,0,2,3,0,0,0],
    privilegedLength: [0,0,0,0,0,0,1],
    extensionUrlLength: [0,0,0,0,0,0,1],
    incognito: [false, false, false, false, true, false, false],
    title: [
      "Normal 1",
      "Normal 2",
      "Pinned 1",
      "Pinned 2",
      "Private",
      "",
      "Special URLs",
    ],
  })
}

/**
 * 20 groups:  12x(8-14) + 4xEmpty + 4x7(Priv/Ext)
 * TODO: Not implemented
 */
Session.setHeavySession = function() {

}

Session.getRandomNormalTab = function() {
  let tab = Session.getRandomTab(Session.ListOfTabURLs);
  return tab;
}

Session.getRandomTab = function(tabs) {
  return  Utils.getCopy(
    Session.createTab(
      tabs[Math.floor(Math.random() * tabs.length)]
    )
  );
}

Session.newTab = {
  "title": "New Tab",
  "url": TAB_CONSTANTS.NEW_TAB,
  "favIconUrl": "chrome://branding/content/icon32.png",
};

Session.getFakeTab = function() {
  let random = String(TestManager.getRandom(0,999999999));
  return Session.createTab({
    url: Session.getFakeUrl(random),
    title: random,
    favIconUrl: "",
  })
}

Session.getFakeUrl = function(random=String(TestManager.getRandom(0,999999999))) {
  return browser.extension.getURL("/tests/test-page/template/template.html")
        + "?test=" + random;
}


/*
PROBLEMS:
 - Difference between urls in location bar and from encodeURIComponent
 - Missing title (for discarded state) & favIconUrl empty idem
 - On creation will not contain the definitve URL, once should add extra logic...

Session.getFakeUrl = function({title="Test", url="/test"}={}) {
  return browser.extension.getURL("/tests/test-page/template/template.html")
          + "?title=" + encodeURIComponent(title)
          + "&url=" + encodeURIComponent(url)
}
Session.ListOfFakeTabs = ([
  {
    title: "Let's go",
    url: "/lets/go",
  },
  {
    title: "Let's come back",
    url: "/lets/come/back",
  },
  {
    title: "Another day",
    url: "/Another/DAY",
  },
]).map((obj) => {
  return {
    url: Session.getFakeUrl(obj)
  }
});
*/

Session.ListOfTabURLs = [
  {
    "title": "Issues · Morikko/sync-tab-groups",
    "url": "https://github.com/Morikko/sync-tab-groups/issues",
    "favIconUrl": "https://assets-cdn.github.com/favicon.ico",
  },
  { // /!\ Heavy to load
    "title": "Font Awesome Icons",
    "url": "https://fontawesome.com/icons?d=gallery",
    "favIconUrl": "https://fontawesome.com/images/favicons/favicon-32x32.png",
  },
  { // /!\ Heavy to load
    "title": "Debugging - Mozilla | MDN",
    "url": "https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging",
    "favIconUrl": "https://cdn.mdn.mozilla.net/static/img/favicon32.7f3da72dcea1.png",
  },
  {
    favIconUrl: "https://jasmine.github.io/favicon.ico",
    title: "Jasmine Documentation",
    url: "https://jasmine.github.io/index.html",
  },
  { // /!\ Heavy to load
    favIconUrl: "https://static-cdn.arte.tv/guide/favicons/favicon-16x16.png",
    title: "ARTE : chaîne télé culturelle franco-allemande - TV direct & replay",
    url: "https://www.arte.tv/fr/",
  },
  {
    "title": "Sync Tab Groups",
    "url": "https://morikko.github.io/synctabgroups/",
    "favIconUrl": "https://morikko.github.io/synctabgroups/img/synctabgroups-64.png",
  },
  {
    "title": "Duolingo: Apprenez l'anglais, l'espagnol et + gratuitement",
    "url": "https://fr.duolingo.com/",
    "favIconUrl": "https://fr.duolingo.com/images/favicon.ico?v=3",
  },
  {
    "title": "Medium – Read, write and share stories that matter",
    "url": "https://medium.com/",
    "favIconUrl": "https://cdn-static-1.medium.com/_/fp/icons/favicon-rebrand-medium.3Y6xpZ-0FSdWDnPM3hSBIA.ico",
  },
  {
    "title": "Cours de guitare et tablatures guitare acoustique",
    "url": "https://www.tabs4acoustic.com/",
    "favIconUrl": "https://www.tabs4acoustic.com/images/favicon.ico",
  },
  {
    "title": "BetterExplained – Math lessons for lasting insight.",
    "url": "https://betterexplained.com/",
    "favIconUrl": "https://betterexplained.com/favicon.ico",
  },
  {
    "title": "HTML Color Picker",
    "url": "https://www.w3schools.com/colors/colors_picker.asp",
    "favIconUrl": "https://www.w3schools.com/favicon.ico",
  },
  { // /!\ Heavy to load
    "title": "Challenge your coding skills with these programming puzzles",
    "url": "https://www.codingame.com/training/expert",
    "favIconUrl": "https://static.codingame.com/common/images/favicon_16_16.1e3eb433.ico",
  },
  {
    "title": "Calendrier | Mambo Salsa",
    "url": "http://mambosalsa.fr/calendrier/",
    "favIconUrl": "http://mambosalsa.fr/wp-content/themes/invictus_3.3/favicon.png",
  },
  {
    "title": "DEAP/deap: Distributed Evolutionary Algorithms in Python",
    "url": "https://github.com/DEAP/deap",
    "favIconUrl": "https://assets-cdn.github.com/favicon.ico",
  },
];

Session.ListOfPrivTabURLs = [{
  "title": "Debugging",
  "url": "about:debugging",
  "favIconUrl": "",
}];

Session.ListOfExtensionTabURLs = [{
  "title": "Preferences",
  "url": browser.extension.getURL("/options/option-page.html"),
  "favIconUrl": "/share/icons/tabspace-active-64.png",
}];

/**
 *
 */
Session.createTab = function(
  params
) {
  return Object.assign({
    url: TAB_CONSTANTS.NEW_TAB,
    title: "No title",
    pinned: false,
    active: false,
    discarded: false,
    favIconUrl: "",
    index: -1,
    incognito: false,
    id: TestManager.getRandom(1000,999999999), // Fake id...
  }, params)
};

/**
 * Close all windows except one
 */
Session.keepOneWindowOpen = async function() {
  try {
    const windows = await browser.windows.getAll();
    for (let i = 1; i < windows.length; i++) {
      await browser.windows.remove(windows[i].id);
    }
    return "window.Background.WindowManager.keepOneWindowOpen done";
  } catch (e) {
    window.Background.LogManager.error(e, {args: arguments}, {logs: null});
  }
}

/**
 * Close all windows and open a new one with only a new tab
 */
Session.closeAllAndOpenOnlyOneNewWindow = async function(sync_window = true) {
  try {
    window.Background.OptionManager.options.groups.syncNewWindow = sync_window;
    const windows = await browser.windows.getAll();

    const w = await browser.windows.create();

    if (sync_window) {
      await window.Background.WindowManager.integrateWindow(w.id);
    }

    for (let i = 0; i < windows.length; i++) {
      await browser.windows.remove(windows[i].id);
    }

    return w.id;
  } catch (e) {
    window.Background.LogManager.error(e, {args: arguments}, {logs: null});
  }
}

// Get information for adding tab in the array
Session.getTabInformation = async function(url) {
  let windowId = (await browser.windows.getLastFocused()).id;
  let tabId = (await browser.tabs.create({
    url: url,
    windowId: windowId,
  })).id;
  await TestManager.waitAllTabsToBeLoadedInWindowId(windowId)
  let tab = await browser.tabs.get(tabId);
  let tabLight = {};
  tabLight.url = tab.url;
  tabLight.title = tab.title;
  tabLight.favIconUrl = tab.favIconUrl;
  console.log(tabLight);
  await browser.tabs.remove(tabId);
}

export default Session