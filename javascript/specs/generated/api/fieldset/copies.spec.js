const enolib = require('../../../..');

describe('Querying four entries from a fieldset, all of them copied from another fieldset', () => {
  it('produces the expected result', () => {
    const input = `fieldset:\n` +
                  `1 = 1\n` +
                  `2 = 2\n` +
                  `3 = 3\n` +
                  `4 = 4\n` +
                  `\n` +
                  `copy < fieldset`;

    const output = enolib.parse(input).fieldset('copy').entries().map(entry => entry.requiredStringValue());

    expect(output).toEqual(['1', '2', '3', '4']);
  });
});

describe('Querying four entries from a fieldset, two of them copied from another fieldset', () => {
  it('produces the expected result', () => {
    const input = `fieldset:\n` +
                  `1 = 1\n` +
                  `2 = 2\n` +
                  `\n` +
                  `copy < fieldset\n` +
                  `3 = 3\n` +
                  `4 = 4`;

    const output = enolib.parse(input).fieldset('copy').entries().map(entry => entry.requiredStringValue());

    expect(output).toEqual(['1', '2', '3', '4']);
  });
});

describe('Querying three entries from a fieldset, one owned, one replaced, one copied', () => {
  it('produces the expected result', () => {
    const input = `fieldset:\n` +
                  `1 = 1\n` +
                  `2 = 0\n` +
                  `\n` +
                  `copy < fieldset\n` +
                  `2 = 2\n` +
                  `3 = 3`;

    const output = enolib.parse(input).fieldset('copy').entries().map(entry => entry.requiredStringValue());

    expect(output).toEqual(['1', '2', '3']);
  });
});