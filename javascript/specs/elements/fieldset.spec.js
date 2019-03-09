const eno = require('../..');
const { Field } = require('../../lib/elements/field.js');
const { MissingFieldsetEntry } = require('../../lib/elements/missing_fieldset_entry.js');

describe('Fieldset', () => {
  let fieldset;

  beforeEach(() => {
    fieldset =  eno.parse(`
fieldset:
entry = value
other = value
`.trim()).fieldset('fieldset');
  });

  it('is untouched after initialization', () => {
    expect(fieldset._instruction.touched).toBeUndefined();
  });

  it('has only untouched entries after initialization', () => {
    for(let entry of fieldset.entries()) {
      expect(entry._instruction.touched).toBeUndefined();
    }
  });

  it('has allEntriesRequired disabled by default', () => {
    expect(fieldset._allEntriesRequired).toBe(false);
  });

  describe('entry()', () => {
    describe('fetching an existing element', () => {
      let field;

      beforeEach(() => {
        field = fieldset.entry('entry');
      });

      it('returns a Field', () => {
        expect(field).toBeInstanceOf(Field);
      });

      it('returns the right field', () => {
        expect(field.stringKey()).toEqual('entry');
      });
    });

    describe('fetching a missing element', () => {
      it('returns a MissingFieldsetEntry', () => {
        const missingEntry = fieldset.entry('missing');
        expect(missingEntry).toBeInstanceOf(MissingFieldsetEntry);
      });
    });
  });

  describe('allEntriesRequired()', () => {
    it('sets the _allEntriesRequired property to true', () => {
      fieldset.allEntriesRequired();
      expect(fieldset._allEntriesRequired).toBe(true);
    });

    describe('passing true explicitly', () => {
      it('sets the _allEntriesRequired property to true', () => {
        fieldset.allEntriesRequired(true);
        expect(fieldset._allEntriesRequired).toBe(true);
      });
    });

    describe('passing false explicitly', () => {
      it('sets the _allEntriesRequired property back to false', () => {
        fieldset.allEntriesRequired(true);
        fieldset.allEntriesRequired(false);
        expect(fieldset._allEntriesRequired).toBe(false);
      });
    });
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(fieldset.raw()).toMatchSnapshot();
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(fieldset.toString()).toEqual('[object Fieldset key=fieldset entries=2]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(fieldset)).toEqual('[object Fieldset]');
    });
  });

  describe('touch()', () => {
    beforeEach(() => {
      fieldset.touch();
    });

    it('touches the fieldset', () => {
      expect(fieldset._instruction.touched).toBe(true);
    });

    it('touches the entries', () => {
      for(const entry of fieldset.entries()) {
        expect(entry._instruction.touched).toBe(true);
      }
    });
  });
});
