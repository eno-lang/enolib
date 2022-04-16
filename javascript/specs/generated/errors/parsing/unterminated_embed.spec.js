import { parse, ParseError, ValidationError } from '../../../..';

describe('An embed with an incomplete embed operator in the ending line', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `-- embed\n` +
                      `value\n` +
                      `value\n` +
                      `value\n` +
                      `- embed`;
        
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
        
        const text = `The embed 'embed' starting in line 1 is not terminated until the end of the document.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | -- embed\n` +
                        ` *    2 | value\n` +
                        ` *    3 | value\n` +
                        ` *    4 | value\n` +
                        ` *    5 | - embed`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(8);
    });
});

describe('An embed with an edge case key and missing space in the ending line', () => {
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
        
        const text = `The embed '-' starting in line 1 is not terminated until the end of the document.`;
        
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