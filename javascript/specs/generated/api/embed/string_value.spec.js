import { parse, ParseError, ValidationError } from '../../../..';

describe('Querying an existing required string value from an embed', () => {
    it('produces the expected result', () => {
        const input = `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').requiredStringValue();
        
        const expected = `value`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying an existing optional string value from an embed', () => {
    it('produces the expected result', () => {
        const input = `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').optionalStringValue();
        
        const expected = `value`;
        
        expect(output).toEqual(expected);
    });
});

describe('Querying a missing optional string value from an embed', () => {
    it('produces the expected result', () => {
        const input = `-- embed\n` +
                      `-- embed`;
        
        const output = parse(input).embed('embed').optionalStringValue();
        
        expect(output).toBeNull();
    });
});