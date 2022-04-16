import { parse, ParseError, ValidationError } from '../../../..';

describe('Expecting an attribute but getting two attributes', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `attribute = value\n` +
                      `attribute = value`;
        
        try {
            parse(input).field('field').attribute('attribute');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a single attribute with the key 'attribute'.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        ` >    2 | attribute = value\n` +
                        ` >    3 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Expecting an attribute but getting two attributes with comments, empty lines and continuations', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `> comment\n` +
                      `attribute = value\n` +
                      `\\ continuation\n` +
                      `\\ continuation\n` +
                      `\n` +
                      `> comment\n` +
                      `attribute = value\n` +
                      `| continuation`;
        
        try {
            parse(input).field('field').attribute('attribute');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This field was expected to contain only a single attribute with the key 'attribute'.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | field:\n` +
                        `      2 | > comment\n` +
                        ` >    3 | attribute = value\n` +
                        ` *    4 | \\ continuation\n` +
                        ` *    5 | \\ continuation\n` +
                        `      6 | \n` +
                        `      7 | > comment\n` +
                        ` >    8 | attribute = value\n` +
                        ` *    9 | | continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(2);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(4);
        expect(error.selection.to.column).toEqual(14);
    });
});