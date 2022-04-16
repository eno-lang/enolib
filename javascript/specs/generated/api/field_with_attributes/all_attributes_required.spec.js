import { parse, ParseError, ValidationError } from '../../../..';

describe('Querying a missing attribute on a field with attributes when all attributes are required', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:`;
        
        try {
            const field = parse(input).field('field');
            
            field.allAttributesRequired();
            field.attribute('attribute');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
        
        expect(error.text).toEqual(text);
    });
});

describe('Querying a missing attribute on a field with attributes when all requiring all attributes is explicitly enabled', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:`;
        
        try {
            const field = parse(input).field('field');
            
            field.allAttributesRequired(true);
            field.attribute('attribute');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
        
        expect(error.text).toEqual(text);
    });
});

describe('Querying a missing attribute on a field with attributes when requiring all attributes is explicitly disabled', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const field = parse(input).field('field');
        
        field.allAttributesRequired(false);
        field.attribute('attribute');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing attribute on a field with attributes when requiring all attributes is enabled and disabled again', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const field = parse(input).field('field');
        
        field.allAttributesRequired(true);
        field.allAttributesRequired(false);
        field.attribute('attribute');
        
        expect('it passes').toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional attribute on a field with attributes when requiring all attributes is enabled', () => {
    it('produces the expected result', () => {
        const input = `field:`;
        
        const field = parse(input).field('field');
        
        field.allAttributesRequired();
        field.optionalAttribute('attribute');
        
        expect('it passes').toBeTruthy();
    });
});