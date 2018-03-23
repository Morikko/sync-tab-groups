describe('FileStorage', ()=>{
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  describe(' on import file', ()=>{
    describe(' of type Sync Tab Groups', ()=>{
      it(' should import file', ()=>{
        let importedGroups = StorageManager.File.importGroupsFromFile(
          Examples.syncTabGroups_2w_3g
        );

        expect(importedGroups).toEqualGroups(Examples.importedGroups);
      });
    });

    describe(' of type Tab Groups (legacy)', ()=>{
      it(' should import file with session', ()=>{
        let importedGroups = StorageManager.File.importGroupsFromFile(
          Examples.tabGroups_2w_3g_session
        );

        expect(importedGroups).toEqualGroups(Examples.importedGroups);
      });

      it(' should import file without session', ()=>{
        let importedGroups = StorageManager.File.importGroupsFromFile(
          Examples.tabGroups_2w_3g
        );

        expect(importedGroups).toEqualGroups(Examples.importedGroups);
      });
    });
  })
})
