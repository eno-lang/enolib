const enolib = require('../..');

const input = `
> Comment

-- Multiline Field
Veni
Vidi
Vici
-- Multiline Field

Copied Multiline Field < Multiline Field
`.trim();

describe('Copying a multiline field', () => {
  test('succeeds', () => {
    const document = enolib.parse(input);
    expect(document.raw()).toMatchSnapshot();
  });
});
