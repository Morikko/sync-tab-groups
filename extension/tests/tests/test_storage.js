describe('Storage', ()=>{

  beforeAll(()=>{
    jasmine.addMatchers(tabGroupsMatchers);
  });

  // Each IT are lonely
  describe('Local Backup', ()=>{
    beforeAll(async function(){
      this.previousStorage = await TestManager.swapLocalStorage({}, false);
    });

    afterAll(async function(){
      await TestManager.swapLocalStorage(this.previousStorage, true);
    });

    beforeEach(async function(){
      await TestManager.swapLocalStorage({
        backupList: {},
      }, false);
    });

    it('Add a backup', async function(){
      const ref_groups = Utils.getCopy(GroupManager.groups);
      const ref_backupList = await StorageManager.Local.getBackUpList()

      const id = await StorageManager.Local.addBackup(ref_groups);

      const backupList = await StorageManager.Local.getBackUpList(),
            backupGroups = await StorageManager.Local.getBackUp(id);

      const hasId = backupList.hasOwnProperty(id);

      expect(Object.keys(backupList).length-1).toEqual(Object.keys(ref_backupList).length);
      expect(hasId).toBe(true);
      expect(backupGroups).toEqualGroups(ref_groups);
    });

    it('Remove a backup', async function(){
      const ref_groups = Utils.getCopy(GroupManager.groups);
      const id = await StorageManager.Local.addBackup(ref_groups);

      await StorageManager.Local.removeBackup(id);

      const backupList = await StorageManager.Local.getBackUpList(),
            backupGroups = await StorageManager.Local.getBackUp(id);

      const hasId = backupList.hasOwnProperty(id);

      expect(Object.keys(backupList).length).toEqual(0);
      expect(hasId).toBe(false);
      expect(backupGroups).toBe(undefined);
    });

    it('Clean all backups', async function(){
      const ref_groups = Utils.getCopy(GroupManager.groups),
            length=3;

      const ids = [];
      for(let i=0; i<length; i++) {
        ids.push(await StorageManager.Local.addBackup(ref_groups));
      }

      const backupListInter = await StorageManager.Local.getBackUpList();
      expect(Object.keys(backupListInter).length).toEqual(length);

      await StorageManager.Local.clearBackups();

      const backupList = await StorageManager.Local.getBackUpList();

      expect(Object.keys(backupList).length).toEqual(0);
    });

  });

})
