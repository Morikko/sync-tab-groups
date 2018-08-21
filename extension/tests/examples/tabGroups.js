/**
 * Groups for testing importing files
 */

var Examples = Examples || {};

Examples.importedGroups = [{
  "title": "Window 1",
  "tabs": [{
    "title": "Sync Tab Groups – Add-ons for Firefox",
    "url": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
    "pinned": false,
    "active": false,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }, {
    "title": "Documentation du Web - MDN",
    "url": "https://developer.mozilla.org/fr/",
    "pinned": false,
    "active": false,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }, {
    "title": "Webmaker",
    "url": "https://webmaker.org/?utm_source=directory-tiles&utm_medium=firefox-browser#/?_k=rrkxyq",
    "pinned": false,
    "active": false,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }, {
    "title": "Nouvel onglet",
    "url": TabManager.NEW_TAB,
    "pinned": false,
    "active": false,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }, {
    "title": "Options des groupes d'onglets",
    "url": "about:tabgroups",
    "pinned": false,
    "active": true,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }],
  "id": 0,
  "windowId": -1,
  "incognito": false,
  "lastAccessed": 0,
  "expand": false,
  "position": 0,
  "index": 0,
}, {
  "title": "Mobile",
  "tabs": [{
    "title": "Navigateurs mobiles pour iOS et Android | Firefox",
    "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=ios&utm_medium=tiles&utm_source=directory-tiles",
    "pinned": false,
    "active": true,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }],
  "id": 1,
  "windowId": -1,
  "incognito": false,
  "lastAccessed": 0,
  "expand": false,
  "position": 1,
  "index": 1
}, {
  "title": "Window 2",
  "tabs": [{
    "title": "Navigateurs mobiles pour iOS et Android | Firefox",
    "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=android&utm_medium=tiles&utm_source=directory-tiles",
    "pinned": false,
    "active": false,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }, {
    "title": "GIMP - Converting Color Images to B&W",
    "url": "https://www.gimp.org/tutorials/Color2BW/",
    "pinned": false,
    "active": false,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }, {
    "title": "GitHub - Quicksaver/Tab-Groups: Reimplementation of Firefox Tab Groups as an add-on.",
    "url": "https://github.com/Quicksaver/Tab-Groups",
    "pinned": false,
    "active": true,
    "discarded": false,
    "favIconUrl": "chrome://branding/content/icon32.png"
  }],
  "id": 2,
  "windowId": -1,
  "incognito": false,
  "lastAccessed": 0,
  "expand": false,
  "position": 2,
  "index": 2
}];

Examples.syncTabGroups_2w_3g = {
  "version": ["syncTabGroups", 1],
  "groups": [{
    "title": "Window 1",
    "tabs": [{
      "title": "Sync Tab Groups – Add-ons for Firefox",
      "url": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }, {
      "title": "Documentation du Web - MDN",
      "url": "https://developer.mozilla.org/fr/",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }, {
      "title": "Webmaker",
      "url": "https://webmaker.org/?utm_source=directory-tiles&utm_medium=firefox-browser#/?_k=rrkxyq",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }, {
      "title": "Nouvel onglet",
      "url": TabManager.NEW_TAB,
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }, {
      "title": "Options des groupes d'onglets",
      "url": "about:tabgroups",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }],
    "id": -1,
    "windowId": -1
  }, {
    "title": "Mobile",
    "tabs": [{
      "title": "Navigateurs mobiles pour iOS et Android | Firefox",
      "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=ios&utm_medium=tiles&utm_source=directory-tiles",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }],
    "id": -1,
    "windowId": -1
  }, {
    "title": "Window 2",
    "tabs": [{
      "title": "Navigateurs mobiles pour iOS et Android | Firefox",
      "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=android&utm_medium=tiles&utm_source=directory-tiles",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }, {
      "title": "GIMP - Converting Color Images to B&W",
      "url": "https://www.gimp.org/tutorials/Color2BW/",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }, {
      "title": "GitHub - Quicksaver/Tab-Groups: Reimplementation of Firefox Tab Groups as an add-on.",
      "url": "https://github.com/Quicksaver/Tab-Groups",
      "pinned": false,
      "active": false,
      "discarded": false,
      "favIconUrl": "chrome://branding/content/icon32.png"
    }],
    "id": -1,
    "windowId": -1
  }]
};

