import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying a section for a required but missing comment', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `# section`;
        
        try {
            parse(input).section('section').requiredStringComment();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A required comment for this element is missing.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | # section`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(0);
    });
});