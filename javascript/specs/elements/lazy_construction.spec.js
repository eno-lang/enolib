import { parse } from '../../lib/esm/main.js';
import { Field } from '../../lib/esm/elements/field.js';

describe('Fetching an ambiguous element through field()', () => {
    let field;
    
    beforeEach(() => {
        field = parse('field:').field('field');
    });
    
    it('returns a field', () => {
        expect(field).toBeInstanceOf(Field);
    });
    
    it('returns a field with allAttributesRequired disabled', () => {
        expect(field._allAttributesRequired).toBe(false);
    });
    
    describe('when allElementsRequired was enabled on the document', () => {
        beforeEach(() => {
            const document = parse('field:');
            
            document.allElementsRequired();
            
            field = document.field('field');
        });
        
        it('returns a field with allAttributesRequired enabled', () => {
            expect(field._allAttributesRequired).toBe(true);
        });
    });
});

describe('Fetching an ambiguous element through fields()', () => {
    let fields;
    
    beforeEach(() => {
        fields = parse('field:').fields('field');
    });
    
    it('returns one element', () => {
        expect(fields.length).toBe(1);
    });
    
    it('returns a field as first element', () => {
        expect(fields[0]).toBeInstanceOf(Field);
    });
    
    it('returns a field with allAttributesRequired disabled', () => {
        expect(fields[0]._allAttributesRequired).toBe(false);
    });
    
    describe('when allElementsRequired was enabled on the document', () => {
        beforeEach(() => {
            const document = parse('field:');
            
            document.allElementsRequired();
            
            fields = document.fields('field');
        });
        
        it('returns a field with allAttributesRequired enabled', () => {
            expect(fields[0]._allAttributesRequired).toBe(true);
        });
    });
});