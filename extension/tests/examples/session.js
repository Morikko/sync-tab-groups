/** Session
 * Create groups and tab easily
 Groups:
 - createGroup
 - addTabToGroup

 Complete Session:
 - setLightSession
 - setHeavySession TODO: Not implemented

 Tabs:
 - createTab
 - getRandomNormalTab
 - getRandomTab

 Ressources:
 - ListOfTabURLs
 - ListOfPrivTabURLs
 - ListOfExtensionTabURLs

 Windows:
 - keepOneWindowOpen
 - closeAllAndOpenOnlyOneNewWindow
 */
var Session = Session || {};

/**
 * @param {Object} params
 * @return {Array[Tab]} tabs
 */
Session.createTabs = function(params){
  Utils.mergeObject(params, {
    tabsLength: 0,
    pinnedTabs: 0,
    lazyMode: false, // Note: Real Groups never have this types (urls are filtered)
    privilegedLength: 0,
    openPrivileged: false, // Note: Real Groups never have this types (urls are filtered)
    extensionUrlLength: 0,
  });

  let tabs = [];
  let index = 0;
  let normalTabsLength = params.tabsLength-params.privilegedLength-params.extensionUrlLength;
  for (let i = 0; i < normalTabsLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfTabURLs)
    index++;
    tabs.push(
      tab
    );
  }
  for (let i = 0; i < params.privilegedLength && index<params.tabsLength; i++) {
    let tab = Session.getRandomTab(Session.ListOfPrivTabURLs)
    if ( params.openPrivileged ) {
      tab.url = Utils.getPrivilegedURL(tab.title, tab.url, tab.favIconUrl);
    }
    index++;
    tabs.push(
      tab
    );
  }
  for (let i = 0; i < params.extensionUrlLength && index<params.tabsLength; i++) {
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
    if (index===params.active) {
      tab.active = true;
    } else {
      if ( params.lazyMode ) {
        tab.url = Utils.getDiscardedURL(tab.title, tab.url, tab.favIconUrl);
      }
    }
    return tab;
  });

  // Pinned the first ones
  let safePinnedTabs = Math.min(params.pinnedTabs, params.tabsLength)
  for (let i = 0; i < safePinnedTabs; i++) {
    tabs[i].pinned = true;
  }

  return tabs;
}

/**
 * @return {Array} [Group id, Group Object] if global true
 * @return {Group} [Group Object] if global false
 */
