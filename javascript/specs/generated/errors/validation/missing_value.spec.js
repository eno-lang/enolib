import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying a fieldset entry for a required but missing value', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `fieldset:\n` +
                      `entry =`;
        
        try {
            parse(input).fieldset('fieldset').entry('entry').requiredStringValue();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The fieldset entry 'entry' must contain a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | fieldset:\n` +
                        ` >    2 | entry =`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(7);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(7);
    });
});

describe('Querying a field for a required but missing value', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:`;
        
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
        
        const text = `The field 'field' must contain a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(6);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Querying a field with empty line continuations for a required but missing value', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `|\n` +
                      `\n` +
                      `|`;
        
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
        
        const text = `The field 'field' must contain a value.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | |\n` +
                        ` *    3 | \n` +
                        ` *    4 | |`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(6);
        expect(error.selection.to.line).toEqual(3);
        expect(error.selection.to.column).toEqual(1);
    });
});

describe('Querying a list with an empty item for required values', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `list:\n` +
                      `- item\n` +
                      `-`;
        
        try {
            parse(input).list('list').requiredStringValues();
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The list 'list' may not contain empty items.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | list:\n` +
                        `      2 | - item\n` +
                        ` >    3 | -`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(1);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(1);
    });
});