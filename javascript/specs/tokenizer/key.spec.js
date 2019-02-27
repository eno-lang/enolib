const { inspectTokenization } = require('./util.js');

const input = `
key:

key:

key    :

    key    :

key:
`.trim();

describe('Key tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
