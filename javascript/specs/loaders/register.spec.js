const enolib = require('../..');

const input = `
> comment
field: value

> comment
fieldset:
entry = value

> comment
list:
- value

> comment
# section
`.trim();

describe('register', () => {
  let document, field, fieldset, list, section;
  let missingField, missingFieldset, missingList, missingSection;

  beforeAll(() => {
    enolib.register({ custom: value => `custom ${value}` });

    document = enolib.parse(input);

    field = document.field('field');
    fieldset = document.fieldset('fieldset');
    list = document.list('list');
    section = document.section('section');

    missingField = document.field('missing');
    missingFieldset = document.fieldset('missing');
    missingList = document.list('missing');
    missingSection = document.section('missing');
  });

  describe('on Field', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(field.optionalCustomComment()).toEqual('custom comment');
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(field.requiredCustomComment()).toEqual('custom comment');
    });

    it('registers a customKey accessor', () => {
      expect(field.customKey()).toEqual('custom field');
    });

    it('registers an optionalCustomValue accessor', () => {
      expect(field.optionalCustomValue()).toEqual('custom value');
    });

    it('registers a requiredCustomValue accessor', () => {
      expect(field.requiredCustomValue()).toEqual('custom value');
    });
  });

  describe('on Fieldset', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(fieldset.optionalCustomComment()).toEqual('custom comment');
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(fieldset.requiredCustomComment()).toEqual('custom comment');
    });

    it('registers a customKey accessor', () => {
      expect(fieldset.customKey()).toEqual('custom fieldset');
    });
  });

  describe('on List', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(list.optionalCustomComment()).toEqual('custom comment');
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(list.requiredCustomComment()).toEqual('custom comment');
    });

    it('registers a customKey accessor', () => {
      expect(list.customKey()).toEqual('custom list');
    });

    it('registers an optionalCustomValues accessor', () => {
      expect(list.optionalCustomValues()).toEqual(['custom value']);
    });

    it('registers a requiredCustomValues accessor', () => {
      expect(list.requiredCustomValues()).toEqual(['custom value']);
    });
  });

  describe('on Section', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(section.optionalCustomComment()).toEqual('custom comment');
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(section.requiredCustomComment()).toEqual('custom comment');
    });

    it('registers a customKey accessor', () => {
      expect(section.customKey()).toEqual('custom section');
    });
  });

  describe('on MissingField', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(missingField.optionalCustomComment()).toEqual(null);
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(() => missingField.requiredCustomComment()).toThrowErrorMatchingSnapshot();
    });

    it('registers a customKey accessor', () => {
      expect(() => missingField.customKey()).toThrowErrorMatchingSnapshot();
    });

    it('registers an optionalCustomValue accessor', () => {
      expect(missingField.optionalCustomValue()).toEqual(null);
    });

    it('registers a requiredCustomValue accessor', () => {
      expect(() => missingField.requiredCustomValue()).toThrow();
    });
  });

  describe('on MissingFieldset', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(missingFieldset.optionalCustomComment()).toEqual(null);
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(() => missingFieldset.requiredCustomComment()).toThrowErrorMatchingSnapshot();
    });

    it('registers a customKey accessor', () => {
      expect(() => missingFieldset.customKey()).toThrowErrorMatchingSnapshot();
    });
  });

  describe('on MissingList', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(missingList.optionalCustomComment()).toEqual(null);
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(() => missingList.requiredCustomComment()).toThrowErrorMatchingSnapshot();
    });

    it('registers a customKey accessor', () => {
      expect(() => missingList.customKey()).toThrowErrorMatchingSnapshot();
    });

    it('registers an optionalCustomValues accessor', () => {
      expect(missingList.optionalCustomValues()).toEqual([]);
    });

    it('registers a requiredCustomValues accessor', () => {
      expect(missingList.requiredCustomValues()).toEqual([]);
    });
  });

  describe('on MissingSection', () => {
    it('registers an optionalCustomComment accessor', () => {
      expect(missingSection.optionalCustomComment()).toEqual(null);
    });

    it('registers a requiredCustomComment accessor', () => {
      expect(() => missingSection.requiredCustomComment()).toThrowErrorMatchingSnapshot();
    });

    it('registers a customKey accessor', () => {
      expect(() => missingSection.customKey()).toThrowErrorMatchingSnapshot();
    });
  });
});
