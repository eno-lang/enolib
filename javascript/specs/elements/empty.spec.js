const eno = require('../..');

describe('Empty', () => {
  let empty;

  beforeEach(() => {
    empty = eno.parse('element:').element('element');
  });

  it('is untouched after initialization', () => {
    expect(empty._touched).toBe(false);
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(empty.raw()).toEqual({ element: null });
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(empty.toString()).toEqual('[object Empty key=element]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(empty)).toEqual('[object Empty]');
    });
  });
});
