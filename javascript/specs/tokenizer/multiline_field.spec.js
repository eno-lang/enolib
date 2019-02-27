const { inspectTokenization } = require('./util.js');

const input = `
-- key
value
-- key

--    key

value

    -- key

    --    key
value

    value
        -- key
`.trim();

describe('Multiline field tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
