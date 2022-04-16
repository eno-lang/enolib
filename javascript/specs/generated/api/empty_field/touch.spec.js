import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Asserting everything was touched when the only present, empty field was not touched', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:`;
        
        try {
            parse(input).assertAllTouched()
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Asserting everything was touched when the only present, empty field was touched (as an element)', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const document = parse(input);
        
        document.element('field').touch();
        document.assertAllTouched();
        
        expect('it passes').toBeTruthy();
    });
});

describe('Asserting everything was touched when the only present, empty field was touched (as a field)', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const document = parse(input);
        
        document.field('field').touch();
        document.assertAllTouched();
        
        expect('it passes').toBeTruthy();
    });
});