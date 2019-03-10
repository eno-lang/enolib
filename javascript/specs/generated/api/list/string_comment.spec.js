const enolib = require('../../../..');

describe('Querying an existing, single-line, required string comment from a list', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `list:\n` +
                  `- item`;

    const output = enolib.parse(input).list('list').requiredStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, two-line, required string comment from a list', () => {
  it('produces the expected result', () => {
    const input = `>comment\n` +
                  `>  comment\n` +
                  `list:\n` +
                  `- item`;

    const output = enolib.parse(input).list('list').requiredStringComment();

    const expected = `comment\n` +
                     `  comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, required string comment with blank lines from a list', () => {
  it('produces the expected result', () => {
    const input = `>\n` +
                  `>     comment\n` +
                  `>\n` +
                  `>   comment\n` +
                  `>\n` +
                  `> comment\n` +
                  `>\n` +
                  `list:\n` +
                  `- item`;

    const output = enolib.parse(input).list('list').requiredStringComment();

    const expected = `    comment\n` +
                     `\n` +
                     `  comment\n` +
                     `\n` +
                     `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, existing string comment from a list', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `list:\n` +
                  `- item`;

    const output = enolib.parse(input).list('list').optionalStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, missing string comment from a list', () => {
  it('produces the expected result', () => {
    const input = `list:\n` +
                  `- item`;

    const output = enolib.parse(input).list('list').optionalStringComment();

    expect(output).toBeNull();
  });
});