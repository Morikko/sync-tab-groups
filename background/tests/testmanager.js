/**
 * Tests the good behavior - only backend not front end
 * Tests list:

 1. Create Group
  1. Empty
  2. With tabs
 2. Rename Group


 3. Change group
   1. In current window
   2. Another window
   3. Change group without pinned
   4. Change group with pinned


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

TestManager.ERROR = false;
TestManager.DONE = true;

TestManager.last_results = [];

TestManager.Results = function ( code, title, msg, vars  ) {
  return {
    code: code,
    title: title,
    message: msg,
    vars: vars
  }
}

TestManager.printResults = function ( result ) {
  if ( result.code === TestManager.ERROR ) {
    console.log( "[NOK] " + result.title );
    console.log(result.message);
    console.log(result.vars);
  } else {
    console.log( "[OK] " + result.title );
    console.log(result.vars);
  }
}

TestManager.doTests = async function(testsList=TestManager.allTests) {
  try {
    TestManager.last_results = [];
    let index=0;
    for ( test of testsList ) {
        console.log("Test number " + (index+1));
        let result = await (new test()).test();
        TestManager.printResults(result);
        TestManager.last_results.push(result);
        index++;
    }
  } catch ( e ) {
    let msg = "TestManager.doTests failed: " + e;
    console.error(msg);
    return msg;
  }
}

TestManager.doTest = function(test) {
  // clean/init
  // test
  // check/clean

  // return testName, succeed, errors, groupsAtEnd
}

TestManager.allTests = [];
