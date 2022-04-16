import { parse, ParseError, ValidationError } from '../../../..';

describe('Expecting a field but getting an empty section', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `# element`;
        
        try {
            parse(input).field('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A field with the key 'element' was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | # element`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(9);
    });
});

describe('Expecting a field but getting a section with a field with a value and a field with two items', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `# element\n` +
                      `\n` +
                      `field: value\n` +
                      `\n` +
                      `field:\n` +
                      `- item\n` +
                      `- item`;
        
        try {
            parse(input).field('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A field with the key 'element' was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | # element\n` +
                        ` *    2 | \n` +
                        ` *    3 | field: value\n` +
                        ` *    4 | \n` +
                        ` *    5 | field:\n` +
                        ` *    6 | - item\n` +
                        ` *    7 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(6);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting a field but getting a section with subsections', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `# section\n` +
                      `\n` +
                      `## subsection\n` +
                      `\n` +
                      `field: value\n` +
                      `\n` +
                      `## subsection\n` +
                      `\n` +
                      `field:\n` +
                      `- item\n` +
                      `- item`;
        
        try {
            parse(input).field('section');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `A field with the key 'section' was expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | # section\n` +
                        ` *    2 | \n` +
                        ` *    3 | ## subsection\n` +
                        ` *    4 | \n` +
                        ` *    5 | field: value\n` +
                        ` *    6 | \n` +
                        ` *    7 | ## subsection\n` +
                        ` *    8 | \n` +
                        ` *    9 | field:\n` +
                        ` *   10 | - item\n` +
                        ` *   11 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(10);
        expect(error.selection.to.column).toEqual(6);
    });
});