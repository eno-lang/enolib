const { inspectTokenization } = require('./util.js');

const input = `
fieldset:

entry = value

entry    = value

    entry = value

    entry    = value

    entry    =    value

entry = value
`.trim();

describe('Fieldset entry tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