Examples.tabGroups_2w_3g = {
  "version": ["tabGroups", 1],
  "session": {
    "lastUpdate": 1511882025965,
    "startTime": 1510488614325,
    "recentCrashes": 0
  },
  "windows": [{
    "tabs": [{
      "entries": [{
        "url": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
        "title": "Sync Tab Groups – Add-ons for Firefox",
        "charset": "UTF-8",
        "ID": 53408645,
        "persist": true
      }],
      "lastAccessed": 1511881995171,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1,\"active\":true}"
      },
      "index": 1,
      "image": "https://addons.mozilla.org/favicon.ico?v=1"
    }, {
      "entries": [{
        "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=ios&utm_medium=tiles&utm_source=directory-tiles",
        "title": "Navigateurs mobiles pour iOS et Android | Firefox",
        "charset": "UTF-8",
        "ID": 53475249,
        "persist": true
      }],
      "lastAccessed": 1511881967594,
      "hidden": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":2,\"active\":true}"
      },
      "index": 1,
      "image": "https://www.mozilla.org/media/img/firefox/favicon.e6bb0e59df3d.ico"
    }, {
      "entries": [{
        "url": "https://developer.mozilla.org/fr/",
        "title": "Documentation du Web - MDN",
        "charset": "UTF-8",
        "ID": 9,
        "persist": true
      }],
      "lastAccessed": 1511881906240,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1,
      "image": "https://cdn.mdn.mozilla.net/static/img/favicon32.7f3da72dcea1.png"
    }, {
      "entries": [{
        "url": "https://webmaker.org/?utm_source=directory-tiles&utm_medium=firefox-browser#/?_k=rrkxyq",
        "title": "Webmaker",
        "charset": "UTF-8",
        "ID": 11,
        "persist": true
      }],
      "lastAccessed": 1511881904687,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1,
      "image": "https://webmaker.org/favicon.ico"
    }, {
      "entries": [{
        "url": TabManager.NEW_TAB,
        "title": "Nouvel onglet",
        "charset": "",
        "ID": 28,
        "persist": false
      }],
      "lastAccessed": 1511881963448,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1
    }, {
      "entries": [{
        "url": "about:tabgroups",
        "title": "Options des groupes d'onglets",
        "charset": "",
        "ID": 40,
        "persist": true
      }],
      "lastAccessed": 1511882025962,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1
    }],
    "extData": {
      "tabview-group": "{\"1\":{\"bounds\":{\"left\":20,\"top\":20,\"width\":250,\"height\":200},\"slot\":1,\"userSize\":null,\"stackTabs\":true,\"showThumbs\":true,\"showUrls\":true,\"tileIcons\":true,\"catchOnce\":true,\"catchRules\":\"\",\"title\":\"Window 1\",\"id\":1},\"2\":{\"bounds\":{\"left\":20,\"top\":20,\"width\":250,\"height\":200},\"slot\":2,\"userSize\":null,\"stackTabs\":true,\"showThumbs\":true,\"showUrls\":true,\"tileIcons\":true,\"catchOnce\":true,\"catchRules\":\"\",\"title\":\"Mobile\",\"id\":2}}",
      "tabview-groups": "{\"nextID\":5,\"activeGroupId\":1,\"activeGroupName\":\"Window 1\",\"totalNumber\":2}"
    }
  }, {
    "tabs": [{
      "entries": [{
        "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=android&utm_medium=tiles&utm_source=directory-tiles",
        "title": "Navigateurs mobiles pour iOS et Android | Firefox",
        "charset": "UTF-8",
        "ID": 17,
        "persist": true
      }],
      "lastAccessed": 1511881962962,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1,
      "image": "https://www.mozilla.org/media/img/firefox/favicon.e6bb0e59df3d.ico"
    }, {
      "entries": [{
        "url": "https://www.gimp.org/tutorials/Color2BW/",
        "title": "GIMP - Converting Color Images to B&W",
        "charset": "UTF-8",
        "ID": 14,
        "persist": true
      }],
      "lastAccessed": 1511881925219,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1,
      "image": "https://www.gimp.org/images/wilber16.png"
    }, {
      "entries": [{
        "url": "https://github.com/Quicksaver/Tab-Groups",
        "title": "GitHub - Quicksaver/Tab-Groups: Reimplementation of Firefox Tab Groups as an add-on.",
        "charset": "UTF-8",
        "ID": 15,
        "persist": true
      }],
      "lastAccessed": 1511881925951,
      "hidden": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "index": 1,
      "image": "https://assets-cdn.github.com/favicon.ico"
    }],
    "extData": {
      "tabview-group": "{\"1\":{\"bounds\":{\"left\":15,\"top\":5,\"width\":1237.285,\"height\":574.9540000000001},\"slot\":1,\"userSize\":null,\"stackTabs\":true,\"showThumbs\":true,\"showUrls\":true,\"tileIcons\":true,\"catchOnce\":true,\"catchRules\":\"\",\"title\":\"Window 2\",\"id\":1}}",
      "tabview-groups": "{\"nextID\":2,\"activeGroupId\":1,\"activeGroupName\":null,\"totalNumber\":1}"
    }
  }]
}

