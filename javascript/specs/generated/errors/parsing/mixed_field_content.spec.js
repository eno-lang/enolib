import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Parsing an attribute preceded by a continuation', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `| continuation\n` +
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
        
        const text = `The field in line 1 must contain either only attributes, only items, or only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | field:\n` +
                        ` *    2 | | continuation\n` +
                        ` >    3 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Parsing an attribute preceded by a value', () => {
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
        
        const text = `The field in line 1 must contain either only attributes, only items, or only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | field: value\n` +
                        ` >    2 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Parsing an attribute preceded by a item', () => {
    it('throws the expected ParseError', () => {
        let error = null;
        
        const input = `field:\n` +
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
        
        const text = `The field in line 1 must contain either only attributes, only items, or only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | field:\n` +
                        ` *    2 | - item\n` +
                        ` >    3 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Parsing an item preceded by a continuation', () => {
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
        
        const text = `The field in line 1 must contain either only attributes, only items, or only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | field:\n` +
                        ` *    2 | | continuation\n` +
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
        
        const text = `The field in line 1 must contain either only attributes, only items, or only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` *    1 | field:\n` +
                        ` *    2 | attribute = value\n` +
                        ` >    3 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(6);
    });
});