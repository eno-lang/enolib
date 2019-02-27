const eno = require('../../../..');

describe('Querying existing required string values from a list', () => {
  it('produces the expected result', () => {
    const input = `list:\n` +
                  `- item\n` +
                  `- item`;

    const output = eno.parse(input).list('list').requiredStringValues();

    expect(output).toEqual(['item', 'item']);
  });
});

describe('Querying existing optional string values from a list', () => {
  it('produces the expected result', () => {
    const input = `list:\n` +
                  `- item\n` +
                  `- item`;

    const output = eno.parse(input).list('list').optionalStringValues();

    expect(output).toEqual(['item', 'item']);
  });
});

describe('Querying missing optional string values from a list', () => {
  it('produces the expected result', () => {
    const input = `list:\n` +
                  `-\n` +
                  `-`;

    const output = eno.parse(input).list('list').optionalStringValues();

    expect(output).toEqual([null, null]);
  });
});