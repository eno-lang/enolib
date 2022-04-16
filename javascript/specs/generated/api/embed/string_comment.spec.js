import { parse, ParseError, ValidationError } from '../../../..';

describe('Querying an existing, single-line, required string comment from an embed', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').requiredStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, two-line, required string comment from an embed', () => {
    it('produces the expected result', () => {
        const input = `>comment\n` +
                      `>  comment\n` +
                      `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').requiredStringComment();
        
        const expected = `comment\n` +
                         `  comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, required string comment with blank lines from an embed', () => {
    it('produces the expected result', () => {
        const input = `>\n` +
                      `>     comment\n` +
                      `>\n` +
                      `>   comment\n` +
                      `>\n` +
                      `> comment\n` +
                      `>\n` +
                      `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').requiredStringComment();
        
        const expected = `    comment\n` +
                         `\n` +
                         `  comment\n` +
                         `\n` +
                         `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, existing string comment from an embed', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').optionalStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, missing string comment from an embed', () => {
    it('produces the expected result', () => {
        const input = `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').optionalStringComment();
        
        expect(output).toBeNull();
    });
});