import TestManager from '../../utils/TestManager'

describe('Storage', () => {

  beforeAll(TestManager.initIntegrationBeforeAll());

  afterAll(TestManager.initIntegrationAfterAll());

  describe('Diff groups', () => {});

  // Each IT are lonely
  describe('Local Backup ', () => {
    beforeAll(async function() {});

    afterAll(async function() {});

    beforeEach(async function() {
      await browser.storage.local.set({backupList: {}});
    });

    describe('Low level function -', () => {
      it('Add a backup', async function() {
        const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups);
        const ref_backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList()

        const id = await window.Background.ExtensionStorageManager.Local.addBackup({groups: ref_groups});

        const backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList(),
          backupGroups = await window.Background.ExtensionStorageManager.Local.getBackUp(id);

        const hasId = backupList.hasOwnProperty(id);

        expect(Object.keys(backupList).length - 1).toEqual(Object.keys(ref_backupList).length);
        expect(hasId).toBe(true);
        expect(backupGroups).toEqualGroups(ref_groups);
      });

      it('Remove a backup', async function() {
        const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups);
        const id = await window.Background.ExtensionStorageManager.Local.addBackup({groups: ref_groups});

        await window.Background.ExtensionStorageManager.Local.removeBackup(id);

        const backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList(),
          backupGroups = await window.Background.ExtensionStorageManager.Local.getBackUp(id);

        const hasId = backupList.hasOwnProperty(id);

        expect(Object.keys(backupList).length).toEqual(0);
        expect(hasId).toBe(false);
        expect(backupGroups).toBe(undefined);
      });

      it('Clean all backups', async function() {
        const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups),
          length = 3;

        const ids = [];
        for (let i = 0; i < length; i++) {
          ids.push(await window.Background.ExtensionStorageManager.Local.addBackup({groups: ref_groups}));
          await window.Background.Utils.wait(50);
        }

        const backupListInter = await window.Background.ExtensionStorageManager.Local.getBackUpList();

        expect(Object.keys(backupListInter).length).toEqual(length);

        await window.Background.ExtensionStorageManager.Local.clearBackups();

        const backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList();

        expect(Object.keys(backupList).length).toEqual(0);
      });

      it('respectMaxBackUp', async function() {
        const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups),
          maxSave = 2,
          length = 5;

        const ids = [];
        for (let i = 0; i < length; i++) {
          ids.push(await window.Background.ExtensionStorageManager.Local.addBackup({groups: ref_groups}));
          await window.Background.Utils.wait(50);
        }

        expect(Object.keys(await window.Background.ExtensionStorageManager.Local.getBackUpList()).length).toEqual(length);

        await window.Background.ExtensionStorageManager.Local.respectMaxBackUp({maxSave});

        expect(Object.keys((await window.Background.ExtensionStorageManager.Local.getBackUpList())).length).toEqual(maxSave);

        await Promise.all(ids.map(async(id, index) => {
          if (index - maxSave > 0)
            return;

          expect((await window.Background.ExtensionStorageManager.Local.getBackUp(id))).toBe(undefined);
        }));
      })

      it('Update intervalTime option do not accept wrong values', () => {
        const local = window.Background.OptionManager.options.backup.local;
        TestManager.changeSomeOptions({"backup-local-intervalTime": 52})

        expect(local.intervalTime).toEqual(52);

        //  NaN - aaa - 0
        window.Background.OptionManager.updateOption("backup-local-intervalTime", "abc");

        expect(local.intervalTime).toEqual(52);

        window.Background.OptionManager.updateOption("backup-local-intervalTime", "NaN");

        expect(local.intervalTime).toEqual(52);

        // Min value trigger
        window.Background.OptionManager.updateOption("backup-local-intervalTime", 0);

        expect(local.intervalTime).toEqual(0.01);
        window.Background.OptionManager.updateOption("backup-local-intervalTime", -10);

        expect(local.intervalTime).toEqual(0.01);

        // Accept 10
        window.Background.OptionManager.updateOption("backup-local-intervalTime", 10);

        expect(local.intervalTime).toEqual(10);

        window.Background.OptionManager.updateOption("backup-local-intervalTime", 11.2);

        expect(local.intervalTime).toEqual(11.2);

        window.Background.OptionManager.updateOption("backup-local-intervalTime", "23");

        expect(local.intervalTime).toEqual(23);
      })

      it('Update maxSave option do not accept wrong values', () => {
        const local = window.Background.OptionManager.options.backup.local;
        TestManager.changeSomeOptions({"backup-local-maxSave": 52})

        expect(local.maxSave).toEqual(52);

        //  NaN - aaa - 0
        window.Background.OptionManager.updateOption("backup-local-maxSave", "abc");

        expect(local.maxSave).toEqual(52);

        window.Background.OptionManager.updateOption("backup-local-maxSave", "NaN");

        expect(local.maxSave).toEqual(52);

        // Min value trigger
        window.Background.OptionManager.updateOption("backup-local-maxSave", 0);

        expect(local.maxSave).toEqual(1);
        window.Background.OptionManager.updateOption("backup-local-maxSave", -10);

        expect(local.maxSave).toEqual(1);

        // Accept 10
        window.Background.OptionManager.updateOption("backup-local-maxSave", 10);

        expect(local.maxSave).toEqual(10);

        window.Background.OptionManager.updateOption("backup-local-maxSave", 11.2);

        expect(local.maxSave).toEqual(11);

        window.Background.OptionManager.updateOption("backup-local-maxSave", 11.7);

        expect(local.maxSave).toEqual(11);

        window.Background.OptionManager.updateOption("backup-local-maxSave", "23");

        expect(local.maxSave).toEqual(23);
      })
    });

    describe('Automatic ', () => {
      it('Back up (first) and set timeout', async() => {
        const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups);
        window.Background.OptionManager.options.backup.local.enable = true;
        spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.returnValue(true);

        const id = await window.Background.ExtensionStorageManager.Local.planBackUp(ref_groups);

        expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);
        expect(id).not.toBe(undefined);
        expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

        window.Background.ExtensionStorageManager.Local.abortBackUp();
      });

      it('Back up (outdated) and set timeout', async() => {
        const intervalTime = Math.floor(window.Background.OptionManager.options.backup.local.intervalTime * 3600 * 1000);
        await TestManager.swapLocalStorage({
          backupList: {
            "fake-outdated": {
              date: (Date.now() - intervalTime - 1000),
            },
          },
        }, false);

        const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups);

        spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.callThrough();

        const id = await window.Background.ExtensionStorageManager.Local.planBackUp(ref_groups);

        expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);
        expect(id).not.toBe(undefined);
        expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

        window.Background.ExtensionStorageManager.Local.abortBackUp();
      });

      it('Check timeout after backup', async() => {
        try {
          TestManager.installFakeTime();

          const intervalTime = Math.floor(window.Background.OptionManager.options.backup.local.intervalTime * 3600 * 1000);

          spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.callThrough();
          const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups);
          await window.Background.ExtensionStorageManager.Local.planBackUp(ref_groups, intervalTime);

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);
          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);

          jasmine.clock().tick(intervalTime);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(2);
          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);

          jasmine.clock().tick(intervalTime);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(3);
          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);

          window.Background.ExtensionStorageManager.Local.abortBackUp();
        } catch (e) {return} finally {
          TestManager.uninstallFakeTime();
        }
      }, 5000);

      it('Not back up and set timeout (shorter than intervalTime)', async() => {
        try {
          TestManager.installFakeTime();
          const diff = 1000;
          window.Background.OptionManager.options.backup.local.intervalTime = 1000;
          const intervalTime = Math.floor(window.Background.OptionManager.options.backup.local.intervalTime * 3600 * 1000);
          await TestManager.swapLocalStorage({
            backupList: {
              "fake-shorter": {
                date: (Date.now() - intervalTime + diff),
              },
            },
          }, false);

          const ref_groups = window.Background.Utils.getCopy(window.Background.GroupManager.groups);

          spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.callThrough();

          await window.Background.ExtensionStorageManager.Local.planBackUp(ref_groups);

          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);
          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(0);

          jasmine.clock().tick(diff);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);
          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);

          jasmine.clock().tick(diff);

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);
          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);

          jasmine.clock().tick(intervalTime - diff);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(2);
          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);

          window.Background.ExtensionStorageManager.Local.abortBackUp();
        } catch (e) {return} finally {
          TestManager.uninstallFakeTime();
        }

      }, 5000);

      it('Change option to stop backup', async() => {
        try {
          TestManager.installFakeTime();
          let test = 0;

          window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT = setTimeout(() => {
            test = 100;
          }, 10000);

          await TestManager.changeSomeOptions({"backup-local-enable": false});

          jasmine.clock().tick(10000);

          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).toBe(undefined);
          expect(test).toEqual(0);
        } catch (e) {return} finally {
          TestManager.uninstallFakeTime();
        }
      });

      it('Change option to start backup', async() => {
        try {
          window.Background.ExtensionStorageManager.Local.abortBackUp();
          TestManager.installFakeTime();

          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).toBe(undefined);
          spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.callThrough();

          window.Background.OptionManager.options.backup.local.intervalTime = 10000;

          await TestManager.changeSomeOptions({"backup-local-enable": true});

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

          jasmine.clock().tick(10000 * 3600 * 1000);

          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);
          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(2);
          window.Background.ExtensionStorageManager.Local.abortBackUp();
        } catch (e) {return} finally {
          TestManager.uninstallFakeTime();
        }
      }, 5000);

      it('Change option update to longer backup', async() => {
        try {
          const INTER = 10, // Even
            INTER_MS = INTER * 1000 * 3600;
          window.Background.ExtensionStorageManager.Local.abortBackUp();
          TestManager.installFakeTime();

          spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.callThrough();

          window.Background.OptionManager.options.backup.local.enable = false;
          window.Background.OptionManager.options.backup.local.intervalTime = INTER;

          await TestManager.changeSomeOptions({"backup-local-enable": true});

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

          await TestManager.changeSomeOptions({
            "backup-local-intervalTime": INTER * 2,
          });

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

          jasmine.clock().tick(INTER_MS * 2);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(2);

          jasmine.clock().tick(INTER_MS * 2);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(3);
          window.Background.ExtensionStorageManager.Local.abortBackUp();
        } catch (e) {return} finally {
          TestManager.uninstallFakeTime();
        }
      }, 5000);

      it('Change option update to shorter backup and should be done now', async() => {
        try {
          const INTER = 10, // Even
            INTER_MS = INTER * 1000 * 3600;
          window.Background.ExtensionStorageManager.Local.abortBackUp();
          TestManager.installFakeTime();

          spyOn(window.Background.ExtensionStorageManager.Local, 'addBackup').and.callThrough();

          window.Background.OptionManager.options.backup.local.intervalTime = INTER;

          await TestManager.changeSomeOptions({"backup-local-enable": true});

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

          await TestManager.changeSomeOptions({
            "backup-local-intervalTime": INTER / 2,
          });

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(1);

          jasmine.clock().tick(INTER_MS / 2);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT).not.toBe(undefined);
          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(2);

          jasmine.clock().tick(INTER_MS / 2);
          await window.Background.ExtensionStorageManager.Local.BACKUP_TIMEOUT_PROMISE;

          expect(window.Background.ExtensionStorageManager.Local.addBackup).toHaveBeenCalledTimes(3);
        } catch (e) {return} finally {
          TestManager.uninstallFakeTime();
        }
      });
    });

    describe('Max Save ', () => {

      it('Clears on Add Backup', async() => {
        window.Background.OptionManager.options.backup.local.maxSave = 2;
        await TestManager.swapLocalStorage({
          backupList: {
            "fake-shorter": {
              date: 10,
            },
            "kept-1": {
              date: 20,
            },
          },
        }, false);

        await window.Background.ExtensionStorageManager.Local.addBackup({
          groups: [],
          time: 30,
        });

        const backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList();

        expect(Object.keys(backupList).length).toEqual(2);
        expect(Object.values(backupList).filter(({date}) => date>10).length).toEqual(2);
      });

      it('Clears on Change option to smaller', async() => {
        const maxSave = 1;
        await TestManager.swapLocalStorage({
          backupList: {
            "fake-shorter": {
              date: 10,
            },
            "kept-1": {
              date: 20,
            },
          },
        }, false);

        await TestManager.changeSomeOptions({
          "backup-local-maxSave": maxSave,
        });

        const backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList();

        expect(Object.keys(backupList).length).toEqual(maxSave);
        expect(Object.values(backupList).filter(({date}) => date>10).length).toEqual(maxSave);
      });

      it('Clears on Change option to bigger', async() => {
        const maxSave = 3;
        await TestManager.swapLocalStorage({
          backupList: {
            "fake-shorter": {
              date: 10,
            },
            "kept-1": {
              date: 20,
            },
          },
        }, false);

        await TestManager.changeSomeOptions({
          "backup-local-maxSave": maxSave,
        });

        const backupList = await window.Background.ExtensionStorageManager.Local.getBackUpList();

        expect(Object.keys(backupList).length).toEqual(2);
        expect(Object.values(backupList).filter(({date}) => date>10).length).toEqual(1);
      });
    })
  });

})
