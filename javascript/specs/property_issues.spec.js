import { parse } from '..';
import { unpack } from './unpack.js';

describe('Property issues', () => {
    describe('Section', () => {
        describe('toString as field key', () => {
            it('does not have any side effects', () => {
                const document = parse('toString: value');
                
                expect(unpack(document)).toMatchSnapshot();
            });
        });
        
        describe('toString as flag key', () => {
            it('does not have any side effects', () => {
                const document = parse('toString');
                    
                expect(unpack(document)).toMatchSnapshot();
            });
        });
            
        describe('toString as attribute key', () => {
            it('does not have any side effects', () => {
                const document = parse(`
check:
toString = value
                `.trim());
                
                expect(unpack(document)).toMatchSnapshot();
            });
        });
            
        describe("fetching a missing embed with the key 'toString'", () => {
            it('does not have any side effects', () => {
                const document = parse('');
                
                expect(document.embed('toString').optionalStringValue()).toEqual(null);
            });
        });
            
        describe("fetching from a missing field with the key 'toString'", () => {
            it('does not have any side effects', () => {
                const document = parse('');
                
                expect(document.field('toString').optionalStringValue()).toBe(null);
            });
        });
        
        describe("fetching a missing flag with the key 'toString'", () => {
            it('does not have any side effects', () => {
                const document = parse('');
                
                expect(document.optionalFlag('toString')).toBe(null);
            });
        });
        
        describe("fetching a missing section with the key 'toString'", () => {
            it('does not have any side effects', () => {
                const document = parse('');
                
                expect(document.optionalSection('toString')).toBe(null);
            });
        });
        
        describe("fetching missing sections with the key 'toString'", () => {
            it('does not have any side effects', () => {
                const document = parse('');
                
                expect(document.sections('toString')).toEqual([]);
            });
        });
        
        describe('asserting toString has been touched', () => {
            it('does not have any side effects', () => {
                const document = parse('');
                
                expect(() => document.assertAllTouched({ only: 'toString' })).not.toThrow();
            });
        });
        
    });
    
    describe('Field', () => {
        describe('asserting toString has been touched', () => {
            it('does not have any side effects', () => {
                const document = parse(`
color ratings:
red = 1
blue = 2
                `.trim());
                
                const field = document.field('color ratings');
                
                expect(() => field.assertAllTouched({ only: 'toString' })).not.toThrow();
            });
        });
        
        describe("fetching a missing attribute with the key 'toString'", () => {
            it('does not have any side effects', () => {
                const document = parse(`
color ratings:
red = 1
blue = 2
                `.trim());
                
                const field = document.field('color ratings');
                
                expect(field.attribute('toString').optionalStringValue()).toBe(null);
            });
        });
        
    });
});
