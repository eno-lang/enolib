const locales = ['de', 'en', 'es'];

describe('Message locales', () => {
  for(const locale of locales) {
    describe(locale, () => {
      const messages = require(`../lib/messages/${locale}.js`)[locale];

      for(const [message, translation] of Object.entries(messages)) {
        describe(message, () => {
          it('contains a static string translation or a message generator function', () => {
            if(typeof translation === 'function') {
              const generatedMessage = translation();
              expect(typeof generatedMessage).toEqual('string');
            } else {
              expect(typeof translation).toEqual('string');
            }
          });
        });
      }
    });
  }
});
