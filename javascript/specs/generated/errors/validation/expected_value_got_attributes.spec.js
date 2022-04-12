import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Expecting a field with a value but getting a field with an attribute', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `attribute = value`;
        
        try {
            parse(input).field('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A field containing a value was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(13);
    });
});

describe('Expecting a field containing a value but getting a field containing multiple attributes with empty lines', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `\n` +
                      `attribute = value\n` +
                      `\n` +
                      `attribute = value\n` +
                      `\n` +
                      `attribute = value\n` +
                      ``;
        
        try {
            parse(input).field('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A field containing a value was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | fieldset:\n` +
                        ` *    2 | \n` +
                        ` *    3 | attribute = value\n` +
                        ` *    4 | \n` +
                        ` *    5 | attribute = value\n` +
                        ` *    6 | \n` +
                        ` *    7 | attribute = value\n` +
                        `      8 | `;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(6);
        expect(error.selection.to.column).toEqual(13);
    });
});

describe('Expecting a field containing a value but getting a field containing two attributes with comments', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `> comment\n` +
                      `attribute = value\n` +
                      `\n` +
                      `> comment\n` +
                      `attribute = value`;
        
        try {
            parse(input).field('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A field containing a value was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | > comment\n` +
                        ` *    3 | attribute = value\n` +
                        ` *    4 | \n` +
                        ` *    5 | > comment\n` +
                        ` *    6 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(13);
    });
});