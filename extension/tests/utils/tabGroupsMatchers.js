import TestComparator from './TestComparator'

const tabGroupsMatchers = {
  /**
     * Compare Many Groups:
        * Groups: title, id, windowId, incognito
        * Tabs: length, url, active, pinned, discarded
     * For a complete comparaison: use toEqual
     */
  toEqualGroups: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected, msg="") {
        let result = {};

        if (expected === undefined || actual === undefined) {
          result.pass = false;
          result.message = "Wrong use of toEqualGroups on an undefined expected.";
        } else {
          [result.pass, result.message] = TestComparator.compareGroups(actual, expected);
        }
        result.message += msg;
        return result;
      },
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
          [result.pass, result.message] = TestComparator.compareGroup(actual, expected);
          /*
            result.message += "\nActual Group: \n" + JSON.stringify(actual) + "\n" + "Expected Group: \n" + expected + "\n";
            */
        }
        return result;
      },
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
          [result.pass, result.message] = TestComparator.compareTabs(actual, expected);

          if (!result.pass) {
            window.Background.LogManager.error("toEqualTabs didn't pass", {
              args: arguments,
              resultMessage: result.message,
            }, {logs: null});
          }
        }
        return result;
      },
    }
  },
}

export default tabGroupsMatchers