const enolib = require('../..');

describe('Empty', () => {
  let empty;

  beforeEach(() => {
    empty = enolib.parse('element:').empty('element');
  });

  it('is untouched after initialization', () => {
    expect(empty._touched).toBeUndefined();
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(empty.raw()).toEqual({ key: 'element', type: 'emptyElement' });
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
