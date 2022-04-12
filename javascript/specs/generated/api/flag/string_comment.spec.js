import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying an existing, single-line, required string comment from a flag', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `flag`;
        
        const output = parse(input).flag('flag').requiredStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, two-line, required string comment from a flag', () => {
    it('produces the expected result', () => {
        const input = `>comment\n` +
                      `>  comment\n` +
                      `flag`;
        
        const output = parse(input).flag('flag').requiredStringComment();
        
        const expected = `comment\n` +
                         `  comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, required string comment with blank lines from a flag', () => {
    it('produces the expected result', () => {
        const input = `>\n` +
                      `>     comment\n` +
                      `>\n` +
                      `>   comment\n` +
                      `>\n` +
                      `> comment\n` +
                      `>\n` +
                      `flag`;
        
        const output = parse(input).flag('flag').requiredStringComment();
        
        const expected = `    comment\n` +
                         `\n` +
                         `  comment\n` +
                         `\n` +
                         `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, existing string comment from a flag', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `flag`;
        
        const output = parse(input).flag('flag').optionalStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, missing string comment from a flag', () => {
    it('produces the expected result', () => {
        const input = `flag`;
        
        const output = parse(input).flag('flag').optionalStringComment();
        
        expect(output).toBeNull();
    });
});