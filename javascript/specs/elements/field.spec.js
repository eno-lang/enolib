import { parse } from '../..';

describe('Field', () => {
    let emptyField, emptyItem, field, item, itemWithLongValue;
    
    beforeEach(() => {
        emptyField = parse('field:').field('field');
        emptyItem = parse('field:\n-').field('field').items()[0];
        field = parse('field: value').field('field');
        item = parse('field:\n- item').field('field').items()[0];
        itemWithLongValue = parse('field:\n- long item value is long').field('field').items()[0];
    });
    
    it('is untouched after initialization', () => {
        expect(field._touched).toBeUndefined();
    });
    
    describe('optionalStringValue()', () => {
        it('returns the value', () => {
            expect(field.optionalStringValue()).toEqual('value');
        });
        
        it('touches the element', () => {
            field.optionalStringValue();
            expect(field._touched).toBe(true);
        });
        
        it('returns null when empty', () => {
            expect(emptyField.optionalStringValue()).toBe(null);
        });
    });
    
    describe('toString()', () => {
        describe('with a key and a value', () => {
            it('returns a debug abstraction', () => {
                expect(field.toString()).toEqual('[object Field key=field value=value]');
            });
        });
        
        describe('with a key and no value', () => {
            it('returns a debug abstraction', () => {
                expect(emptyField.toString()).toEqual('[object Field key=field]');
            });
        });
        
        describe('without key, with value', () => {
            it('returns a debug abstraction', () => {
                expect(item.toString()).toEqual('[object Item value=item]');
            });
        });
        
        describe('with no key and value', () => {
            it('returns a debug abstraction', () => {
                expect(emptyItem.toString()).toEqual('[object Item value=null]');
            });
        });
        
        describe('without key, with long value', () => {
            it('returns a debug abstraction with a truncated value', () => {
                expect(itemWithLongValue.toString()).toEqual('[object Item value=long item v...]');
            });
        });
    });
    
    describe('toStringTag symbol', () => {
        it('returns a custom tag', () => {
            expect(Object.prototype.toString.call(field)).toEqual('[object Field]');
        });
    });
    
    describe('requiredValue(loader)', () => {
        it('applies the loader', () => {
            const result = field.requiredValue(value => value.toUpperCase());
            expect(result).toEqual('VALUE');
        });
        
        it('touches the element', () => {
            field.requiredValue(value => value.toUpperCase());
            expect(field._touched).toBe(true);
        });
        
        describe('when empty', () => {
            it('throws an error', () => {
                expect(() => emptyField.requiredValue(value => value)).toThrowErrorMatchingSnapshot();
            });
        });
    });
});
