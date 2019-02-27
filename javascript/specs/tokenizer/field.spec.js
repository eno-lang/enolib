const { inspectTokenization } = require('./util.js');

const input = `
key: value

key:    value

key    : value

    key    :    value

key: value
`.trim();

describe('Field tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
