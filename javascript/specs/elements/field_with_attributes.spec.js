import { parse } from '../../lib/esm/main.js';
import { Attribute } from '../../lib/esm/elements/attribute.js';
import { MissingAttribute } from '../../lib/esm/elements/missing/missing_attribute.js';

describe('Field', () => {
    let field;
    
    beforeEach(() => {
        field =  parse(`
field:
attribute = value
other = value
            `.trim()).field('field');
        });
        
        it('is untouched after initialization', () => {
            expect(field._touched).toBeUndefined();
        });
        
        it('has only untouched attributes after initialization', () => {
            for (let attribute of field.attributes()) {
                expect(attribute._touched).toBeUndefined();
            }
        });
        
        it('has allAttributesRequired disabled by default', () => {
            expect(field._allAttributesRequired).toBe(false);
        });
        
        describe('attribute()', () => {
            describe('fetching an existing element', () => {
                let attribute;
                
                beforeEach(() => {
                    attribute = field.attribute('attribute');
                });
                
                it('returns a Attribute', () => {
                    expect(attribute).toBeInstanceOf(Attribute);
                });
                
                it('returns the right attribute', () => {
                    expect(attribute.stringKey()).toEqual('attribute');
                });
            });
            
            describe('fetching a missing element', () => {
                it('returns a MissingAttribute', () => {
                    const missingAttribute = field.attribute('missing');
                    expect(missingAttribute).toBeInstanceOf(MissingAttribute);
                });
            });
        });
        
        describe('allAttributesRequired()', () => {
            it('sets the _allAttributesRequired property to true', () => {
                field.allAttributesRequired();
                expect(field._allAttributesRequired).toBe(true);
            });
            
            describe('passing true explicitly', () => {
                it('sets the _allAttributesRequired property to true', () => {
                    field.allAttributesRequired(true);
                    expect(field._allAttributesRequired).toBe(true);
                });
            });
            
            describe('passing false explicitly', () => {
                it('sets the _allAttributesRequired property back to false', () => {
                    field.allAttributesRequired(true);
                    field.allAttributesRequired(false);
                    expect(field._allAttributesRequired).toBe(false);
                });
            });
        });
        
        describe('toString()', () => {
            it('returns a debug abstraction', () => {
                expect(field.toString()).toEqual('[object Field key=field attributes=2]');
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
            
            it('touches the field', () => {
                expect(field._touched).toBe(true);
            });
            
            it('touches the attributes', () => {
                for (const attribute of field.attributes()) {
                    expect(attribute._touched).toBe(true);
                }
            });
        });
    });
