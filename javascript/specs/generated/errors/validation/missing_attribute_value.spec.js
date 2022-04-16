import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying an attribute for a required but missing value', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `attribute =`;
        
        try {
            parse(input).field('field').attribute('attribute').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The attribute 'attribute' must contain a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        ` >    2 | attribute =`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(11);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(11);
    });
});