const { inspectTokenization } = require('./util.js');

const input = `
template:

key < template
key    < template
     key     < template
`.trim();

describe('Copy tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
