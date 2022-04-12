import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying all attributes from a field', () => {
    it('produces the expected result', () => {
        const input = `field:\n` +
                      `1 = 1\n` +
                      `2 = 2`;
        
        const output = parse(input).field('field').attributes().map(entry => entry.requiredStringValue());
        
        expect(output).toEqual(['1', '2']);
    });
});

describe('Querying attributes from a field by key', () => {
    it('produces the expected result', () => {
        const input = `field:\n` +
                      `entry = value\n` +
                      `other = one\n` +
                      `other = two`;
        
        const output = parse(input).field('field').attributes('other').map(entry => entry.requiredStringValue());
        
        expect(output).toEqual(['one', 'two']);
    });
});