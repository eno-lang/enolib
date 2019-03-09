const { parse } = require('../..');

const input = `
languages:
> error-lang.org
eno = error notation
> json.org
json = json object notation

copy < languages
> eno-lang.org
eno = eno notation
> yaml.org
yaml = yaml ain't markup language
`.trim();

describe('Resolution', () => {
  describe('Copying fieldset with comments', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
