/**
 * You should create Error with bg.Error in order to pass `instanceof Error` in background window.
 */
import TestManager from '../../utils/TestManager'
import Background from '../../utils/Background'
const {
  LogManager,
  Error,
} = Background

describe("Logmanager", () => {
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  describe(".error", () => {
    it("should report error passed in argument", () => {
      const logs = [];
      const msg = 'Coucou';
      LogManager.error(Error(msg), null, {
        logs,
        print: false,
        showNotification: false,
        enable: true,
      })

      expect(logs[0].type).toBe('Error')
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe(msg);
    })

    it("should report an error from a string passed in argument", () => {
      const logs = [];
      const msg = 'Coucou';
      LogManager.error(msg, null, {
        logs,
        print: false,
        showNotification: false,
        enable: true,
      })

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
      LogManager.error(Error(msg), data, {
        logs,
        print: false,
        showNotification: false,
        enable: true,
      })

      expect(logs.length).toBe(1);
      expect(logs[0].data).toEqual(data);
    })

  })

  describe(".getStack", () => {

    it("should split stack", () => {
      const stack = LogManager.getStack(Error().stack)

      expect(Array.isArray(stack)).toBe(true);
      expect(stack.length).toBeGreaterThan(3);
    })

  })
})