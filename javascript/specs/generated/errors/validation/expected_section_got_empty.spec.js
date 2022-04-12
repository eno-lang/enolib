import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Expecting a section but getting an ambiguous element', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:`;
        
        try {
            parse(input).section('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A section with the key 'element' was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(8);
    });
});