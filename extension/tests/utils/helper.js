/**
 * Function to prepare tests context
 * Save, Change, Restore :: groups, options, storage...
 */
var TestManager = TestManager || {};

TestManager.initUnitBeforeAll = function(){
  return function(){
    // Done at the rootest describe
    jasmine.addMatchers(tabGroupsMatchers);
  }
}

// Deprecated
TestManager.initBeforeEach = function(){
  return function(){
    TestManager.setDynamicEnable();
  }
}


TestManager.initIntegrationBeforeAll = function(){
  return async function() {
    // Done at the rootest describe
    jasmine.addMatchers(tabGroupsMatchers);
    this.previousOptions = TestManager.swapOptions();
    this.previousGroups = TestManager.swapGroups();
    this.initialWindows = await TestManager.getWindowIds();
    this.initialStorage = await TestManager.swapLocalStorage();
    OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
    await Utils.wait(300);
  }
}

TestManager.initIntegrationAfterAll = function(){
  return async function(){
    // Done at the rootest describe
    TestManager.swapOptions(this.previousOptions);
    TestManager.swapGroups(this.previousGroups);
    await TestManager.swapLocalStorage(this.initialStorage);
    OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
    await TestManager.clearWindows(this.initialWindows);
    await Utils.wait(300);
  }
}

// Deprecated
TestManager.setDynamicEnable = function() {
  if ( Utils.getParameterByName("enable") !== 'true' ) {
    pending();
  }
}

TestManager.changeSomeOptions = async function (params) {
  let previousValues = {};
  for (let p in params ) {
    previousValues[p] = OptionManager.getOptionValue(p);
    await OptionManager.updateOption(p, params[p]);
  }
}

/**
 * Set new options as @params
 * return the previous ones
 */
TestManager.swapOptions = function (params=OptionManager.TEMPLATE()) {
  let options = OptionManager.options;
  OptionManager.options = params;
  return options;
}

/**
 * Set new groups as @params
 * return the previous ones
 */
TestManager.swapGroups = function (params=[]) {
  let groups = GroupManager.groups;
  GroupManager.groups = params;
  return groups;
}

TestManager.getWindowIds = async function() {
  return (await browser.windows.getAll()).map(w => w.id);
}

TestManager.clearWindows = async function(filter=[]) {
  const allWindows = (await browser.windows.getAll())
          .map(w => w.id)
          .filter(windowId => filter.indexOf(windowId) === -1);

  await Promise.all(
    allWindows.map((windowId)=> browser.windows.remove(windowId))
  )
}

TestManager.swapLocalStorage = async function (params={}) {
  let previousValues = await browser.storage.local.get(null);
  await browser.storage.local.clear();
  await browser.storage.local.set(params);
  return previousValues;
}

const TIME_OBJECTS = [
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "Date",
]

var savedTime = {};
TestManager.installFakeTime = function() {
  if (!Object.keys(savedTime).length) {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    // Change setInterval and set this reference to the backgroung
    savedTime = {};
    TIME_OBJECTS.forEach((time)=>{
      savedTime[time] = bg[time];
      bg[time] = window[time];
    });
  }
}

// Done only is previously saved
TestManager.uninstallFakeTime = function() {
  if (Object.keys(savedTime).length) {
    jasmine.clock().uninstall();
    Object.assign(bg, savedTime);
    savedTime = {};
  }
}
