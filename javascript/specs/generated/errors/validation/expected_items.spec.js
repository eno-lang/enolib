import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Expecting a field containing items but getting a field containing a value', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value`;
        
        try {
            parse(input).field('field').items();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(12);
    });
});

describe('Expecting a field containing items but getting a field containing continuations', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `| continuation\n` +
                      `| continuation`;
        
        try {
            parse(input).field('field').items();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | | continuation\n` +
                        ` *    3 | | continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(14);
    });
});

describe('Expecting a field with items but getting a field containing a value and continuations separated by idle lines', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value\n` +
                      `| continuation\n` +
                      `| continuation\n` +
                      `\n` +
                      `> comment\n` +
                      `| continuation`;
        
        try {
            parse(input).field('field').items();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value\n` +
                        ` *    2 | | continuation\n` +
                        ` *    3 | | continuation\n` +
                        ` *    4 | \n` +
                        ` *    5 | > comment\n` +
                        ` *    6 | | continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(14);
    });
});

describe('Expecting a field containing items but getting a field with one attribute', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `attribute = value`;
        
        try {
            parse(input).field('field').items();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Expecting a field containing items but getting a field containing empty lines and three attributes', () => {
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
            parse(input).field('field').items();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
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
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Expecting a field containing items but getting a field containing two attributes with comments', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `> comment\n` +
                      `attribute = value\n` +
                      `\n` +
                      `> comment\n` +
                      `attribute = value`;
        
        try {
            parse(input).field('field').items();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only items.`;
        
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
        expect(error.selection.to.column).toEqual(17);
    });
});