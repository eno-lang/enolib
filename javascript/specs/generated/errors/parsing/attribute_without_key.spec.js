import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('An attribute without a key', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `= value`;
        
        try {
            parse(input);
        } catch(_error) {
            if (_error instanceof ParseError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ParseError);
        
        const text = `The attribute in line 2 has no key.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        ` >    2 | = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(0);
    });
});