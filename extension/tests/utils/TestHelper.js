/**
 * Function to prepare tests context
 * Save, Change, Restore :: groups, options, storage...
 */
import Utils from '../../background/utils/utils'
import jasmine from 'jasmine'
import tabGroupsMatchers from './tabGroupsMatchers'
import Background from '../utils/Background'
const {
  GroupManager,
  OptionManager,
  OPTION_CONSTANTS,
} = Background

const TestHelper = {};

TestHelper.initUnitBeforeAll = function() {
  return function() {
    // Done at the rootest describe
    jasmine.addMatchers(tabGroupsMatchers);
  }
}

// Deprecated
TestHelper.initBeforeEach = function() {
  return function() {
    TestHelper.setDynamicEnable();
  }
}


TestHelper.initIntegrationBeforeAll = function() {
  return async function() {
    // Done at the rootest describe
    jasmine.addMatchers(tabGroupsMatchers);
    this.previousOptions = TestHelper.swapOptions();
    this.previousGroups = TestHelper.swapGroups();
    this.initialWindows = await TestHelper.getWindowIds();
    this.initialStorage = await TestHelper.swapLocalStorage();
    OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
    await Utils.wait(300);
  }
}

TestHelper.initIntegrationAfterAll = function() {
  return async function() {
    // Done at the rootest describe
    TestHelper.swapOptions(this.previousOptions);
    TestHelper.swapGroups(this.previousGroups);
    await TestHelper.swapLocalStorage(this.initialStorage);
    OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
    await TestHelper.clearWindows(this.initialWindows);
    await Utils.wait(300);
  }
}

// Deprecated
TestHelper.setDynamicEnable = function() {
  if (Utils.getParameterByName("enable") !== 'true') {
    pending();
  }
}

TestHelper.changeSomeOptions = async function(params) {
  let previousValues = {};
  for (let p in params) {
    previousValues[p] = OptionManager.getOptionValue(p);
    await OptionManager.updateOption(p, params[p]);
  }
}

/**
 * Set new options as @params
 * return the previous ones
 */
TestHelper.swapOptions = function(params=OPTION_CONSTANTS.TEMPLATE()) {
  let options = OptionManager.options;
  OptionManager.options = params;
  return options;
}

/**
 * Set new groups as @params
 * return the previous ones
 */
TestHelper.swapGroups = function(params=[]) {
  let groups = GroupManager.groups;
  GroupManager.groups = params;
  return groups;
}

TestHelper.getWindowIds = async function() {
  return (await browser.windows.getAll()).map(w => w.id);
}

TestHelper.clearWindows = async function(filter=[]) {
  const allWindows = (await browser.windows.getAll())
    .map(w => w.id)
    .filter(windowId => filter.indexOf(windowId) === -1);

  await Promise.all(
    allWindows.map((windowId)=> browser.windows.remove(windowId))
  )
}

TestHelper.swapLocalStorage = async function(params={}) {
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

let savedTime = {};
TestHelper.installFakeTime = function() {
  if (!Object.keys(savedTime).length) {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    // Change setInterval and set this reference to the backgroung
    savedTime = {};
    TIME_OBJECTS.forEach((time)=>{
      savedTime[time] = Background[time];
      Background[time] = window[time];
    });
  }
}

// Done only is previously saved
TestHelper.uninstallFakeTime = function() {
  if (Object.keys(savedTime).length) {
    jasmine.clock().uninstall();
    Object.assign(Background, savedTime);
    savedTime = {};
  }
}

export default TestHelper