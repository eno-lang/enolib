const { inspectTokenization } = require('./util.js');

const input = `
field:

\\ value

\\    value

    \\ value

    \\    value

\\ value
`.trim();

describe('Spaced line continutation tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
