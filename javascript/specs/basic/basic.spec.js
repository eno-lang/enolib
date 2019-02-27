const eno = require('../..');
const fs = require('fs');
const path = require('path');

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
    const document = eno.parse(input);

    expect(document.raw()).toMatchSnapshot();
  });
});
