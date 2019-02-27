const { parse } = require('../..');

const input = `
languages:
eno = eno notation
json = json object notation

copy < languages
`.trim();

describe('Resolution', () => {
  describe('Copying fieldset into empty', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
