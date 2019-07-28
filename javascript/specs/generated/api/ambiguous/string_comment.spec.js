const enolib = require('../../../..');

describe('Querying an existing, single-line, required string comment from an ambiguous element', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `ambiguous:`;

    const output = enolib.parse(input).element('ambiguous').requiredStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, two-line, required string comment from an ambiguous element', () => {
  it('produces the expected result', () => {
    const input = `>comment\n` +
                  `>  comment\n` +
                  `ambiguous:`;

    const output = enolib.parse(input).element('ambiguous').requiredStringComment();

    const expected = `comment\n` +
                     `  comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, required string comment with blank lines from an ambiguous element', () => {
  it('produces the expected result', () => {
    const input = `>\n` +
                  `>     comment\n` +
                  `>\n` +
                  `>   comment\n` +
                  `>\n` +
                  `> comment\n` +
                  `>\n` +
                  `ambiguous:`;

    const output = enolib.parse(input).element('ambiguous').requiredStringComment();

    const expected = `    comment\n` +
                     `\n` +
                     `  comment\n` +
                     `\n` +
                     `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, existing string comment from an ambiguous element', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `ambiguous:`;

    const output = enolib.parse(input).element('ambiguous').optionalStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, missing string comment from an ambiguous element', () => {
  it('produces the expected result', () => {
    const input = `ambiguous:`;

    const output = enolib.parse(input).element('ambiguous').optionalStringComment();

    expect(output).toBeNull();
  });
});