import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Parsing an attribute without a fieldset', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `attribute = value`;
        
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
        
        const text = `Line 1 contains an attribute without a fieldset being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(13);
    });
});

describe('Parsing an attribute preceded by a line continuation', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `| line_continuation\n` +
                      `attribute = value`;
        
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
        
        const text = `Line 3 contains an attribute without a fieldset being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        `      2 | | line_continuation\n` +
                        ` >    3 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(13);
    });
});

describe('Parsing an attribute preceded by a field', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field: value\n` +
                      `attribute = value`;
        
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
        
        const text = `Line 2 contains an attribute without a fieldset being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field: value\n` +
                        ` >    2 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(13);
    });
});

describe('Parsing an attribute preceded by a list item', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `list:\n` +
                      `- item\n` +
                      `attribute = value`;
        
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
        
        const text = `Line 3 contains an attribute without a fieldset being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | list:\n` +
                        `      2 | - item\n` +
                        ` >    3 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(13);
    });
});