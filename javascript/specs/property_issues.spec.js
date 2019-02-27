const eno = require('..');

describe('Property issues', () => {
  describe('Section', () => {
    describe('toString as field key', () => {
      it('does not have any side effects', () => {
        const document = eno.parse('toString: ok');

        expect(document.raw()).toEqual([{ toString: 'ok' }]);
      });
    });

    describe('toString as fieldset key', () => {
      it('does not have any side effects', () => {
        const document = eno.parse(`
          toString:
          check = ok
        `);

        expect(document.raw()).toEqual([{ toString: [{ check: 'ok' }] }]);
      });
    });

    describe('toString as fieldset entry', () => {
      it('does not have any side effects', () => {
        const document = eno.parse(`
          check:
          toString = ok
        `);

        expect(document.raw()).toEqual([{ check: [{ toString: 'ok' }] }]);
      });
    });

    describe('toString as missing template', () => {
      it('does not have any side effects', () => {
        expect(() => eno.parse('check < toString')).toThrowErrorMatchingSnapshot();
      });
    });

    describe('toString as key in a complex merge', () => {
      it('does not have any side effects', () => {
        const document = eno.parse(`
          # a
          ## toString
          toString:
          toString = discarded

          # b < a
          ## toString
          toString: ok

          # c << a
          ## toString
          toString:
          toString = kept
        `);

        expect(document.raw()).toMatchSnapshot();
      });
    });

    describe('fetching from a missing toString field', () => {
      it('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.field('toString').optionalStringValue()).toBe(null);
      });
    });

    describe("fetching a missing fieldset with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.optionalFieldset('toString')).toBe(null);
      });
    });

    describe("fetching a missing list with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.list('toString').optionalStringValues()).toEqual([]);
      });
    });

    describe("fetching a missing section with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.optionalSection('toString')).toBe(null);
      });
    });

    describe("fetching missing sections with the key 'toString'", () => {
      it('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.sections('toString')).toEqual([]);
      });
    });

    describe('asserting toString has been touched', () => {
      it('does not have any side effects', () => {
        const document = eno.parse('');

        expect(() => document.assertAllTouched({ only: 'toString' })).not.toThrow();
      });
    });

  });

  describe('Fieldset', () => {

    describe('asserting toString has been touched', () => {
      it('does not have any side effects', () => {
        const document = eno.parse(`
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
        const document = eno.parse(`
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
