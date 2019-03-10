const enolib = require('../..');
const { Field } = require('../../lib/elements/field.js');
const { Fieldset } = require('../../lib/elements/fieldset.js');
const { List } = require('../../lib/elements/list.js');

describe('Fetching an empty element through fieldset()', () => {
  let fieldset;

  beforeEach(() => {
    fieldset = enolib.parse('fieldset:').fieldset('fieldset');
  });

  it('returns a fieldset', () => {
    expect(fieldset).toBeInstanceOf(Fieldset);
  });

  it('returns a fieldset with allEntriesRequired disabled', () => {
    expect(fieldset._allEntriesRequired).toBe(false);
  });

  describe('when allElementsRequired was enabled on the document', () => {
    beforeEach(() => {
      const document = enolib.parse('fieldset:');

      document.allElementsRequired();

      fieldset = document.fieldset('fieldset');
    });

    it('returns a fieldset with allEntriesRequired enabled', () => {
      expect(fieldset._allEntriesRequired).toBe(true);
    });
  });
});

describe('Fetching an empty element through fieldsets()', () => {
  let fieldsets;

  beforeEach(() => {
    fieldsets = enolib.parse('fieldset:').fieldsets('fieldset');
  });

  it('returns one element', () => {
    expect(fieldsets.length).toBe(1);
  });

  it('returns a fieldset as first element', () => {
    expect(fieldsets[0]).toBeInstanceOf(Fieldset);
  });

  it('returns a fieldset with allEntriesRequired disabled', () => {
    expect(fieldsets[0]._allEntriesRequired).toBe(false);
  });

  describe('when allElementsRequired was enabled on the document', () => {
    beforeEach(() => {
      const document = enolib.parse('fieldset:');

      document.allElementsRequired();

      fieldsets = document.fieldsets('fieldset');
    });

    it('returns a fieldset with allEntriesRequired enabled', () => {
      expect(fieldsets[0]._allEntriesRequired).toBe(true);
    });
  });
});

describe('Fetching an empty element through fields()', () => {
  let fields;

  beforeEach(() => {
    fields = enolib.parse('field:').fields('field');
  });

  it('returns one element', () => {
    expect(fields.length).toBe(1);
  });

  it('returns a field as first element', () => {
    expect(fields[0]).toBeInstanceOf(Field);
  });
});

describe('Fetching an empty element through lists()', () => {
  let lists;

  beforeEach(() => {
    lists = enolib.parse('list:').lists('list');
  });

  it('returns one element', () => {
    expect(lists.length).toBe(1);
  });

  it('returns a list as first element', () => {
    expect(lists[0]).toBeInstanceOf(List);
  });
});