Examples.tabGroups_2w_3g_session = {
  "version": ["sessionrestore", 1],
  "windows": [{
    "tabs": [{
      "entries": [{
        "url": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
        "title": "Sync Tab Groups – Add-ons for Firefox",
        "charset": "UTF-8",
        "ID": 53408645,
        "docshellUUID": "{24378146-aa07-46e5-b429-57cce66f87c7}",
        "originalURI": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
        "resultPrincipalURI": null,
        "scrollRestorationIsManual": true,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 0,
        "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wMAAIAEAP//a2V5AAAAAAAGAACABAD//zNkcW15bgAAAAAAABMA//8=",
        "structuredCloneVersion": 8,
        "persist": true
      }],
      "lastAccessed": 1511881995171,
      "hidden": false,
      "mediaBlocked": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1,\"active\":true}"
      },
      "userContextId": 0,
      "index": 1,
      "image": "https://addons.mozilla.org/favicon.ico?v=1",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAP2h0dHBzOi8vYWRkb25zLm1vemlsbGEub3JnL2VuLVVTL2ZpcmVmb3gvYWRkb24vc3luYy10YWItZ3JvdXBzLwAAAAAAAAAFAAAACAAAABIAAAAI/////wAAAAj/////AAAACAAAABIAAAAaAAAAJQAAABoAAAAlAAAAGgAAACUAAAA/AAAAAAAAAD//////AAAAAP////8AAAAa/////wAAABr/////AQAAAAAAAAAAAAAAAA=="
    }, {
      "entries": [{
        "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=ios&utm_medium=tiles&utm_source=directory-tiles",
        "title": "Navigateurs mobiles pour iOS et Android | Firefox",
        "charset": "UTF-8",
        "ID": 53475249,
        "docshellUUID": "{168b3b23-fc5a-4d0f-985a-a2110fa39990}",
        "originalURI": "https://www.mozilla.org/firefox/ios/?utm_source=directory-tiles&utm_medium=tiles&utm_campaign=desktop&utm_content=ios",
        "resultPrincipalURI": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=ios&utm_medium=tiles&utm_source=directory-tiles",
        "loadReplace": true,
        "loadReplace2": true,
        "principalToInherit_base64": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6ezRmOGM0Mzk5LTE2ZDktNDQ4Mi05NWY3LWEyNTJlYzVkMGUxOX0AAAAA",
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 18,
        "persist": true
      }],
      "lastAccessed": 1511881967594,
      "hidden": true,
      "mediaBlocked": false,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":2,\"active\":true}"
      },
      "userContextId": 0,
      "index": 1,
      "image": "https://www.mozilla.org/media/img/firefox/favicon.e6bb0e59df3d.ico",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAe2h0dHBzOi8vd3d3Lm1vemlsbGEub3JnL2ZyL2ZpcmVmb3gvbW9iaWxlLz91dG1fY2FtcGFpZ249ZGVza3RvcCZ1dG1fY29udGVudD1pb3MmdXRtX21lZGl1bT10aWxlcyZ1dG1fc291cmNlPWRpcmVjdG9yeS10aWxlcwAAAAAAAAAFAAAACAAAAA8AAAAI/////wAAAAj/////AAAACAAAAA8AAAAXAAAAZAAAABcAAAATAAAAFwAAABMAAAAqAAAAAAAAACr/////AAAAAP////8AAAArAAAAUAAAABf/////AQAAAAAAAAAAAAAAAA=="
    }, {
      "entries": [{
        "url": "https://developer.mozilla.org/fr/",
        "title": "Documentation du Web - MDN",
        "charset": "UTF-8",
        "ID": 9,
        "docshellUUID": "{dbfd8bf5-9a67-42e1-93b4-0a5626c2bb23}",
        "originalURI": "https://developer.mozilla.org/fr/",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 9,
        "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wAAAAATAP//",
        "structuredCloneVersion": 8,
        "persist": true
      }],
      "lastAccessed": 1511881906240,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 1,
      "userTypedValue": "",
      "userTypedClear": 0,
      "storage": {
        "https://developer.mozilla.org": {
          "Open Sans": "true",
          "zillaslab": "true"
        }
      },
      "image": "https://cdn.mdn.mozilla.net/static/img/favicon32.7f3da72dcea1.png",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAYWh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2ZyLz91dG1fc291cmNlPW1vemlsbGEmdXRtX21lZGl1bT1maXJlZm94LXRpbGUmdXRtX2NhbXBhaWduPWRlZmF1bHQAAAAAAAAABQAAAAgAAAAVAAAACP////8AAAAI/////wAAAAgAAAAVAAAAHQAAAEQAAAAdAAAABAAAAB0AAAAEAAAAIQAAAAAAAAAh/////wAAAAD/////AAAAIgAAAD8AAAAd/////wEAAAAAAAAAAAAAAAA="
    }, {
      "entries": [{
        "url": "https://webmaker.org/?utm_source=directory-tiles&utm_medium=firefox-browser#/?_k=rrkxyq",
        "title": "Webmaker",
        "charset": "UTF-8",
        "ID": 11,
        "docshellUUID": "{9385a18a-a031-4ebf-984a-5a21425c2a5a}",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 8,
        "persist": true
      }],
      "lastAccessed": 1511881904687,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 1,
      "storage": {
        "https://webmaker.org": {
          "optimizely_data$$first_session": "true"
        }
      },
      "image": "https://webmaker.org/favicon.ico",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAS2h0dHBzOi8vd2VibWFrZXIub3JnLz91dG1fc291cmNlPWRpcmVjdG9yeS10aWxlcyZ1dG1fbWVkaXVtPWZpcmVmb3gtYnJvd3NlcgAAAAAAAAAFAAAACAAAAAwAAAAI/////wAAAAj/////AAAACAAAAAwAAAAUAAAANwAAABQAAAABAAAAFAAAAAEAAAAVAAAAAAAAABX/////AAAAAP////8AAAAWAAAANQAAABT/////AQAAAAAAAAAAAAAAAA=="
    }, {
      "entries": [{
        "url": TabManager.NEW_TAB,
        "title": "Nouvel onglet",
        "charset": "",
        "ID": 28,
        "docshellUUID": "{8945c4e6-eb66-453f-8c5d-34508156e0f0}",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 28,
        "persist": false
      }],
      "lastAccessed": 1511881963448,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 1,
      "image": null,
      "iconLoadingPrincipal": null
    }, {
      "entries": [{
        "url": "about:tabgroups",
        "title": "Options des groupes d'onglets",
        "charset": "",
        "ID": 39,
        "docshellUUID": "{8a08bf75-e908-49e1-a17d-664833f1f55b}",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 39,
        "persist": true
      }, {
        "url": "about:tabgroups",
        "title": "Options des groupes d'onglets",
        "charset": "",
        "ID": 40,
        "docshellUUID": "{8a08bf75-e908-49e1-a17d-664833f1f55b}",
        "originalURI": "about:tabgroups",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 39,
        "structuredCloneState": "AgAAAAAA8f8LAACABAD//3BhbmVTZXNzaW9uAAAAAAA=",
        "structuredCloneVersion": 8,
        "persist": true
      }],
      "lastAccessed": 1511882044083,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 2,
      "image": null,
      "iconLoadingPrincipal": null
    }],
    "selected": 6,
    "_closedTabs": [{
      "state": {
        "entries": [{
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53485591,
          "docshellUUID": "{6c1f7fc2-1000-478a-acf7-9430d281a6b0}",
          "originalURI": "about:addons",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 30,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAASAAAABAD//2EAZABkAG8AbgBzADoALwAvAGQAaQBzAGMAbwB2AGUAcgAvAAAAAAAMAACABAD//3ByZXZpb3VzVmlldwAAAAAAAAAAAAD//wAAAAATAP//",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53485592,
          "docshellUUID": "{6c1f7fc2-1000-478a-acf7-9430d281a6b0}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 30,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAAXAAAABAD//2EAZABkAG8AbgBzADoALwAvAGwAaQBzAHQALwBlAHgAdABlAG4AcwBpAG8AbgAAAAwAAIAEAP//cHJldmlvdXNWaWV3AAAAABIAAAAEAP//YQBkAGQAbwBuAHMAOgAvAC8AZABpAHMAYwBvAHYAZQByAC8AAAAAAAAAAAATAP//",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53485594,
          "docshellUUID": "{6c1f7fc2-1000-478a-acf7-9430d281a6b0}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 30,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAAcAACABAD//2FkZG9uczovL3NlYXJjaC90YWIlMjBncm91cHMAAAAADAAAgAQA//9wcmV2aW91c1ZpZXcAAAAAFwAAgAQA//9hZGRvbnM6Ly9saXN0L2V4dGVuc2lvbgAAAAAAEwD//w==",
          "structuredCloneVersion": 8,
          "persist": true
        }],
        "lastAccessed": 1511781550829,
        "hidden": true,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "userContextId": 0,
        "index": 3,
        "userTypedValue": "",
        "userTypedClear": 0,
        "image": "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
        "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY="
      },
      "title": "Gestionnaire de modules complémentaires",
      "image": "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
      "iconLoadingPrincipal": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6ezhmZWNlYjM2LWQ2NzgtNDlhNi1hZDAyLTZhOTRmZTJiNjg3OH0AAAAA",
      "pos": 2,
      "closedAt": 1511881990184,
      "closedId": 14
    }, {
      "state": {
        "entries": [{
          "url": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
          "title": "Sync Tab Groups – Add-ons for Firefox",
          "charset": "UTF-8",
          "ID": 53485559,
          "docshellUUID": "{c9dd2036-42bd-4a51-8c2d-e6f40b737a77}",
          "originalURI": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
          "resultPrincipalURI": null,
          "scrollRestorationIsManual": true,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 29,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wMAAIAEAP//a2V5AAAAAAAGAACABAD//zNkcW15bgAAAAAAABMA//8=",
          "structuredCloneVersion": 8,
          "persist": true
        }],
        "lastAccessed": 1510488684878,
        "hidden": true,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "userContextId": 0,
        "index": 1,
        "userTypedValue": "",
        "userTypedClear": 0,
        "image": "https://addons.mozilla.org/favicon.ico?v=1",
        "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAP2h0dHBzOi8vYWRkb25zLm1vemlsbGEub3JnL2VuLVVTL2ZpcmVmb3gvYWRkb24vc3luYy10YWItZ3JvdXBzLwAAAAAAAAAFAAAACAAAABIAAAAI/////wAAAAj/////AAAACAAAABIAAAAaAAAAJQAAABoAAAAlAAAAGgAAACUAAAA/AAAAAAAAAD//////AAAAAP////8AAAAa/////wAAABr/////AQAAAAAAAAAAAAAAAA=="
      },
      "title": "Sync Tab Groups – Add-ons for Firefox",
      "image": "https://addons.mozilla.org/favicon.ico?v=1",
      "iconLoadingPrincipal": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6ezJhZDcyYjkyLWJmZGQtNDcyMS04ZTU0LTFhZjUxNjVmZGZhYn0AAAAA",
      "pos": 2,
      "closedAt": 1511881990178,
      "closedId": 13
    }, {
      "state": {
        "entries": [{
          "url": "about:debugging#addons",
          "title": "Déboguer avec les outils de développement de Firefox",
          "charset": "",
          "ID": 53485535,
          "docshellUUID": "{15a80296-bf6c-417c-8311-8ab13515f35b}",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6e2FjNGM1MWE0LWYzNGEtNGI5NS04NjUwLTI2YWE5NjZmOWYyNH0AAAAA",
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 28,
          "persist": true
        }],
        "lastAccessed": 1511781532716,
        "hidden": true,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "userContextId": 0,
        "index": 1,
        "userTypedValue": "",
        "userTypedClear": 0,
        "image": null,
        "iconLoadingPrincipal": null
      },
      "title": "Déboguer avec les outils de développement de Firefox",
      "image": null,
      "iconLoadingPrincipal": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6e2YxMDFjODljLWZiNTQtNDVmNy05NzQxLWI1MzcyNmJlYTk0ZX0AAAAA",
      "pos": 2,
      "closedAt": 1511881990171,
      "closedId": 12
    }, {
      "state": {
        "entries": [{
          "url": "about:home",
          "title": "Page de démarrage de Mozilla Firefox",
          "charset": "",
          "ID": 53485505,
          "docshellUUID": "{f3f8ea53-8d5d-4f66-802a-6373cc67b1bc}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 27,
          "persist": true
        }],
        "lastAccessed": 1510488646260,
        "hidden": true,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "userContextId": 0,
        "index": 1,
        "userTypedValue": "",
        "userTypedClear": 0,
        "image": "chrome://branding/content/icon32.png",
        "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYBLyd8AA6vTdu5NkEya6SKrpIHOlRteE8wkTq4cYEyCMYAAAAABWFib3V0AAAABGhvbWUAAODaHXAvexHTjNAAYLD8FKOSBzpUbXhPMJE6uHGBMgjGAAAAAA5tb3otc2FmZS1hYm91dAAAAARob21lAAAAAAAAAAAA"
      },
      "title": "Page de démarrage de Mozilla Firefox",
      "image": "chrome://branding/content/icon32.png",
      "iconLoadingPrincipal": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6ezcwODRhZjViLTQ5MTctNDk3NC1hNDcyLTg0MDAyOThhNDJlNH0AAAAA",
      "pos": 2,
      "closedAt": 1511881990162,
      "closedId": 11
    }, {
      "state": {
        "entries": [{
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53481893,
          "docshellUUID": "{28237338-c33d-474a-8431-030c30f4159d}",
          "originalURI": "about:addons",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 35,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAASAAAABAD//2EAZABkAG8AbgBzADoALwAvAGQAaQBzAGMAbwB2AGUAcgAvAAAAAAAMAACABAD//3ByZXZpb3VzVmlldwAAAAAAAAAAAAD//wAAAAATAP//",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53481894,
          "docshellUUID": "{28237338-c33d-474a-8431-030c30f4159d}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 35,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAAXAAAABAD//2EAZABkAG8AbgBzADoALwAvAGwAaQBzAHQALwBlAHgAdABlAG4AcwBpAG8AbgAAAAwAAIAEAP//cHJldmlvdXNWaWV3AAAAABIAAAAEAP//YQBkAGQAbwBuAHMAOgAvAC8AZABpAHMAYwBvAHYAZQByAC8AAAAAAAAAAAATAP//",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53481895,
          "docshellUUID": "{28237338-c33d-474a-8431-030c30f4159d}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 35,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAAcAACABAD//2FkZG9uczovL3NlYXJjaC90YWIlMjBncm91cHMAAAAADAAAgAQA//9wcmV2aW91c1ZpZXcAAAAAFwAAgAQA//9hZGRvbnM6Ly9saXN0L2V4dGVuc2lvbgAAAAAAEwD//w==",
          "structuredCloneVersion": 8,
          "persist": true
        }],
        "lastAccessed": 1511881970403,
        "hidden": false,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "index": 3,
        "userContextId": 0,
        "image": "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
        "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY="
      },
      "title": "Gestionnaire de modules complémentaires",
      "image": "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
      "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
      "pos": 2,
      "closedAt": 1511881970403,
      "closedId": 10
    }, {
      "state": {
        "entries": [{
          "url": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
          "title": "Sync Tab Groups – Add-ons for Firefox",
          "charset": "UTF-8",
          "ID": 53481309,
          "docshellUUID": "{0caec901-2c22-4420-81c9-16c4c69112a5}",
          "originalURI": "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
          "resultPrincipalURI": null,
          "scrollRestorationIsManual": true,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 21,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wMAAIAEAP//a2V5AAAAAAAGAACABAD//zNkcW15bgAAAAAAABMA//8=",
          "structuredCloneVersion": 8,
          "persist": true
        }],
        "lastAccessed": 1511881969984,
        "hidden": false,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "index": 1,
        "userContextId": 0,
        "image": "https://addons.mozilla.org/favicon.ico?v=1",
        "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAP2h0dHBzOi8vYWRkb25zLm1vemlsbGEub3JnL2VuLVVTL2ZpcmVmb3gvYWRkb24vc3luYy10YWItZ3JvdXBzLwAAAAAAAAAFAAAACAAAABIAAAAI/////wAAAAj/////AAAACAAAABIAAAAaAAAAJQAAABoAAAAlAAAAGgAAACUAAAA/AAAAAAAAAD//////AAAAAP////8AAAAa/////wAAABr/////AQAAAAAAAAAAAAAAAA=="
      },
      "title": "Sync Tab Groups – Add-ons for Firefox",
      "image": "https://addons.mozilla.org/favicon.ico?v=1",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAP2h0dHBzOi8vYWRkb25zLm1vemlsbGEub3JnL2VuLVVTL2ZpcmVmb3gvYWRkb24vc3luYy10YWItZ3JvdXBzLwAAAAAAAAAFAAAACAAAABIAAAAI/////wAAAAj/////AAAACAAAABIAAAAaAAAAJQAAABoAAAAlAAAAGgAAACUAAAA/AAAAAAAAAD//////AAAAAP////8AAAAa/////wAAABr/////AQAAAAAAAAAAAAAAAA==",
      "pos": 2,
      "closedAt": 1511881969985,
      "closedId": 9
    }, {
      "state": {
        "entries": [{
          "url": "about:debugging#addons",
          "title": "Déboguer avec les outils de développement de Firefox",
          "charset": "",
          "ID": 53480891,
          "docshellUUID": "{ce79eddf-afb1-4b26-93ad-4c2db1e8fcce}",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6e2FjNGM1MWE0LWYzNGEtNGI5NS04NjUwLTI2YWE5NjZmOWYyNH0AAAAA",
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 33,
          "persist": true
        }],
        "lastAccessed": 1511881969476,
        "hidden": false,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "index": 1,
        "userContextId": 0,
        "image": null,
        "iconLoadingPrincipal": null
      },
      "title": "Déboguer avec les outils de développement de Firefox",
      "image": null,
      "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
      "pos": 2,
      "closedAt": 1511881969477,
      "closedId": 8
    }, {
      "state": {
        "entries": [{
          "url": "about:home",
          "title": "Page de démarrage de Mozilla Firefox",
          "charset": "",
          "ID": 53479406,
          "docshellUUID": "{c0ef793c-b3de-42f5-8f91-c24113f16d8e}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 19,
          "persist": true
        }],
        "lastAccessed": 1511881968985,
        "hidden": false,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "userContextId": 0,
        "index": 1,
        "image": "chrome://branding/content/icon32.png",
        "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYBLyd8AA6vTdu5NkEya6SKrpIHOlRteE8wkTq4cYEyCMYAAAAABWFib3V0AAAABGhvbWUAAODaHXAvexHTjNAAYLD8FKOSBzpUbXhPMJE6uHGBMgjGAAAAAA5tb3otc2FmZS1hYm91dAAAAARob21lAAAAAAAAAAAA"
      },
      "title": "Page de démarrage de Mozilla Firefox",
      "image": "chrome://branding/content/icon32.png",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYBLyd8AA6vTdu5NkEya6SKrpIHOlRteE8wkTq4cYEyCMYAAAAABWFib3V0AAAABGhvbWUAAODaHXAvexHTjNAAYLD8FKOSBzpUbXhPMJE6uHGBMgjGAAAAAA5tb3otc2FmZS1hYm91dAAAAARob21lAAAAAAAAAAAA",
      "pos": 2,
      "closedAt": 1511881968986,
      "closedId": 7
    }, {
      "state": {
        "entries": [{
          "url": "about:tabgroups",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406755,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8NAAAABAD//3AAYQBuAGUAVABhAGIARwByAG8AdQBwAHMAAAAAAAAA",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups#howTo",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406756,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups#howTo",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8JAAAABAD//3AAYQBuAGUASABvAHcAVABvAAAAAAAAAA==",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406757,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8LAAAABAD//3AAYQBuAGUAUwBlAHMAcwBpAG8AbgAAAA==",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups#howTo",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406758,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups#howTo",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8JAAAABAD//3AAYQBuAGUASABvAHcAVABvAAAAAAAAAA==",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups#about",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406759,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups#about",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8JAAAABAD//3AAYQBuAGUAQQBiAG8AdQB0AAAAAAAAAA==",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406760,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8LAAAABAD//3AAYQBuAGUAUwBlAHMAcwBpAG8AbgAAAA==",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups#tabGroups",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406761,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups#tabGroups",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8NAAAABAD//3AAYQBuAGUAVABhAGIARwByAG8AdQBwAHMAAAAAAAAA",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups#howTo",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 53406762,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups#howTo",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8JAAAABAD//3AAYQBuAGUASABvAHcAVABvAAAAAAAAAA==",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:tabgroups",
          "title": "Options des groupes d'onglets",
          "charset": "",
          "ID": 20,
          "docshellUUID": "{1e293c43-4d14-4919-b8be-0187231931b8}",
          "originalURI": "about:tabgroups",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 11,
          "structuredCloneState": "AgAAAAAA8f8LAACABAD//3BhbmVTZXNzaW9uAAAAAAA=",
          "structuredCloneVersion": 8,
          "persist": true
        }],
        "lastAccessed": 1511881900010,
        "hidden": false,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "{\"groupID\":1,\"active\":true}"
        },
        "userContextId": 0,
        "index": 9,
        "image": null,
        "iconLoadingPrincipal": null
      },
      "title": "Options des groupes d'onglets",
      "image": null,
      "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
      "pos": 1,
      "closedAt": 1511881900011,
      "closedId": 5
    }, {
      "state": {
        "entries": [{
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53410076,
          "docshellUUID": "{bfe956d2-bd34-4076-aa47-479b367a7817}",
          "originalURI": "about:addons",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 24,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAASAAAABAD//2EAZABkAG8AbgBzADoALwAvAGQAaQBzAGMAbwB2AGUAcgAvAAAAAAAMAACABAD//3ByZXZpb3VzVmlldwAAAAAAAAAAAAD//wAAAAATAP//",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53410078,
          "docshellUUID": "{bfe956d2-bd34-4076-aa47-479b367a7817}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 24,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAAXAAAABAD//2EAZABkAG8AbgBzADoALwAvAGwAaQBzAHQALwBlAHgAdABlAG4AcwBpAG8AbgAAAAwAAIAEAP//cHJldmlvdXNWaWV3AAAAABIAAAAEAP//YQBkAGQAbwBuAHMAOgAvAC8AZABpAHMAYwBvAHYAZQByAC8AAAAAAAAAAAATAP//",
          "structuredCloneVersion": 8,
          "persist": true
        }, {
          "url": "about:addons",
          "title": "Gestionnaire de modules complémentaires",
          "charset": "",
          "ID": 53410079,
          "docshellUUID": "{bfe956d2-bd34-4076-aa47-479b367a7817}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 24,
          "structuredCloneState": "AgAAAAAA8f8AAAAACAD//wQAAIAEAP//dmlldwAAAAAcAACABAD//2FkZG9uczovL3NlYXJjaC90YWIlMjBncm91cHMAAAAADAAAgAQA//9wcmV2aW91c1ZpZXcAAAAAFwAAgAQA//9hZGRvbnM6Ly9saXN0L2V4dGVuc2lvbgAAAAAAEwD//w==",
          "structuredCloneVersion": 8,
          "persist": true
        }],
        "lastAccessed": 1511881899465,
        "hidden": false,
        "mediaBlocked": false,
        "attributes": {},
        "extData": {
          "tabview-tab": "{\"groupID\":1}"
        },
        "userContextId": 0,
        "index": 3,
        "image": "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
        "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY="
      },
      "title": "Gestionnaire de modules complémentaires",
      "image": "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
      "iconLoadingPrincipal": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
      "pos": 1,
      "closedAt": 1511881899465,
      "closedId": 4
    }],
    "busy": false,
    "extData": {
      "tabview-groups": "{\"nextID\":5,\"activeGroupId\":1,\"activeGroupName\":\"Window 1\",\"totalNumber\":2}",
      "tabview-group": "{\"1\":{\"bounds\":{\"left\":20,\"top\":20,\"width\":250,\"height\":200},\"slot\":1,\"userSize\":null,\"stackTabs\":true,\"showThumbs\":true,\"showUrls\":true,\"tileIcons\":true,\"catchOnce\":true,\"catchRules\":\"\",\"title\":\"Window 1\",\"id\":1},\"2\":{\"bounds\":{\"left\":20,\"top\":20,\"width\":250,\"height\":200},\"slot\":2,\"userSize\":null,\"stackTabs\":true,\"showThumbs\":true,\"showUrls\":true,\"tileIcons\":true,\"catchOnce\":true,\"catchRules\":\"\",\"title\":\"Mobile\",\"id\":2}}",
      "tabview-ui": "{\"pageBounds\":{\"left\":0,\"top\":0,\"width\":1885,\"height\":882,\"realTop\":161,\"realLeft\":0},\"searchPosition\":null}"
    },
    "width": "1210",
    "height": "752",
    "screenX": "491",
    "screenY": "291",
    "sizemode": "maximized"
  }, {
    "tabs": [{
      "entries": [{
        "url": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=android&utm_medium=tiles&utm_source=directory-tiles",
        "title": "Navigateurs mobiles pour iOS et Android | Firefox",
        "charset": "UTF-8",
        "ID": 17,
        "docshellUUID": "{6d314243-cb26-4e4c-8f28-51e89dd5ae3e}",
        "originalURI": "https://www.mozilla.org/firefox/android/?utm_source=directory-tiles&utm_medium=tiles&utm_campaign=desktop&utm_content=android",
        "resultPrincipalURI": "https://www.mozilla.org/fr/firefox/mobile/?utm_campaign=desktop&utm_content=android&utm_medium=tiles&utm_source=directory-tiles",
        "loadReplace": true,
        "loadReplace2": true,
        "principalToInherit_base64": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6ezM1ZGU1ZGYzLTVlMTgtNDk0My05MTllLTM3MGVjZGZiZGE1Mn0AAAAA",
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 17,
        "persist": true
      }],
      "lastAccessed": 1511881962962,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 1,
      "userTypedValue": "",
      "userTypedClear": 0,
      "image": "https://www.mozilla.org/media/img/firefox/favicon.e6bb0e59df3d.ico",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAf2h0dHBzOi8vd3d3Lm1vemlsbGEub3JnL2ZyL2ZpcmVmb3gvbW9iaWxlLz91dG1fY2FtcGFpZ249ZGVza3RvcCZ1dG1fY29udGVudD1hbmRyb2lkJnV0bV9tZWRpdW09dGlsZXMmdXRtX3NvdXJjZT1kaXJlY3RvcnktdGlsZXMAAAAAAAAABQAAAAgAAAAPAAAACP////8AAAAI/////wAAAAgAAAAPAAAAFwAAAGgAAAAXAAAAEwAAABcAAAATAAAAKgAAAAAAAAAq/////wAAAAD/////AAAAKwAAAFQAAAAX/////wEAAAAAAAAAAAAAAAA="
    }, {
      "entries": [{
        "url": "https://www.gimp.org/tutorials/Color2BW/",
        "title": "GIMP - Converting Color Images to B&W",
        "charset": "UTF-8",
        "ID": 14,
        "docshellUUID": "{a78c6e1b-1904-4b18-bc91-d0e0af367b65}",
        "originalURI": "https://www.gimp.org/tutorials/Color2BW/",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 14,
        "persist": true
      }],
      "lastAccessed": 1511881925219,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 1,
      "image": "https://www.gimp.org/images/wilber16.png",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAKGh0dHBzOi8vd3d3LmdpbXAub3JnL3R1dG9yaWFscy9Db2xvcjJCVy8AAAAAAAAABQAAAAgAAAAMAAAACP////8AAAAI/////wAAAAgAAAAMAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAKAAAAAAAAAAo/////wAAAAD/////AAAAFP////8AAAAU/////wEAAAAAAAAAAAAAAAA="
    }, {
      "entries": [{
        "url": "https://github.com/Quicksaver/Tab-Groups",
        "title": "GitHub - Quicksaver/Tab-Groups: Reimplementation of Firefox Tab Groups as an add-on.",
        "charset": "UTF-8",
        "ID": 15,
        "docshellUUID": "{f5fdc3f1-c7a0-4c3e-8b30-eeb4a4460f42}",
        "originalURI": "https://github.com/Quicksaver/Tab-Groups",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 15,
        "persist": true
      }],
      "lastAccessed": 1511881925951,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 1,
      "image": "https://assets-cdn.github.com/favicon.ico",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAKGh0dHBzOi8vZ2l0aHViLmNvbS9RdWlja3NhdmVyL1RhYi1Hcm91cHMAAAAAAAAABQAAAAgAAAAKAAAACP////8AAAAI/////wAAAAgAAAAKAAAAEgAAABYAAAASAAAAFgAAABIAAAAMAAAAHgAAAAoAAAAe/////wAAAAD/////AAAAEv////8AAAAS/////wEAAAAAAAAAAAAAAAA="
    }],
    "selected": 1,
    "_closedTabs": [{
      "state": {
        "entries": [{
          "url": "about:home",
          "title": "Page de démarrage de Mozilla Firefox",
          "charset": "",
          "ID": 13,
          "docshellUUID": "{8b2171eb-cd37-49d6-b303-2a9368204ea5}",
          "resultPrincipalURI": null,
          "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
          "docIdentifier": 13,
          "persist": true
        }],
        "lastAccessed": 1511881922563,
        "hidden": false,
        "mediaBlocked": true,
        "attributes": {},
        "extData": {
          "tabview-tab": "null"
        },
        "userContextId": 0,
        "index": 1,
        "image": "chrome://branding/content/icon32.png",
        "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYBLyd8AA6vTdu5NkEya6SKrpIHOlRteE8wkTq4cYEyCMYAAAAABWFib3V0AAAABGhvbWUAAODaHXAvexHTjNAAYLD8FKOSBzpUbXhPMJE6uHGBMgjGAAAAAA5tb3otc2FmZS1hYm91dAAAAARob21lAAAAAAAAAAAA"
      },
      "title": "Page de démarrage de Mozilla Firefox",
      "image": "chrome://branding/content/icon32.png",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYBLyd8AA6vTdu5NkEya6SKrpIHOlRteE8wkTq4cYEyCMYAAAAABWFib3V0AAAABGhvbWUAAODaHXAvexHTjNAAYLD8FKOSBzpUbXhPMJE6uHGBMgjGAAAAAA5tb3otc2FmZS1hYm91dAAAAARob21lAAAAAAAAAAAA",
      "pos": 0,
      "closedAt": 1511881928104,
      "closedId": 6
    }],
    "busy": false,
    "width": 1210,
    "height": 752,
    "screenX": 2535,
    "screenY": 291,
    "sizemode": "normal",
    "extData": {
      "tabview-groups": "{\"nextID\":2,\"activeGroupId\":1,\"activeGroupName\":null,\"totalNumber\":1}",
      "tabview-group": "{\"1\":{\"bounds\":{\"left\":15,\"top\":5,\"width\":1237.285,\"height\":574.9540000000001},\"slot\":1,\"userSize\":null,\"stackTabs\":true,\"showThumbs\":true,\"showUrls\":true,\"tileIcons\":true,\"catchOnce\":true,\"catchRules\":\"\",\"title\":\"Window 2\",\"id\":1}}",
      "tabview-ui": "{\"pageBounds\":{\"left\":0,\"top\":0,\"width\":1175,\"height\":591,\"realTop\":161,\"realLeft\":0},\"searchPosition\":null}"
    }
  }],
  "selectedWindow": 1,
  "_closedWindows": [{
    "tabs": [{
      "entries": [{
        "url": "about:home",
        "title": "Page de démarrage de Mozilla Firefox",
        "charset": "",
        "ID": 4247988412,
        "docshellUUID": "{6a5562c5-badf-4d54-ad79-9be24156f3be}",
        "resultPrincipalURI": null,
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 1,
        "persist": true
      }, {
        "url": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
        "title": "Débuter avec Firefox – aperçu des fonctionnalités principales | Assistance de Firefox",
        "charset": "UTF-8",
        "ID": 4247988413,
        "docshellUUID": "{6a5562c5-badf-4d54-ad79-9be24156f3be}",
        "originalURI": "https://www.mozilla.org/fr/firefox/central/",
        "resultPrincipalURI": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
        "loadReplace": true,
        "loadReplace2": true,
        "principalToInherit_base64": "vQZuXxRvRHKDMXv9BbHtkAAAAAAAAAAAwAAAAAAAAEYAAAA4bW96LW51bGxwcmluY2lwYWw6e2I1MjVjYzg3LTJhNDAtNGY5Ni04MWQ5LTM5ZmI3ZGVlZGU1NX0AAAAA",
        "triggeringPrincipal_base64": "SmIS26zLEdO3ZQBgsLbOywAAAAAAAAAAwAAAAAAAAEY=",
        "docIdentifier": 2,
        "children": [{
          "url": "https://www.youtube.com/embed/Nnu0A-jIh-U?wmode=transparent&rel=0",
          "title": "Firefox - How to set the home page - YouTube",
          "charset": "UTF-8",
          "ID": 4247988414,
          "docshellUUID": "{1752c4d3-45be-4f87-a659-1abba62c8162}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/Nnu0A-jIh-U?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 3
        }, {
          "url": "https://www.youtube.com/embed/F3uMpJ0YzqM?wmode=transparent&rel=0",
          "title": "Firefox - How to use bookmarks to save and organize your favorite websites - YouTube",
          "charset": "UTF-8",
          "ID": 4247988415,
          "docshellUUID": "{b3dff855-63a9-4e2c-9c27-b047f600f6d2}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/F3uMpJ0YzqM?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 4
        }, {
          "url": "https://www.youtube.com/embed/U7stmWKvk64?wmode=transparent&rel=0",
          "title": "Firefox Awesome Bar - Find your bookmarks, history and tabs when you type in the address bar - YouTube",
          "charset": "UTF-8",
          "ID": 4247988416,
          "docshellUUID": "{cfbae03f-0f3f-4854-9e00-6ca473f58600}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/U7stmWKvk64?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 5
        }, {
          "url": "https://www.youtube.com/embed/r3s-zDwLjb0?wmode=transparent&rel=0",
          "title": "Firefox Private Browsing - Browse the web without saving information about the sites you visit - YouTube",
          "charset": "UTF-8",
          "ID": 4247988417,
          "docshellUUID": "{abe48569-5986-48c9-ab4d-c9c34a82735b}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/r3s-zDwLjb0?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 6
        }, {
          "url": "https://www.youtube.com/embed/94tAqUObEfc?wmode=transparent&rel=0",
          "title": "Customize Firefox controls, buttons and toolbars - YouTube",
          "charset": "UTF-8",
          "ID": 4247988418,
          "docshellUUID": "{32822ec3-a22b-4c75-adee-d46ab0331267}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/94tAqUObEfc?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 7
        }, {
          "url": "https://www.youtube.com/embed/i4y_CeifV2s?wmode=transparent&rel=0",
          "title": "https://www.youtube.com/embed/i4y_CeifV2s?wmode=transparent&rel=0",
          "charset": "UTF-8",
          "ID": 4247988419,
          "docshellUUID": "{83326997-64f8-447e-821e-6959dd122025}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/i4y_CeifV2s?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 8
        }, {
          "url": "https://www.youtube.com/embed/wSVJrWzoq7E?wmode=transparent&rel=0",
          "title": "How do I set up Firefox Sync? - YouTube",
          "charset": "UTF-8",
          "ID": 4247988420,
          "docshellUUID": "{3234e881-000b-4ad8-a7ad-e69159bb47ce}",
          "referrer": "https://support.mozilla.org/fr/kb/debuter-firefox-apercu-fonctionnalites-principales",
          "referrerPolicy": 1,
          "originalURI": "https://www.youtube.com/embed/wSVJrWzoq7E?wmode=transparent&rel=0",
          "resultPrincipalURI": null,
          "principalToInherit_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "triggeringPrincipal_base64": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA==",
          "docIdentifier": 9
        }],
        "persist": true
      }],
      "lastAccessed": 1511781514669,
      "hidden": false,
      "mediaBlocked": true,
      "attributes": {},
      "extData": {
        "tabview-tab": "{\"groupID\":1}"
      },
      "userContextId": 0,
      "index": 2,
      "storage": {
        "https://www.youtube.com": {
          "yt-remote-fast-check-period": "{\"data\":\"1510490757836\",\"creation\":1510490457836}",
          "yt-remote-session-app": "{\"data\":\"youtube-desktop\",\"creation\":1511781513613}",
          "yt-remote-session-name": "{\"data\":\"Desktop\",\"creation\":1511781513614}"
        }
      },
      "image": "https://support.cdn.mozilla.net/static/sumo/img/favicon.ico",
      "iconLoadingPrincipal": "ZT4OTT7kRfqycpfCC8AeuAAAAAAAAAAAwAAAAAAAAEYB3pRy0IA0EdOTmQAQS6D9QJIHOlRteE8wkTq4cYEyCMYAAAAC/////wAAAbsBAAAAVGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9mci9rYi9kZWJ1dGVyLWZpcmVmb3gtYXBlcmN1LWZvbmN0aW9ubmFsaXRlcy1wcmluY2lwYWxlcwAAAAAAAAAFAAAACAAAABMAAAAI/////wAAAAj/////AAAACAAAABMAAAAbAAAAOQAAABsAAAA5AAAAGwAAAAcAAAAiAAAAMgAAACL/////AAAAAP////8AAAAb/////wAAABv/////AQAAAAAAAAAAAAAAAA=="
    }],
    "selected": 1,
    "_closedTabs": [],
    "width": 960,
    "height": 651,
    "screenX": 1976,
    "screenY": 318,
    "sizemode": "normal",
    "title": "Débuter avec Firefox – aperçu des fonctionnalités principales | Assistance de Firefox",
    "closedAt": 1511781514671,
    "closedId": 0
  }],
  "session": {
    "lastUpdate": 1511882044085,
    "startTime": 1510488614325,
    "recentCrashes": 0
  },
  "global": {},
  "cookies": [{
    "host": "support.mozilla.org",
    "value": "France",
    "path": "/fr/kb/",
    "name": "geoip_country_name",
    "originAttributes": {
      "appId": 0,
      "firstPartyDomain": "",
      "inIsolatedMozBrowser": false,
      "privateBrowsingId": 0,
      "userContextId": 0
    }
  }, {
    "host": "support.mozilla.org",
    "value": "FR",
    "path": "/fr/kb/",
    "name": "geoip_country_code",
    "originAttributes": {
      "appId": 0,
      "firstPartyDomain": "",
      "inIsolatedMozBrowser": false,
      "privateBrowsingId": 0,
      "userContextId": 0
    }
  }, {
    "host": ".support.mozilla.org",
    "value": "62528430",
    "path": "/",
    "name": "__utmc",
    "originAttributes": {
      "appId": 0,
      "firstPartyDomain": "",
      "inIsolatedMozBrowser": false,
      "privateBrowsingId": 0,
      "userContextId": 0
    }
  }, {
    "host": ".youtube.com",
    "value": "l8AH4psyaRo",
    "path": "/",
    "name": "YSC",
    "httponly": true,
    "originAttributes": {
      "appId": 0,
      "firstPartyDomain": "",
      "inIsolatedMozBrowser": false,
      "privateBrowsingId": 0,
      "userContextId": 0
    }
  }, {
    "host": "github.com",
    "value": "eyJzZXNzaW9uX2lkIjoiNzgwZmRjZDRhNWViOTIxMjVmMThlNDlmZjRiMWYwNDQiLCJsYXN0X3JlYWRfZnJvbV9yZXBsaWNhcyI6MTUxMTg4MTkyNjMzMiwic3B5X3JlcG8iOiJRdWlja3NhdmVyL1RhYi1Hcm91cHMiLCJzcHlfcmVwb19hdCI6MTUxMTg4MTkyNiwiX2NzcmZfdG9rZW4iOiJrZnRIczNrUHo0SmVySzhLOUhJcFpZSGJLVWpiTVRFMk5EL0NVdWNibFV3PSIsImZsYXNoIjp7ImRpc2NhcmQiOlsiYW5hbHl0aWNzX2xvY2F0aW9uIl0sImZsYXNoZXMiOnsiYW5hbHl0aWNzX2xvY2F0aW9uIjoiLzx1c2VyLW5hbWU%2BLzxyZXBvLW5hbWU%2BIn19fQ%3D%3D--0e214e9fb88d826ff7a8c3f3a711decebf5f544e",
    "path": "/",
    "name": "_gh_sess",
    "secure": true,
    "httponly": true,
    "originAttributes": {
      "appId": 0,
      "firstPartyDomain": "",
      "inIsolatedMozBrowser": false,
      "privateBrowsingId": 0,
      "userContextId": 0
    }
  }, {
    "host": "github.com",
    "value": "CET",
    "path": "/",
    "name": "tz",
    "secure": true,
    "originAttributes": {
      "appId": 0,
      "firstPartyDomain": "",
      "inIsolatedMozBrowser": false,
      "privateBrowsingId": 0,
      "userContextId": 0
    }
  }]
}
