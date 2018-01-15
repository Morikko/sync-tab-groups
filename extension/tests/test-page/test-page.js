var bg;

(async () => {
  bg = await browser.runtime.getBackgroundPage();
  GroupManager = bg.GroupManager;
})()
