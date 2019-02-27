const eno = require('../../../..');

describe('Querying an existing, single-line, required string comment from an empty element', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `element:`;

    const output = eno.parse(input).element('element').requiredStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, two-line, required string comment from an empty element', () => {
  it('produces the expected result', () => {
    const input = `>comment\n` +
                  `>  comment\n` +
                  `element:`;

    const output = eno.parse(input).element('element').requiredStringComment();

    const expected = `comment\n` +
                     `  comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an existing, required string comment with blank lines from an empty element', () => {
  it('produces the expected result', () => {
    const input = `>\n` +
                  `>     comment\n` +
                  `>\n` +
                  `>   comment\n` +
                  `>\n` +
                  `> comment\n` +
                  `>\n` +
                  `element:`;

    const output = eno.parse(input).element('element').requiredStringComment();

    const expected = `    comment\n` +
                     `\n` +
                     `  comment\n` +
                     `\n` +
                     `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, existing string comment from an empty element', () => {
  it('produces the expected result', () => {
    const input = `> comment\n` +
                  `element:`;

    const output = eno.parse(input).element('element').optionalStringComment();

    const expected = `comment`;
    
    expect(output).toEqual(expected);
  });
});

describe('Querying an optional, missing string comment from an empty element', () => {
  it('produces the expected result', () => {
    const input = `element:`;

    const output = eno.parse(input).element('element').optionalStringComment();

    expect(output).toBeNull();
  });
});