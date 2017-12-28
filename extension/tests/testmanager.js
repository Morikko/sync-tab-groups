/**
 * Tests the good behavior - only backend not front end
 * Tests list:

 1. Create Group
  1. Empty
  2. With tabs
 2. Rename Group


 3. Select tab
   1. In current window
   2. Another window
   3. Closed group


 4. Move tab
   1. Open -> Open
   2. Open -> Close
   3. Close -> Close
   4. Close -> Open
 5. Move tab pinned
   1. Open -> Open
   2. Open -> Close
   3. Close -> Close
   4. Close -> Open



 4. Open new window
   1. Group with tabs
   2. Empty
   3. Private + (not taking in account)


 5. Remove
   1. Check doesn't exist
   2. Check not open
 6. Close
   1. Check not open anymore
   2. With privileged url -> remove
   3. With only privileged url -> still window open (in another group)/and group present (closed)
   2. Check new focused group has changed command + -> x
   3. Private window, auto removed
   4. Change group without pinned
   5. Change group with pinned

 */
var TestManager = TestManager || {};

TestManager.last_results = [];
TestManager.currentTests = [];
TestManager.allTests = [];

TestManager.allTests.push(TestManager.delayedtask);
TestManager.allTests.push(TestManager.repeatedtask);
TestManager.allTests.push(TestManager.import_export);
TestManager.allTests.push(TestManager.switchgroup_pinnedsync);
TestManager.allTests.push(TestManager.movetabs);

TestManager.currentTests.push(TestManager.movetabs);

//TestManager.doTests(TestManager.currentTests);
