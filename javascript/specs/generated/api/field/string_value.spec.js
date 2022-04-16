import { parse, ParseError, ValidationError } from '../../../..';

describe('Querying an existing required string value from a field', () => {
    it('produces the expected result', () => {
        const input = `field: value`;
        
        const output = parse(input).field('field').requiredStringValue();
        
        const expected = `value`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing optional string value from a field', () => {
    it('produces the expected result', () => {
        const input = `field: value`;
        
        const output = parse(input).field('field').optionalStringValue();
        
        const expected = `value`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying a missing optional string value from a field', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const output = parse(input).field('field').optionalStringValue();
        
        expect(output).toBeNull();
    });
});