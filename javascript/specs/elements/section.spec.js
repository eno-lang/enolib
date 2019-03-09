const eno = require('../..');

describe('Section', () => {
  let section;

  beforeEach(() => {
    section = eno.parse('');
  });

  describe('elements()', () => {
    let result;

    beforeEach(() => {
      result = section.elements();
    });

    it('touches the section', () => {
      expect(section._instruction.touched).toBe(true);
    });

    it('returns the elements of the section', () => {
      expect(result).toEqual([]);
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(section.toString()).toEqual('[object Section document elements=0]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(section)).toEqual('[object Section]');
    });
  });
});