Session.createGroup = function(
  params
) {
  Utils.mergeObject(params, {
    tabsLength: 0,
    pinnedTabs: 0,
    lazyMode: false,
    privilegedLength: 0,
    openPrivileged: false,
    extensionUrlLength: 0,
    global: false,
    incognito: false,
    active: -1,
    title:"",
  });

  let tabs = Session.createTabs(params);

  let group = new GroupManager.Group(
    id = GroupManager.createUniqueGroupId(),
    title = params.title,
    tabs = tabs,
    windowId = browser.windows.WINDOW_ID_NONE,
    incognito = params.incognito,
  );
  if ( params.global ) {
    return [GroupManager.addGroups([
      group
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
 * @param {Object}
      - groups{Array} if params.global to false
      - [ids{Array}, groups{Array}]  if params.global to true
 */
Session.createArrayGroups = function(params) {
  Utils.mergeObject(params, {
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
    title:"",
  });

  // Prepare params
  for(let pro in params) {
    if ( typeof params[pro] !== "string" && params[pro].length !== undefined
      && params[pro].length !== params.groupsLength ) {
      console.error("Session.createArrayGroups: Params length are not right, it should be either 1 or the nbr of groups. Error on " + pro + " with value: ");
      console.error(params[pro]);
      throw Error("");
    }
  }

  // Create Groups
  let groups = [], ids = [];
  for(let i=0; i<params.groupsLength; i++){
    let groupParam = {};
    for(let pro in params) {
      if ( params[pro].length === undefined ) {
        groupParam[pro] = params[pro];
      } else {
        groupParam[pro] = params[pro][i];
      }
    }
    if ( typeof params.title === "string" ) {
      groupParam.title = params.title + " " + i;
    } else {
      groupParam.title = params.title[i];
    }

    let group, id;
    if ( params.global ) {
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

Session.addTabToGroup = async function (group, tab_params) {
  let tab = Session.createTab(tab_params)

  if ( group.id ) { // Local Mode
    let realIndex = TabManager.secureIndex(params.index, tab, group.tabs);
    group.tabs.splice(realIndex, 0, tab);
  } else { // Global
    let id = group;
    await GroupManager.addTabInGroupId(id, tab, tab.index);
  }
}


/**
 * 5 groups:  2x7 + 2x7(Pinned) + 1x7(Private) + Empty + 1x7(Priv/Ext)
 */
Session.setLightSession = function() {
  bg.GroupManager.removeAllGroups();
  Session.createGroup({
    tabsLength: 7,
    global: true,
    title:"Normal 1",
  });
  Session.createGroup({
    tabsLength: 7,
    global: true,
    title:"Normal 2",
  });

  Session.createGroup({
    tabsLength: 7,
    pinnedTabs: 2,
    global: true,
    title:"Pinned 1",
  });

  Session.createGroup({
    tabsLength: 7,
    pinnedTabs: 3,
    global: true,
    title:"Pinned 2",
  });
  Session.createGroup({
    tabsLength: 7,
    global: true,
    incognito: true,
    title:"Private",
  });

  Session.createGroup({
    tabsLength: 0,
    global: true,
  });

  Session.createGroup({
    tabsLength: 7,
    global: true,
    privilegedLength: 1,
    extensionUrlLength: 1,
    title:"Special URLs",
  });

}

/**
 * 20 groups:  12x(8-14) + 4xEmpty + 4x7(Priv/Ext)
 * TODO: Not implemented
 */
Session.setHeavySession = function() {

}

Session.getRandomNormalTab = function(params) {
  let tab = Session.getRandomTab(Session.ListOfTabURLs);
  for ( let k in params ) {
    if ( k in tab ) {
      tab[k] = params[k];
    }
  }
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
    "url": Utils.isChrome()?"chrome://newtab/":"about:newtab",
    "favIconUrl": "chrome://branding/content/icon32.png"
  };

Session.ListOfTabURLs = [
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
  },
  {
    "title": "introduction.js",
    "url": "https://jasmine.github.io/edge/introduction.html",
    "favIconUrl": "https://jasmine.github.io/images/jasmine_32x32.ico"
  },
  {
    "title": "Les superpouvoirs des rats-taupes nus | ARTE",
    "url": "https://www.arte.tv/fr/videos/067065-000-A/les-superpouvoirs-des-rats-taupes-nus/",
    "favIconUrl": "https://static-cdn.arte.tv/guide/favicons/favicon.ico"
  },
  {
    "title": "HTML Color Picker",
    "url": "https://www.w3schools.com/colors/colors_picker.asp",
    "favIconUrl": "https://www.w3schools.com/favicon.ico"
  },
  {
    "title": "Challenge your coding skills with these programming puzzles",
    "url": "https://www.codingame.com/training/expert",
    "favIconUrl": "https://static.codingame.com/common/images/favicon_16_16.1e3eb433.ico"
  },
  {
    "title": "Calendrier | Mambo Salsa",
    "url": "http://mambosalsa.fr/calendrier/",
    "favIconUrl": "http://mambosalsa.fr/wp-content/themes/invictus_3.3/favicon.png"
  },
  {
    "title": "DEAP/deap: Distributed Evolutionary Algorithms in Python",
    "url": "https://github.com/DEAP/deap",
    "favIconUrl": "https://assets-cdn.github.com/favicon.ico"
  },
];

Session.ListOfPrivTabURLs = [{
  "title": "Debugging",
  "url": "about:debugging",
  "favIconUrl": ""
}];

Session.ListOfExtensionTabURLs = [{
  "title": "Preferences",
  "url": browser.extension.getURL("/optionpages/option-page.html"),
  "favIconUrl": "/share/icons/tabspace-active-64.png"
}];



/**
 *
 */
Session.createTab = function(
  params
) {
  return Utils.mergeObject(params, {
    url: "about:newtab",
    title: "No title",
    pinned: false,
    active: false,
    discarded: false,
    favIconUrl: "",
    index: -1,
  })
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
    return "WindowManager.keepOneWindowOpen done";
  } catch (e) {
    let msg = "WindowManager.keepOneWindowOpen failed " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Close all windows and open a new one with only a new tab
 */
Session.closeAllAndOpenOnlyOneNewWindow = async function(sync_window = true) {
  try {
    OptionManager.options.groups.syncNewWindow = sync_window;
    const windows = await browser.windows.getAll();

    const w = await browser.windows.create();

    if (sync_window) {
      await WindowManager.integrateWindow(w.id);
    }

    for (let i = 0; i < windows.length; i++) {
      await browser.windows.remove(windows[i].id);
    }

    return w.id;
  } catch (e) {
    let msg = "Session.closeAllAndOpenOnlyOneNewWindow failed " + e;
    console.error(msg);
    return msg;
  }
}
