const enolib = require('..');

describe('Property issues', () => {
  describe('Section', () => {
    describe('toString as field key', () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('toString: ok');

        expect(document.raw()).toMatchSnapshot();
      });
    });

    describe('toString as fieldset key', () => {
      it('does not have any side effects', () => {
        const document = enolib.parse(`
          toString:
          check = ok
        `);

        expect(document.raw()).toMatchSnapshot();
      });
    });

    describe('toString as fieldset entry', () => {
      it('does not have any side effects', () => {
        const document = enolib.parse(`
          check:
          toString = ok
        `);

        expect(document.raw()).toMatchSnapshot();
      });
    });

    describe('fetching from a missing toString field', () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('');

        expect(document.field('toString').optionalStringValue()).toBe(null);
      });
    });

    describe("fetching a missing fieldset with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('');

        expect(document.optionalFieldset('toString')).toBe(null);
      });
    });

    describe("fetching a missing list with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('');

        expect(document.list('toString').optionalStringValues()).toEqual([]);
      });
    });

    describe("fetching a missing section with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('');

        expect(document.optionalSection('toString')).toBe(null);
      });
    });

    describe("fetching missing sections with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('');

        expect(document.sections('toString')).toEqual([]);
      });
    });

    describe('asserting toString has been touched', () => {
      it('does not have any side effects', () => {
        const document = enolib.parse('');

        expect(() => document.assertAllTouched({ only: 'toString' })).not.toThrow();
      });
    });

  });

  describe('Fieldset', () => {

    describe('asserting toString has been touched', () => {
      it('does not have any side effects', () => {
        const document = enolib.parse(`
color ratings:
red = 1
blue = 2
        `.trim());

        const fieldset = document.fieldset('color ratings');

        expect(() => fieldset.assertAllTouched({ only: 'toString' })).not.toThrow();
      });
    });

    describe("fetching a missing fieldset entry with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = enolib.parse(`
color ratings:
red = 1
blue = 2
        `.trim());

        const fieldset = document.fieldset('color ratings');

        expect(fieldset.entry('toString').optionalStringValue()).toBe(null);
      });
    });

  });
});
