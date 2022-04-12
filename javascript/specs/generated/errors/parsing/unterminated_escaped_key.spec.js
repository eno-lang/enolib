import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('A single field with an terminated escaped key', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `\`field: value`;
        
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
        
        const text = `In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | \`field: value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(1);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(13);
    });
});