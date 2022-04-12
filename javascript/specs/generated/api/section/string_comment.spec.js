import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying an existing, single-line, required string comment from a section', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `# section`;
        
        const output = parse(input).section('section').requiredStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, two-line, required string comment from a section', () => {
    it('produces the expected result', () => {
        const input = `>comment\n` +
                      `>  comment\n` +
                      `# section`;
        
        const output = parse(input).section('section').requiredStringComment();
        
        const expected = `comment\n` +
                         `  comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing, required string comment with blank lines from a section', () => {
    it('produces the expected result', () => {
        const input = `>\n` +
                      `>     comment\n` +
                      `>\n` +
                      `>   comment\n` +
                      `>\n` +
                      `> comment\n` +
                      `>\n` +
                      `# section`;
        
        const output = parse(input).section('section').requiredStringComment();
        
        const expected = `    comment\n` +
                         `\n` +
                         `  comment\n` +
                         `\n` +
                         `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, existing string comment from a section', () => {
    it('produces the expected result', () => {
        const input = `> comment\n` +
                      `# section`;
        
        const output = parse(input).section('section').optionalStringComment();
        
        const expected = `comment`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an optional, missing string comment from a section', () => {
    it('produces the expected result', () => {
        const input = `# section`;
        
        const output = parse(input).section('section').optionalStringComment();
        
        expect(output).toBeNull();
    });
});