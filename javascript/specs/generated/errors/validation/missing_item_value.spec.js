import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Directly querying an item for a required but missing value', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `-`;
        
        try {
            parse(input).field('field').items()[0].requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The field 'field' may not contain empty items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        ` >    2 | -`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(1);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(1);
    });
});

describe('Indirectly querying a field with empty items for required values', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `-`;
        
        try {
            parse(input).field('field').requiredStringValues();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The field 'field' may not contain empty items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        ` >    2 | -`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(1);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(1);
    });
});