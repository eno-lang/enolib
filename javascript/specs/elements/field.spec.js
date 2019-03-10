const enolib = require('../..');

describe('Field', () => {
  let emptyField, emptyItem, field, item, itemWithLongValue;

  beforeEach(() => {
    emptyField = enolib.parse('field:\n|').field('field');
    emptyItem = enolib.parse('list:\n-').list('list').items()[0];
    field = enolib.parse('field: value').field('field');
    item = enolib.parse('list:\n- item').list('list').items()[0];
    itemWithLongValue = enolib.parse('list:\n- long item value is long').list('list').items()[0];
  });

  it('is untouched after initialization', () => {
    expect(field._touched).toBeUndefined();
  });

  describe('raw()', () => {
    describe('with a key and a value', () => {
      it('returns a native representation', () => {
        expect(field.raw()).toEqual({ key: 'field', type: 'field', value: 'value' });
      });
    });

    describe('without key, with value', () => {
      it('returns a native representation', () => {
        expect(item.raw()).toEqual({ type: 'listItem', value: 'item' });
      });
    });
  });

  describe('optionalStringValue()', () => {
    it('returns the value', () => {
      expect(field.optionalStringValue()).toEqual('value');
    });

    it('touches the element', () => {
      const _ = field.optionalStringValue();
      expect(field._touched).toBe(true);
    });

    it('returns null when empty', () => {
      expect(emptyField.optionalStringValue()).toBe(null);
    });
  });

  describe('toString()', () => {
    describe('with a key and a value', () => {
      it('returns a debug abstraction', () => {
        expect(field.toString()).toEqual('[object Field key=field value="value"]');
      });
    });

    describe('with a key and no value', () => {
      it('returns a debug abstraction', () => {
        expect(emptyField.toString()).toEqual('[object Field key=field value=null]');
      });
    });

    describe('without key, with value', () => {
      it('returns a debug abstraction', () => {
        expect(item.toString()).toEqual('[object ListItem value="item"]');
      });
    });

    describe('with no key and value', () => {
      it('returns a debug abstraction', () => {
        expect(emptyItem.toString()).toEqual('[object ListItem value=null]');
      });
    });

    describe('without key, with long value', () => {
      it('returns a debug abstraction with a truncated value', () => {
        expect(itemWithLongValue.toString()).toEqual('[object ListItem value="long item v..."]');
      });
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(field)).toEqual('[object Field]');
    });
  });

  describe('requiredValue(loader)', () => {
    it('applies the loader', () => {
      const result = field.requiredValue(value => value.toUpperCase());
      expect(result).toEqual('VALUE');
    });

    it('touches the element', () => {
      const _ = field.requiredValue(value => value.toUpperCase());
      expect(field._touched).toBe(true);
    });

    describe('when empty', () => {
      it('throws an error', () => {
        expect(() => emptyField.requiredValue(value => value)).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
