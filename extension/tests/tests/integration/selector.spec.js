import TestManager from '../../utils/TestManager'
import Session from '../../examples/session'

describe('window.Background.ImportSelector - ', () => {

  beforeAll(TestManager.initIntegrationBeforeAll());

  afterAll(TestManager.initIntegrationAfterAll());

  describe('Windows ', () => {
    it(' is well opened', async() => {
      const title = "Test 1";

      await window.Background.ImportSelector.closeGroupsSelector();

      expect(window.Background.ImportSelector.WINDOW_ID).toEqual(browser.windows.WINDOW_ID_NONE);

      await window.Background.ImportSelector.onOpenGroupsSelector({
        title,
        groups: Session.createArrayGroups({groupsLength: 2,
          length: 3}),
      });

      expect(window.Background.ImportSelector.WINDOW_ID).not.toEqual(browser.windows.WINDOW_ID_NONE);
      await window.Background.Utils.wait(500)
      await TestManager.waitAllTabsToBeLoadedInWindowId(window.Background.ImportSelector.WINDOW_ID);
      const w = await browser.windows.get(window.Background.ImportSelector.WINDOW_ID, {populate: true});

      expect(w.tabs.length).toEqual(1);
      expect(
        w.tabs[0].title.includes(title)
      ).toBe(true);
    });

    it(' is well updated', async() => {
      if (window.Background.ImportSelector.WINDOW_ID === browser.windows.WINDOW_ID_NONE) {
        await window.Background.ImportSelector.onOpenGroupsSelector({
          groups: Session.createArrayGroups({groupsLength: 2,
            length: 3}),
        });
      }

      expect(window.Background.ImportSelector.WINDOW_ID).not.toEqual(browser.windows.WINDOW_ID_NONE);

      const previousWindowId = window.Background.ImportSelector.WINDOW_ID;

      const title = "Test 2";

      await window.Background.ImportSelector.onOpenGroupsSelector({
        title,
        groups: Session.createArrayGroups({groupsLength: 2,
          length: 3}),
      });

      expect(window.Background.ImportSelector.WINDOW_ID).not.toEqual(browser.windows.WINDOW_ID_NONE);
      expect(window.Background.ImportSelector.WINDOW_ID).toEqual(previousWindowId);
      await TestManager.waitAllTabsToBeLoadedInWindowId(window.Background.ImportSelector.WINDOW_ID);
      const w = await browser.windows.get(window.Background.ImportSelector.WINDOW_ID, {populate: true});

      expect(
        w.tabs[0].title.includes(title)
      ).toBe(true);

    });

    it(' is well closed', async() => {
      if (window.Background.ImportSelector.WINDOW_ID === browser.windows.WINDOW_ID_NONE) {
        await window.Background.ImportSelector.onOpenGroupsSelector({
          groups: Session.createArrayGroups({groupsLength: 2,
            length: 3}),
        });
      }

      expect(window.Background.ImportSelector.WINDOW_ID).not.toEqual(browser.windows.WINDOW_ID_NONE);

      await browser.windows.remove(window.Background.ImportSelector.WINDOW_ID);
      await TestManager.waitWindowToBeClosed(window.Background.ImportSelector.WINDOW_ID);

      //await window.Background.Utils.wait(1000)
      expect(window.Background.ImportSelector.WINDOW_ID).toEqual(browser.windows.WINDOW_ID_NONE);
    });
  });

  // TODO
  describe('.manageFinish', ()=>{
    it(' should export groups with ExtensionStorageManager.File.downloadGroups',)

    it(' should import groups with Group.addGroups')
  })

});
