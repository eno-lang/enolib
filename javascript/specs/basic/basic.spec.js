const enolib = require('../..');

const input = `
> Comment

# Section
## Section
### Section

Key: Value

Key:
- Value
- Value

-- Key
Value
-- Key
`.trim();

describe('A basic testrun', () => {
  test('succeeds', () => {
    const document = enolib.parse(input);

    expect(document.raw()).toMatchSnapshot();
  });
});
