const enolib = require('../..');

describe('register (with invalid arguments)', () => {
  describe("trying to register 'string'", () => {
    it('throws an error', () => {
      expect(() => enolib.register({ string: value => value })).toThrowErrorMatchingSnapshot();
    });
  });
});
