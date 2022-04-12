import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Parsing an item without any previous element', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `- item`;
        
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
        
        const text = `Line 1 contains an item without a field being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Parsing an item preceded by a line continuation', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `| continuation\n` +
                      `- item`;
        
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
        
        const text = `Line 3 contains an item without a field being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        `      2 | | continuation\n` +
                        ` >    3 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Parsing an item preceded by an attribute', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `attribute = value\n` +
                      `- item`;
        
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
        
        const text = `Line 3 contains an item without a field being specified before.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        `      2 | attribute = value\n` +
                        ` >    3 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(6);
    });
});