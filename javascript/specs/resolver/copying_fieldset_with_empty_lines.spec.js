const { parse } = require('../..');

const input = `
languages:

eno = error notation

json = json object notation

copy < languages

yaml = yaml ain't markup language
`.trim();

describe('Resolution', () => {
  describe('Copying fieldset with empty lines', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
