import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying a section for a required but missing element', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `# section`;
        
        try {
            parse(input).section('section').requiredElement('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The element 'element' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | # section`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(9);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(9);
    });
});