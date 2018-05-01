describe("Logmanager", () => {
    beforeAll(TestManager.initUnitBeforeAll());
    beforeEach(TestManager.initBeforeEach());

    describe(".error", () => {
        it("should report error passed in argument", () => {
            const logs = [];
            const msg = 'Coucou';
            LogManager.error(Error(msg), null, {logs})

            expect(logs.length).toBe(1);
            expect(logs[0].message).toBe(msg);
        })

        it("should report an error from a string passed in argument", () => {
            const logs = [];
            const msg = 'Coucou';
            LogManager.error(msg, null, {logs})

            expect(logs.length).toBe(1);
            expect(logs[0].message).toBe(msg);
        })

        it("should report additional data passed in argument", () => {
            const logs = [];
            const msg = 'Coucou';
            const data = {
                one: 'one',
                two: 'two',
            }
            LogManager.error(Error(msg), null, {logs})

            expect(logs.length).toBe(1);
            expect(logs[0].data).toBe(data);
        })
        
    })
})