const eno = require('../../../..');

describe('Querying an existing, single-line, required string comment from a fieldset', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `fieldset:\n` +
                  `entry = value`;

    const output = eno.parse(input).fieldset('fieldset').requiredStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, two-line, required string comment from a fieldset', () => {
  it('produces the expected result', () => {
    const input = `>comment\n` +
                  `>  comment\n` +
                  `fieldset:\n` +
                  `entry = value`;

    const output = eno.parse(input).fieldset('fieldset').requiredStringComment();

    const expected = `comment\n` +
                     `  comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, required string comment with blank lines from a fieldset', () => {
  it('produces the expected result', () => {
    const input = `>\n` +
                  `>     comment\n` +
                  `>\n` +
                  `>   comment\n` +
                  `>\n` +
                  `> comment\n` +
                  `>\n` +
                  `fieldset:\n` +
                  `entry = value`;

    const output = eno.parse(input).fieldset('fieldset').requiredStringComment();

    const expected = `    comment\n` +
                     `\n` +
                     `  comment\n` +
                     `\n` +
                     `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, existing string comment from a fieldset', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `fieldset:\n` +
                  `entry = value`;

    const output = eno.parse(input).fieldset('fieldset').optionalStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, missing string comment from a fieldset', () => {
  it('produces the expected result', () => {
    const input = `fieldset:\n` +
                  `entry = value`;

    const output = eno.parse(input).fieldset('fieldset').optionalStringComment();

    expect(output).toBeNull();
  });
});