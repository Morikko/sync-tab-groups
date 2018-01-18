/** Session
 * Create groups and tab easily
 */
var Session = Session || {};

/**
 * @return {Number} Group id
 */
Session.createGroup = function(
  params
) {
  Utils.mergeObject(params, {
    tabsLength: 0,
    global: false,
    pinnedTabs: 0,
    privilegedLength: 0,
    extensionUrlLength: 0,
    incognito: false,
    active: -1,
    title:"",
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
    if (index===params.active) tab.active = true;
    return tab;
  });

  // Pinned the first ones
  let safePinnedTabs = Math.min(params.pinnedTabs, params.tabsLength)
  for (let i = 0; i < safePinnedTabs; i++) {
    tabs[i].pinned = true;
  }

  let group = new bg.GroupManager.Group(
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
 */
Session.setHeavySession = function() {

}

Session.getRandomTab = function(tabs) {
  return  Utils.getCopy(
    Session.createTab(
      tabs[Math.floor(Math.random() * tabs.length)]
    )
  );
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
  })
};
