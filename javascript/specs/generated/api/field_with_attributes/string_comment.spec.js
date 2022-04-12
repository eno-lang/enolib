import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying an existing, single-line, required string comment from a field with attributes', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `field:\n` +
                      `entry = value`;
        
        const output = parse(input).field('field').requiredStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, two-line, required string comment from a field with attributes', () => {
    it('produces the expected result', () => {
        const input = `>comment\n` +
                      `>  comment\n` +
                      `field:\n` +
                      `entry = value`;
        
        const output = enolib.parse(input).field('field').requiredStringComment();
        
        const expected = `comment\n` +
                         `  comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, required string comment with blank lines from a field with attributes', () => {
    it('produces the expected result', () => {
        const input = `>\n` +
                      `>     comment\n` +
                      `>\n` +
                      `>   comment\n` +
                      `>\n` +
                      `> comment\n` +
                      `>\n` +
                      `field:\n` +
                      `entry = value`;
        
        const output = parse(input).field('field').requiredStringComment();
        
        const expected = `    comment\n` +
                         `\n` +
                         `  comment\n` +
                         `\n` +
                         `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, existing string comment from a field with attributes', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `field:\n` +
                      `entry = value`;
        
        const output = parse(input).field('field').optionalStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, missing string comment from a field with attributes', () => {
    it('produces the expected result', () => {
        const input = `field:\n` +
                      `entry = value`;
        
        const output = parse(input).field('field').optionalStringComment();
        
        expect(output).toBeNull();
    });
});