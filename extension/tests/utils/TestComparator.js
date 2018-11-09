import Utils from '../../background/utils/utils'

const TestComparator = {};

TestComparator.compileErrorMsg = function(title, variable, val, val_ref) {
  return title + ": " + variable + " is different.\n" + variable + ": " + val + "\n" + variable + " ref: " + val_ref + "\n";
}

/**
 * If not full: compare only url, pinned, active, discarded
 * If full compare: title
 */
TestComparator.compareTab = function(tabs, tabs_ref, full = false) {
  return TestComparator.compareTabs([tabs], [tabs_ref], full);
}

TestComparator.compareTabs = function(tabs, tabs_ref, full = false) {
  let title = "Tabs comparator";
  if (tabs.length !== tabs_ref.length)
    return [
      false,
      TestComparator.compileErrorMsg(title, "Length", tabs.length, tabs_ref.length),
    ];

  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].url !== tabs_ref[i].url)
      return [
        false,
        TestComparator.compileErrorMsg(title, "URL", tabs[i].url, tabs_ref[i].url),
      ];
    if (tabs[i].pinned !== tabs_ref[i].pinned)
      return [
        false,
        TestComparator.compileErrorMsg(title, "Pinned", tabs[i].pinned, tabs_ref[i].pinned),
      ];
    if (tabs[i].active !== tabs_ref[i].active)
      return [
        false,
        TestComparator.compileErrorMsg(title, "Active", tabs[i].active, tabs_ref[i].active),
      ];
    if (Utils.hasDiscardFunction() && tabs[i].discarded !== tabs_ref[i].discarded) {
      return [
        false,
        TestComparator.compileErrorMsg(title, "Discarded", tabs[i].discarded, tabs_ref[i].discarded),
      ];
    }
    if (tabs[i].index !== tabs_ref[i].index)
      return [
        false,
        TestComparator.compileErrorMsg(title, "Index", tabs[i].index, tabs_ref[i].index),
      ];
    if (full) {
      if (tabs[i].title !== tabs_ref[i].title)
        return [
          false,
          TestComparator.compileErrorMsg(title, "Title", tabs[i].title, tabs_ref[i].title),
        ];
    }
  }

  return [true, "Tabs are similar."];
}

TestComparator.compareGroup = function(groups, groups_ref) {

  let title = "Group comparator";

  if (groups.title !== groups_ref.title)
    return [false, TestComparator.compileErrorMsg(title, "Title", groups.title, groups_ref.title)];
  if (groups.id !== groups_ref.id)
    return [false, TestComparator.compileErrorMsg(title, "Id", groups.id, groups_ref.id)];
  if (groups.windowId !== groups_ref.windowId)
    return [false, TestComparator.compileErrorMsg(title, "Window Id", groups.windowId, groups_ref.windowId)];
  if (groups.incognito !== groups_ref.incognito)
    return [false, TestComparator.compileErrorMsg(title, "Incognito", groups.incognito, groups_ref.incognito)];
  if (groups.index !== groups_ref.index)
    return [false, TestComparator.compileErrorMsg(title, "Index", groups.index, groups_ref.index)];
  if (groups.position !== groups_ref.position)
    return [false, TestComparator.compileErrorMsg(title, "Position", groups.position, groups_ref.position)];
  let tab_result;
  if (!(tab_result = TestComparator.compareTabs(groups.tabs, groups_ref.tabs, false))[0]) {
    tab_result[1] += "Groups comparator: " + tab_result[1];
    return tab_result;
  }
  return [true, "Group is similar."];
}

TestComparator.compareGroups = function(groups, groups_ref) {
  let title = "Groups comparator";

  if (groups.length !== groups_ref.length)
    return [
      false,
      TestComparator.compileErrorMsg(title, "Length", groups.length, groups_ref.length),
    ];

  let group_result;
  for (let i = 0; i < groups.length; i++) {
    if (!(group_result = TestComparator.compareGroup(groups[i], groups_ref[i]))[0]) {
      group_result[1] = "Groups comparator @ " + i + ": " + group_result[1];
      return group_result;
    }
  }

  return [true, "Groups are similar."];
}

export default TestComparator