import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying a missing field on the document when all elements are required', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = ``;
        
        try {
            const document = parse(input);
            
            document.allElementsRequired();
            document.field('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The field 'field' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
        
        expect(error.text).toEqual(text);
    });
});

describe('Querying a missing section on the document when all elements are required', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = ``;
        
        try {
            const document = parse(input);
            
            document.allElementsRequired();
            document.section('section');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
        
        expect(error.text).toEqual(text);
    });
});

describe('Querying a missing field on the document when requiring all elements is explicitly disabled', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const document = parse(input);
        
        document.allElementsRequired(false);
        document.field('field');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing field on the document when requiring all elements is enabled and disabled again', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const document = parse(input);
        
        document.allElementsRequired(true);
        document.allElementsRequired(false);
        document.field('field');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional element on the document when requiring all elements is enabled', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const document = parse(input);
        
        document.allElementsRequired();
        document.optionalElement('element');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional flag on the document when requiring all elements is enabled', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const document = parse(input);
        
        document.allElementsRequired();
        document.optionalFlag('flag');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional field on the document when requiring all elements is enabled', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const document = parse(input);
        
        document.allElementsRequired();
        document.optionalField('field');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional section on the document when requiring all elements is enabled', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const document = parse(input);
        
        document.allElementsRequired();
        document.optionalSection('section');
        
        expect('it passes').toBeTruthy();
    });
});