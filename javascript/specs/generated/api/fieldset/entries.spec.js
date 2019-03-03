const eno = require('../../../..');

describe('Querying all entries from a fieldset', () => {
  it('produces the expected result', () => {
    const input = `fieldset:\n` +
                  `1 = 1\n` +
                  `2 = 2`;

    const output = eno.parse(input).fieldset('fieldset').entries().map(entry => entry.requiredStringValue());

    expect(output).toEqual(['1', '2']);
  });
});

describe('Querying entries from a fieldset by key', () => {
  it('produces the expected result', () => {
    const input = `fieldset:\n` +
                  `entry = value\n` +
                  `other = one\n` +
                  `other = two`;

    const output = eno.parse(input).fieldset('fieldset').entries('other').map(entry => entry.requiredStringValue());

    expect(output).toEqual(['one', 'two']);
  });
});