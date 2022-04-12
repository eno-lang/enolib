import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Expecting a list but getting two lists', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `list:\n` +
                      `- item\n` +
                      `list:\n` +
                      `- item`;
        
        try {
            parse(input).list('list');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only a single list with the key 'list' was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | list:\n` +
                        ` *    2 | - item\n` +
                        ` >    3 | list:\n` +
                        ` *    4 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting a list but getting two lists with comments, empty lines and continuations', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `> comment\n` +
                      `list:\n` +
                      `- item\n` +
                      `\n` +
                      `- item\n` +
                      `\n` +
                      `list:\n` +
                      `> comment\n` +
                      `- item\n` +
                      `\\ continuation`;
        
        try {
            parse(input).list('list');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only a single list with the key 'list' was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | > comment\n` +
                        ` >    2 | list:\n` +
                        ` *    3 | - item\n` +
                        ` *    4 | \n` +
                        ` *    5 | - item\n` +
                        `      6 | \n` +
                        ` >    7 | list:\n` +
                        ` *    8 | > comment\n` +
                        ` *    9 | - item\n` +
                        ` *   10 | \\ continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(4);
        expect(error.selection.to.column).toEqual(6);
    });
});