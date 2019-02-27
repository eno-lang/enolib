const eno = require('../../../..');

describe('Querying an existing required string value from a multline field', () => {
  it('produces the expected result', () => {
    const input = `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').requiredStringValue();

    const expected = `value`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing optional string value from a multline field', () => {
  it('produces the expected result', () => {
    const input = `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').optionalStringValue();

    const expected = `value`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying a missing optional string value from a multline field', () => {
  it('produces the expected result', () => {
    const input = `-- multiline_field\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').optionalStringValue();

    expect(output).toBeNull();
  });
});