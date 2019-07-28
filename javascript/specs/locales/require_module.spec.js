const enolib = require('../..');

// .js omitted here to reflect convention for vendor library includes
// (perspective for outside users: "const { en } = require('enolib/locales');")
const locales = require('../../locales');

describe('Requiring through public convenience module', () => {
  for(const [locale, messages] of Object.entries(locales)) {
    describe(locale, () => {
      it('provides a working locale', () => {
        expect(() => enolib.parse(':invalid', { locale: messages })).toThrowErrorMatchingSnapshot();
      });
    });
  }
});
