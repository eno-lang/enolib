import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying existing required string values from a field with items', () => {
    it('produces the expected result', () => {
        const input = `field:\n` +
                      `- item\n` +
                      `- item`;
        
        const output = parse(input).field('field').requiredStringValues();
        
        expect(output).toEqual(['item', 'item']);
    });
});

describe('Querying existing optional string values from a field with items', () => {
    it('produces the expected result', () => {
        const input = `field:\n` +
                      `- item\n` +
                      `- item`;
        
        const output = parse(input).field('field').optionalStringValues();
        
        expect(output).toEqual(['item', 'item']);
    });
});

describe('Querying missing optional string values from a field with items', () => {
    it('produces the expected result', () => {
        const input = `field:\n` +
                      `-\n` +
                      `-`;
        
        const output = parse(input).field('field').optionalStringValues();
        
        expect(output).toEqual([null, null]);
    });
});