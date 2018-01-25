var TestManager = TestManager || {};

TestManager.compileErrorMsg = function(title, variable, val, val_ref) {
  return msg = title + ": " + variable + " is different.\n" + variable + ": " + val + "\n" + variable + " ref: " + val_ref + "\n";
}

/**
 * If not full: compare only url, pinned, active, discarded
 * If full compare: title
 */
TestManager.compareTab = function(tabs, tabs_ref, full = false) {
  return TestManager.compareTabs([tabs], [tabs_ref], full);
}

TestManager.compareTabs = function(tabs, tabs_ref, full = false) {
  /*console.log(tabs);
  console.log(tabs_ref);*/
  let title = "Tabs comparator";
  if (tabs.length !== tabs_ref.length)
    return [
      false,
      TestManager.compileErrorMsg(title, "Length", tabs.length, tabs_ref.length)
    ];

  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].url !== tabs_ref[i].url)
      return [
        false,
        TestManager.compileErrorMsg(title, "URL", tabs[i].url, tabs_ref[i].url)
      ];
    if (tabs[i].pinned !== tabs_ref[i].pinned)
      return [
        false,
        TestManager.compileErrorMsg(title, "Pinned", tabs[i].pinned, tabs_ref[i].pinned)
      ];
    if (tabs[i].active !== tabs_ref[i].active)
      return [
        false,
        TestManager.compileErrorMsg(title, "Active", tabs[i].active, tabs_ref[i].active)
      ];
    if (tabs[i].discarded !== tabs_ref[i].discarded)
      return [
        false,
        TestManager.compileErrorMsg(title, "Discarded", tabs[i].discarded, tabs_ref[i].discarded)
      ];
    if (tabs[i].index !== tabs_ref[i].index)
      return [
        false,
        TestManager.compileErrorMsg(title, "Index", tabs[i].index, tabs_ref[i].index)
      ];
    if (full) {
      if (tabs[i].title !== tabs_ref[i].title)
        return [
          false,
          TestManager.compileErrorMsg(title, "Title", tabs[i].title, tabs_ref[i].title)
        ];
      }
    }

  return [true, "Tabs are similar."];
}

TestManager.compareGroup = function(groups, groups_ref) {

  let title = "Group comparator";

  if (groups.title !== groups_ref.title)
    return [false, TestManager.compileErrorMsg(title, "Title", groups.title, groups_ref.title)];
  if (groups.id !== groups_ref.id)
    return [false, TestManager.compileErrorMsg(title, "Id", groups.id, groups_ref.id)];
  if (groups.windowId !== groups_ref.windowId)
    return [false, TestManager.compileErrorMsg(title, "Window Id", groups.windowId, groups_ref.windowId)];
  if (groups.incognito !== groups_ref.incognito)
    return [false, TestManager.compileErrorMsg(title, "Incognito", groups.incognito, groups_ref.incognito)];
  if (groups.index !== groups_ref.index)
    return [false, TestManager.compileErrorMsg(title, "Index", groups.index, groups_ref.index)];
  if (groups.position !== groups_ref.position)
    return [false, TestManager.compileErrorMsg(title, "Position", groups.position, groups_ref.position)];
  let tab_result;
  if (!(tab_result = TestManager.compareTabs(groups.tabs, groups_ref.tabs, false))[0]) {
    tab_result[1] += "Groups comparator: " + tab_result[1];
    return tab_result;
  }
  return [true, "Group is similar."];
}

TestManager.compareGroups = function(groups, groups_ref) {
  let title = "Groups comparator";

  if (groups.length !== groups_ref.length)
    return [
      false,
      TestManager.compileErrorMsg(title, "Length", groups.length, groups_ref.length)
    ];

  let group_result;
  for (let i = 0; i < groups.length; i++) {
    if (!(group_result = TestManager.compareGroup(groups[i], groups_ref[i]))[0]) {
      group_result[1] = "Groups comparator @ " + i + ": " + group_result[1];
      return group_result;
    }
  }

  return [true, "Groups are similar."];
}

var tabGroupsMatchers = {
  /**
   * Compare Many Groups:
      * Groups: title, id, windowId, incognito
      * Tabs: length, url, active, pinned, discarded
   * For a complete comparaison: use toEqual
   */
  toEqualGroups: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        let result = {};

        if (expected === undefined || actual === undefined) {
          result.pass = false;
          result.message = "Wrong use of toEqualGroups on an undefined expected.";
        } else {
          [result.pass, result.message] = TestManager.compareGroups(actual, expected);
        }
        return result;
      }
    }
  },

  /**
   * Compare only:
      * Groups: title, id, windowId, incognito
      * Tabs: length, url, active, pinned, discarded
   * For a complete comparaison: use toEqual
   */
  toEqualGroup: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        let result = {};

        if (expected === undefined || actual === undefined) {
          result.pass = false;
          result.message = "Wrong use of toEqualGroup on an undefined expected.";
        } else {
          [result.pass, result.message] = TestManager.compareGroup(actual, expected);
          /*
          result.message += "\nActual Group: \n" + JSON.stringify(actual) + "\n" + "Expected Group: \n" + expected + "\n";
          */
        }
        return result;
      }
    }
  },

  /**
   * Compare only:
      * Tabs: length, url, active, pinned, discarded
   * For a complete comparaison: use toEqual
   */
  toEqualTabs: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        let result = {};

        if (expected === undefined || actual === undefined) {
          result.pass = false;
          result.message = "Wrong use of toEqualTabs on an undefined expected.";
        } else {
          [result.pass, result.message] = TestManager.compareTabs(actual, expected);
          /*
          result.message += "\nActual Group: \n" + JSON.stringify(actual) + "\n" + "Expected Group: \n" + expected + "\n";
          */
        }
        return result;
      }
    }
  }
}
