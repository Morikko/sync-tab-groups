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
  return TestManager.compareGroups([groups], [groups_ref]);
}

TestManager.compareGroups = function(groups, groups_ref) {
  /*console.log(groups);
  console.log(groups_ref);*/
  let title = "Groups comparator";

  if (groups.length !== groups_ref.length)
    return [
      false,
      TestManager.compileErrorMsg(title, "Length", groups.length, groups_ref.length)
    ];

  for (let i = 0; i < groups.length; i++) {
    if (groups[i].title !== groups_ref[i].title)
      return [false, TestManager.compileErrorMsg(title, "Title", groups[i].title, groups_ref[i].title)];
    if (groups[i].id !== groups_ref[i].id)
      return [false, TestManager.compileErrorMsg(title, "Id", groups[i].id, groups_ref[i].id)];
    if (groups[i].windowId !== groups_ref[i].windowId)
      return [false, TestManager.compileErrorMsg(title, "Window Id", groups[i].windowId, groups_ref[i].windowId)];
    if (groups[i].incognito !== groups_ref[i].incognito)
      return [false, TestManager.compileErrorMsg(title, "Incognito", groups[i].incognito, groups_ref[i].incognito)];
    if (groups[i].index !== groups_ref[i].index)
      return [false, TestManager.compileErrorMsg(title, "Index", groups[i].index, groups_ref[i].index)];
    if (groups[i].position !== groups_ref[i].position)
      return [false, TestManager.compileErrorMsg(title, "Position", groups[i].position, groups_ref[i].position)];
    let tab_result;
    if (!(tab_result = TestManager.compareTabs(groups[i].tabs, groups_ref[i].tabs, false))[0]) {
      tab_result[1] += "Groups comparator: " + tab_result[1];
      return tab_result;
    }
  }
  return [true, "Groups are similar."];
}

var tabGroupsMatchers = {
  /**
   * Compare only:
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
