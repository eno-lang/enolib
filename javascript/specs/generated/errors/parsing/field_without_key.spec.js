import { parse, ParseError, ValidationError } from '../../../..';

describe('A field without a key', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `- item\n` +
                      `- item\n` +
                      `: value`;
        
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
        
        const text = `The field in line 4 has no key.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `   ...\n` +
                        `      2 | - item\n` +
                        `      3 | - item\n` +
                        ` >    4 | : value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(3);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(3);
        expect(error.selection.to.column).toEqual(0);
    });
});