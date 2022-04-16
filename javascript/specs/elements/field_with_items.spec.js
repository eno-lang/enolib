import { parse } from '../..';
import { Item } from '../../lib/elements/item.js';

describe('Field', () => {
    let field;
    
    beforeEach(() => {
        const document = parse(`
            field:
            - item
            - other
            `.trim());
            
            field = document.field('field');
        });
        
        it('is untouched after initialization', () => {
            expect(field._touched).toBeUndefined();
        });
        
        it('has only untouched items after initialization', () => {
            for (const item of field.items()) {
                expect(item._touched).toBeUndefined();
            }
        });
        
        describe('items()', () => {
            let items;
            
            beforeEach(() => {
                items = field.items();
            });
            
            it('touches the field itself', () => {
                expect(field._touched).toBe(true);
            });
            
            it('does not touch the field items', () => {
                for (const item of items) {
                    expect(item._touched).toBeUndefined();
                }
            });
            
            it('returns the items', () => {
                for (const item of items) {
                    expect(item).toBeInstanceOf(Item);
                }
            });
        });
        
        describe('optionalStringValues()', () => {
            let values;
            
            beforeEach(() => {
                values = field.optionalStringValues();
            });
            
            it('returns the values', () => {
                expect(values).toEqual(['item', 'other']);
            });
            
            it('touches the field itself', () => {
                expect(field._touched).toBe(true);
            });
            
            it('touches all field items', () => {
                for (const item of field.items()) {
                    expect(item._touched).toBe(true);
                }
            });
        });
        
        describe('requiredValues(loader)', () => {
            let values;
            
            beforeEach(() => {
                values = field.requiredValues(value => value.toUpperCase());
            });
            
            it('returns the processed values', () => {
                expect(values).toEqual(['ITEM', 'OTHER']);
            });
            
            it('touches the element', () => {
                expect(field._touched).toBe(true);
            });
            
            it('touches all field items', () => {
                for (const item of field.items()) {
                    expect(item._touched).toBe(true);
                }
            });
        });
        
        describe('length()', () => {
            it('returns the number of items', () => {
                expect(field.length()).toBe(2);
            });
        });
        
        describe('toString()', () => {
            it('returns a debug abstraction', () => {
                expect(field.toString()).toEqual('[object Field key=field items=2]');
            });
        });
        
        describe('toStringTag symbol', () => {
            it('returns a custom tag', () => {
                expect(Object.prototype.toString.call(field)).toEqual('[object Field]');
            });
        });
        
        describe('touch()', () => {
            beforeEach(() => {
                field.touch();
            });
            
            it('touches the field itself', () => {
                expect(field._touched).toBe(true);
            });
            
            it('touches the field items', () => {
                for (const item of field.items()) {
                    expect(item._touched).toBe(true);
                }
            });
        });
    });
