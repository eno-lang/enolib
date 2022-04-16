import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('A valid escape sequence, continued invalidly', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `\`key\` value`;
        
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
        
        const text = `The escape sequence in line 1 can only be followed by an attribute or field operator.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | \`key\` value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(6);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(11);
    });
});