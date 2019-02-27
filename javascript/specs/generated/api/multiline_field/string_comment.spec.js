const eno = require('../../../..');

describe('Querying an existing, single-line, required string comment from a field', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').requiredStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, two-line, required string comment from a field', () => {
  it('produces the expected result', () => {
    const input = `>comment\n` +
                  `>  comment\n` +
                  `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').requiredStringComment();

    const expected = `comment\n` +
                     `  comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, required string comment with blank lines from a field', () => {
  it('produces the expected result', () => {
    const input = `>\n` +
                  `>     comment\n` +
                  `>\n` +
                  `>   comment\n` +
                  `>\n` +
                  `> comment\n` +
                  `>\n` +
                  `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').requiredStringComment();

    const expected = `    comment\n` +
                     `\n` +
                     `  comment\n` +
                     `\n` +
                     `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, existing string comment from a field', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').optionalStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, missing string comment from a field', () => {
  it('produces the expected result', () => {
    const input = `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const output = eno.parse(input).field('multiline_field').optionalStringComment();

    expect(output).toBeNull();
  });
});