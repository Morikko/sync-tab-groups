var TabManager = TabManager || {};

/**
 * WARNING: this funtion is not working well on firefox
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1420681
 * Any tab with a beforeunload event set will not be discardable...
 */
TabManager.undiscardAll = async function (globalCount = 0, callbackAfterFirstUndiscard=undefined) {
  return new Promise(async function(resolve, reject){
    let queue = Promise.resolve();

    let hadDiscarded = false;

    //console.log("Clean: " + globalCount);
    let tabs = await browser.tabs.query({});
    tabs.forEach(async (tab)=>{
      queue = queue.then(async function(){
        //console.log(tab.url)
        if( tab.url.includes(Utils.LAZY_PAGE_URL)) {
          hadDiscarded = true;

          try {
            // Change
            await browser.tabs.update(tab.id, {
              url: Utils.extractTabUrl(tab.url)
            });
            //console.log("Update tab: " + tab.id);
            if ( callbackAfterFirstUndiscard ) { // For tests purpose
              callbackAfterFirstUndiscard();
              callbackAfterFirstUndiscard = undefined;
            }
            await Utils.wait(300);
            // Wait full loading
            let count = 0;
            while( ((await browser.tabs.get(tab.id)).status === "loading")
                && count < 30 ) { // Wait max ~ 10s
              await Utils.wait(300);
              count++;
            }

            // Discard but Check active (due to loading waiting)
            if ( (await browser.tabs.get(tab.id)).status === "complete") {
              await browser.tabs.discard(tab.id);
            }

          } catch ( e ) { // Tab has changed (closed, moved, actived...)
            // Do nothing but avoid a crash
            //console.log("Error in TabManager.undiscardAll: " + e)
          }

        }
        return;
        })
    });

    queue.then(function(lastResponse){
      if ( hadDiscarded
        && globalCount < 10 ) {
        resolve(TabManager.undiscardAll(++globalCount));
      } else {
        //browser.runtime.reload();
        resolve();
        //console.log("Done!");
      }
    });
  });
}