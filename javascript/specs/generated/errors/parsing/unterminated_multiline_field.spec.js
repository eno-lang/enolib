import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('A multiline field with an incomplete multiline field operator in the ending line', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `-- multiline_field\n` +
                      `value\n` +
                      `value\n` +
                      `value\n` +
                      `- multiline_field`;
        
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
        
        const text = `The multiline field 'multiline_field' starting in line 1 is not terminated until the end of the document.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | -- multiline_field\n` +
                        ` *    2 | value\n` +
                        ` *    3 | value\n` +
                        ` *    4 | value\n` +
                        ` *    5 | - multiline_field`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(18);
    });
});

describe('A multiline field with an edge case key and missing space in the ending line', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `-- -\n` +
                      `value\n` +
                      `value\n` +
                      `value\n` +
                      `---`;
        
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
        
        const text = `The multiline field '-' starting in line 1 is not terminated until the end of the document.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | -- -\n` +
                        ` *    2 | value\n` +
                        ` *    3 | value\n` +
                        ` *    4 | value\n` +
                        ` *    5 | ---`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(4);
    });
});