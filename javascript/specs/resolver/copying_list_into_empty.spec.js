const { parse } = require('../..');

const input = `
languages:
- eno
- json

copy < languages
`.trim();

describe('Resolution', () => {
  describe('Copying list into empty', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
