describe('Selector - ', () => {

  beforeAll(TestManager.initIntegrationBeforeAll());
  afterAll(TestManager.initIntegrationAfterAll());

  describe('Windows ', () => {
    it(' is well opened', async () => {
      const title = "Test 1";

      await Selector.closeGroupsSelector();
      expect(Selector.WINDOW_ID).toEqual(WINDOW_ID_NONE);

      await Selector.onOpenGroupsSelector({
        title,
        groups: Session.createArrayGroups({groupsLength:2, length: 3})
      });

      expect(Selector.WINDOW_ID).not.toEqual(WINDOW_ID_NONE);
      await Utils.wait(500)
      await TestManager.waitAllTabsToBeLoadedInWindowId(Selector.WINDOW_ID);
      const w = await browser.windows.get(Selector.WINDOW_ID, {populate: true});

      console.log(w)
      expect(w.tabs.length).toEqual(1);
      expect(
        w.tabs[0].title.includes(title)
      ).toBe(true);
    });

    it(' is well updated', async () => {
      if ( Selector.WINDOW_ID === WINDOW_ID_NONE) {
        await Selector.onOpenGroupsSelector({
          groups: Session.createArrayGroups({groupsLength:2, length: 3})
        });
      }
      expect(Selector.WINDOW_ID).not.toEqual(WINDOW_ID_NONE);

      const previousWindowId = Selector.WINDOW_ID;

      let saveTitle = Selector.file;
      const title = "Test 2";

      await Selector.onOpenGroupsSelector({
        title,
        groups: Session.createArrayGroups({groupsLength:2, length: 3})
      });
      expect(Selector.WINDOW_ID).not.toEqual(WINDOW_ID_NONE);
      expect(Selector.WINDOW_ID).toEqual(previousWindowId);
      await TestManager.waitAllTabsToBeLoadedInWindowId(Selector.WINDOW_ID);
      const w = await browser.windows.get(Selector.WINDOW_ID, {populate: true});

      expect(
        w.tabs[0].title.includes(title)
      ).toBe(true);

    });

    it(' is well closed', async () => {
      if ( Selector.WINDOW_ID === WINDOW_ID_NONE) {
        await Selector.onOpenGroupsSelector({
          groups: Session.createArrayGroups({groupsLength:2, length: 3})
        });
      }
      expect(Selector.WINDOW_ID).not.toEqual(WINDOW_ID_NONE);

      await browser.windows.remove(Selector.WINDOW_ID);
      //await Utils.wait(1000)
      expect(Selector.WINDOW_ID).toEqual(WINDOW_ID_NONE);
    });
  });

  // TODO
  describe('.manageFinish', ()=>{
    it(' should export groups with StorageManager.File.downloadGroups', )

    it(' should import groups with Group.addGroups')
  })

});
