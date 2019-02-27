const { inspectTokenization } = require('./util.js');

const input = `
list:

- value

-    value

    - value

    -    value

- value
`.trim();

describe('List item tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
