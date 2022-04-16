import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Starting a section two levels deeper than the current one', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `# section\n` +
                      `### subsubsection`;
        
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
        
        const text = `The section in line 2 is more than one level deeper than the one it is contained in.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | # section\n` +
                        ` >    2 | ### subsubsection`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Starting the first section in the document at a deep level', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `### section`;
        
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
        
        const text = `The section in line 1 is more than one level deeper than the one it is contained in.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | ### section`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(11);
    });
});