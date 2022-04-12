import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying an existing, single-line, required string comment from an empty field', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `field:`;
        
        const output = parse(input).element('field').requiredStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, two-line, required string comment from an empty field', () => {
    it('produces the expected result', () => {
        const input = `>comment\n` +
                      `>  comment\n` +
                      `field:`;
        
        const output = parse(input).element('field').requiredStringComment();
        
        const expected = `comment\n` +
                         `  comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, required string comment with blank lines from an empty field', () => {
    it('produces the expected result', () => {
        const input = `>\n` +
                      `>     comment\n` +
                      `>\n` +
                      `>   comment\n` +
                      `>\n` +
                      `> comment\n` +
                      `>\n` +
                      `field:`;
        
        const output = parse(input).element('field').requiredStringComment();
        
        const expected = `    comment\n` +
                         `\n` +
                         `  comment\n` +
                         `\n` +
                         `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, existing string comment from an empty field', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `field:`;
        
        const output = parse(input).element('field').optionalStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, missing string comment from an empty field', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const output = parse(input).element('field').optionalStringComment();
        
        expect(output).toBeNull();
    });
});