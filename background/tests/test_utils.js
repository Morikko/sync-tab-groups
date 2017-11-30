var TestManager = TestManager || {};

TestManager.ERROR = false;
TestManager.DONE = true;

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
