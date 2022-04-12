import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Parsing a line continuation without any prior element', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `| continuation`;
        
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
        
        const text = `Line 1 contains a line continuation without a continuable element being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | | continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(14);
    });
});