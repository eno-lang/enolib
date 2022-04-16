import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Expecting a field with a value but getting a field with an attribute', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `attribute = value`;
        
        try {
            parse(input).field('field').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a value.`;
        
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

describe('Expecting a field containing a value but getting a field containing three attributes with empty lines', () => {
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
            parse(input).field('field').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a value.`;
        
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
            parse(input).field('field').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a value.`;
        
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

describe('Expecting a field containing a value but getting a field containing one item', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `- item`;
        
        try {
            parse(input).field('field').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting a field containing a value but getting a field containing three items with empty lines', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `\n` +
                      `- item\n` +
                      `\n` +
                      `- item\n` +
                      `\n` +
                      `- item\n` +
                      ``;
        
        try {
            parse(input).field('field').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | \n` +
                        ` *    3 | - item\n` +
                        ` *    4 | \n` +
                        ` *    5 | - item\n` +
                        ` *    6 | \n` +
                        ` *    7 | - item\n` +
                        `      8 | `;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(6);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting a field containing a value but getting a field with two items with comments', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `> comment\n` +
                      `- item\n` +
                      `\n` +
                      `> comment\n` +
                      `- item`;
        
        try {
            parse(input).field('field').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | > comment\n` +
                        ` *    3 | - item\n` +
                        ` *    4 | \n` +
                        ` *    5 | > comment\n` +
                        ` *    6 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(6);
    });
});