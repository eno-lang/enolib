const enolib = require('../../../..');

describe('Querying an existing, single-line, required string comment from an empty', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `empty`;

    const output = enolib.parse(input).empty('empty').requiredStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, two-line, required string comment from an empty', () => {
  it('produces the expected result', () => {
    const input = `>comment\n` +
                  `>  comment\n` +
                  `empty`;

    const output = enolib.parse(input).empty('empty').requiredStringComment();

    const expected = `comment\n` +
                     `  comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, required string comment with blank lines from an empty', () => {
  it('produces the expected result', () => {
    const input = `>\n` +
                  `>     comment\n` +
                  `>\n` +
                  `>   comment\n` +
                  `>\n` +
                  `> comment\n` +
                  `>\n` +
                  `empty`;

    const output = enolib.parse(input).empty('empty').requiredStringComment();

    const expected = `    comment\n` +
                     `\n` +
                     `  comment\n` +
                     `\n` +
                     `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, existing string comment from an empty', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `empty`;

    const output = enolib.parse(input).empty('empty').optionalStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, missing string comment from an empty', () => {
  it('produces the expected result', () => {
    const input = `empty`;

    const output = enolib.parse(input).empty('empty').optionalStringComment();

    expect(output).toBeNull();
  });
});