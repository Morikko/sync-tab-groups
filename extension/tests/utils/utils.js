
TestManager.DOUBLE_MONITORS = true;

TestManager.splitOnHalfScreen = async function(windowId){
  return browser.windows.update(windowId, {
      left: TestManager.DOUBLE_MONITORS?window.screen.width:0,
      top: 3,
      width: Math.round(window.screen.width/2),
      height: window.screen.height,
  });
}

TestManager.resetActiveProperties = function (tabs) {
  tabs.forEach((tab)=>{
    tab.active = false;
  });
}

TestManager.resetIndexProperties = function (tabs) {
  tabs.forEach((tab, index)=>{
    tab.index = index;
  });
}
