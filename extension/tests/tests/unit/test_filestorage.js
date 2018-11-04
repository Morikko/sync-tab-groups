describe('FileStorage', ()=>{
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  beforeAll(async function () {
    this.previousOptions = TestManager.swapOptions();
    await TestManager.changeSomeOptions({
      "groups-sortingType": OPTION_CONSTANTS.SORT_OLD_RECENT,
    })
  })

  afterAll(function(){
    TestManager.swapOptions(this.previousOptions);
  })

  describe(' on import file', ()=>{
    describe(' of type Sync Tab Groups', ()=>{
      it(' should import file', ()=>{
        let importedGroups = ExtensionStorageManager.File.importGroupsFromFile(
          Examples.syncTabGroups_2w_3g
        );

        expect(importedGroups).toEqualGroups(Examples.importedGroups);
      });
    });

    describe(' of type Tab Groups (legacy)', ()=>{
      it(' should import file with session', ()=>{
        let importedGroups = ExtensionStorageManager.File.importGroupsFromFile(
          Examples.tabGroups_2w_3g_session
        );

        expect(importedGroups).toEqualGroups(Examples.importedGroups);
      });

      it(' should import file without session', ()=>{
        let importedGroups = ExtensionStorageManager.File.importGroupsFromFile(
          Examples.tabGroups_2w_3g
        );

        expect(importedGroups).toEqualGroups(Examples.importedGroups);
      });
    });
  })
})
