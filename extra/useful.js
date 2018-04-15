// Template for testing
(async function() {
  for (let i=0; i<5; i++) {
    await browser.tabs.create({
      pinned: i<2,
      url: Session.getFakeUrl()
    });
  }
})();

let consoleFactory = function({good="Good", bad="Bad"}={}) {
  let conso = (params) => {console.log(...params)};

  conso.call(null, arguments);
}


var initialWindows = 0 || initialWindows;
(async function() {
  initialWindows = Object.entries( await StorageManager.Local.getBackUpList())
                            // Desc: recent first
                            .sort((a,b) => b[1].date - a[1].date)
                            // Too much
                            .filter((el, index)=> index>=maxSave);
})();

(async function() {
  await StorageManager.Local.removeBackup("backup-1521213969970")
})();


browser.windows.create({
  type: "popup",
  url: "https://www.google.fr"
})

// Queue mode
///// Promise mode
queue = Promise.resolve(); // in ES6 or BB, just Promise.resolve();
index = 0;
[...new Array(5)].forEach(function(el) {
  queue = queue.then(function(res) {
    console.log(index);
    index++;
    return Utils.wait(500)
  });
});

queue.then(function(lastResponse) {
  console.log("Done!");
});
////// Await mode
(async function() {
  queue = Promise.resolve(); // in ES6 or BB, just Promise.resolve();
  index = 0;
  await Promise.all(
    [...new Array(5)].map(async function(el) {
      let next = queue.then(function(res) {
        console.log(index);
        index++;
        return Utils.wait(500)
      });
      queue = next;
      return next;
    })
  )
  console.log("Done!");
})();


(async function() {
  queue = Promise.resolve(); // in ES6 or BB, just Promise.resolve();
  index = 0;
  await Promise.all(
    [...new Array(5)].map(async (el) => queue = queue.then(function(res) {
        console.log(index);
        index++;
        return Utils.wait(500)
      }))
  )
  console.log("Done!");
})();



(async function() {
  await browser.tabs.hide()
})();

(async function() {
  await browser.tabs.create()
})();

(async function() {
  const tabs = await browser.tabs.query({hidden:true});

  browser.tabs.remve(tabs.map(tab => tab.id));

})();

(async function() {
  console.log(await browser.tabs.query({hidden:true}))
})();


// Unsynchronized
queue = Promise.resolve(); // in ES6 or BB, just Promise.resolve();
index = 0;
[...new Array(5)].forEach(function(el) {
    console.log(index);
    index++;
    Utils.wait(500)
});

queue.then(function(lastResponse) {
  console.log("Done!");
});


// Timer decorator examples
groups = Session.createArrayGroups({groupsLength: 20, tabsLength: 20, lazyMode: true})

GroupManager.checkCorruptedGroups = Utils.timerDecorator(GroupManager.checkCorruptedGroups, "corrupted", 10)
GroupManager.checkCorruptedGroups(groups)

Utils.wait = Utils.timerDecorator(Utils.wait, "wait", 3)

waitSuper = WindowManager.decoratorCurrentlyChanging(Utils.wait);
waitSuper(10000);
console.log(WindowManager.WINDOW_CURRENTLY_SWITCHING)

errorFunc = WindowManager.decoratorCurrentlyChanging(async () => {
  await Utils.wait(5000);
  throw Error("I crashed");
});

returnFunc = WindowManager.decoratorCurrentlyChanging(async () => {
  await Utils.wait(5000);
  return "I returned a value";
});

let gg;
(async function() {
  const all = await browser.storage.local.get(null);

  for (let a in all ) {
    if (a.includes("backup-")){
      await browser.storage.local.remove(a);
    }
  }
  console.log("done")
})();

browser.tabs.create({url: "/tabpages/priviledged-tab/priviledged-tab.html?title=Title&url=www.google.com&favIconUrl=http://www.stackoverflow.com/favicon.ico", active: true})

browser.tabs.create({
  url: "/tabpages/discarded-tab/discarded-tab.html?state=redirect&url=" + "https://www.mozilla.org/fr/firefox/new/" + "&title=Debugging+with+Firefox",
  active: false
})

showWindowId = async function() {
  const windows = await browser.windows.getAll({
    //windowTypes: ['popup']
  });
  windows.map((w) => {
    console.log(w);
  });
}

// Chrome
browser = chrome;
showWindowId = async function() {
  const windows = await browser.windows.getAll({
    //windowTypes: ['popup']
  }, function(windows) {
    windows.map((w) => {
      console.log(w.id);
    });
  });
}
showWindowId();

searchBK = async function(search) {
  try {
    const searchResults = await browser.bookmarks.search({title: search});
    console.log(searchResults);
  } catch (e) {
    console.log(e);
  }
}

getBK = async function(id) {
  try {
    const searchResults = await browser.bookmarks.getSubTree(id);
    console.log(searchResults);
  } catch (e) {
    console.log(e);
  }
}

groups = [];
getGroups = async function(id) {
  try {
    groups = await StorageManager.Local.loadGroups();
    console.log(groups);
  } catch (e) {
    console.log(e);
  }
}

let key;
asyncFunc = async function(windowId, REF = WindowManager.WINDOW_GROUPID) {
  try {
    key = await browser.sessions.getWindowValue(windowId, // integer
        REF // string);
  } catch (e) {
    console.log(e);
  }
}

asyncFunc = async function() {
  try {
    const windows = await browser.windows.getAll();
    console.log(windows)
    for (let w of windows) {
      console.log(w.title)
      //if ( w.title.includes("Shortcuts List for Sync Tab Group")){
      console.log("ta mere")
      await browser.windows.update(w.id, {focused: true})
      //}
    }
  } catch (e) {
    console.log(e);
  }
}

var createData = {
  type: "detached_panel",
  url: "/tabpages/shortcut-help/shortcut-help.html",
  width: 250,
  height: 100
};
var creating = browser.windows.create(createData);
