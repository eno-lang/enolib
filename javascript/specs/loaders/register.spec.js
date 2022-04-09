import { parse, register } from '../../lib/esm/main.js';

const input = `
> comment
-- embed
value
-- embed

> comment
field: value

> comment
field_with_attributes:
attribute = value

> comment
field_with_items:
- item

> comment
flag

> comment
# section
`.trim();

describe('register', () => {
    let document, embed, field, fieldWithAttributes, fieldWithItems, flag, section;
    let missingEmbed, missingField, missingFlag, missingSection;
    
    beforeAll(() => {
        register({ custom: value => `custom ${value}` });
        
        document = parse(input);
        
        embed = document.embed('embed');
        field = document.field('field');
        fieldWithAttributes = document.field('field_with_attributes');
        fieldWithItems = document.field('field_with_items');
        flag = document.flag('flag');
        section = document.section('section');
        
        missingEmbed = document.embed('missing');
        missingField = document.field('missing');
        missingFlag = document.flag('missing');
        missingSection = document.section('missing');
    });

    describe('on Embed', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(embed.optionalCustomComment()).toEqual('custom comment');
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(embed.requiredCustomComment()).toEqual('custom comment');
        });
        
        it('registers a customKey accessor', () => {
            expect(embed.customKey()).toEqual('custom embed');
        });
        
        it('registers an optionalCustomValue accessor', () => {
            expect(embed.optionalCustomValue()).toEqual('custom value');
        });
        
        it('registers a requiredCustomValue accessor', () => {
            expect(embed.requiredCustomValue()).toEqual('custom value');
        });
    });
    
    describe('on Field', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(field.optionalCustomComment()).toEqual('custom comment');
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(field.requiredCustomComment()).toEqual('custom comment');
        });
        
        it('registers a customKey accessor', () => {
            expect(field.customKey()).toEqual('custom field');
        });
        
        it('registers an optionalCustomValue accessor', () => {
            expect(field.optionalCustomValue()).toEqual('custom value');
        });
        
        it('registers a requiredCustomValue accessor', () => {
            expect(field.requiredCustomValue()).toEqual('custom value');
        });
        
        it('registers an optionalCustomValues accessor', () => {
            expect(fieldWithItems.optionalCustomValues()).toEqual(['custom item']);
        });
        
        it('registers a requiredCustomValues accessor', () => {
            expect(fieldWithItems.requiredCustomValues()).toEqual(['custom item']);
        });
    });
    
    describe('on Flag', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(flag.optionalCustomComment()).toEqual('custom comment');
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(flag.requiredCustomComment()).toEqual('custom comment');
        });
        
        it('registers a customKey accessor', () => {
            expect(flag.customKey()).toEqual('custom flag');
        });
    });
    
    describe('on Section', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(section.optionalCustomComment()).toEqual('custom comment');
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(section.requiredCustomComment()).toEqual('custom comment');
        });
        
        it('registers a customKey accessor', () => {
            expect(section.customKey()).toEqual('custom section');
        });
    });
    
    describe('on MissingEmbed', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(missingEmbed.optionalCustomComment()).toEqual(null);
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(() => missingEmbed.requiredCustomComment()).toThrowErrorMatchingSnapshot();
        });
        
        it('registers a customKey accessor', () => {
            expect(() => missingEmbed.customKey()).toThrowErrorMatchingSnapshot();
        });
        
        it('registers an optionalCustomValue accessor', () => {
            expect(missingEmbed.optionalCustomValue()).toEqual(null);
        });
        
        it('registers a requiredCustomValue accessor', () => {
            expect(() => missingEmbed.requiredCustomValue()).toThrow();
        });
    });
    
    describe('on MissingField', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(missingField.optionalCustomComment()).toEqual(null);
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(() => missingField.requiredCustomComment()).toThrowErrorMatchingSnapshot();
        });
        
        it('registers a customKey accessor', () => {
            expect(() => missingField.customKey()).toThrowErrorMatchingSnapshot();
        });
        
        it('registers an optionalCustomValue accessor', () => {
            expect(missingField.optionalCustomValue()).toEqual(null);
        });
        
        it('registers a requiredCustomValue accessor', () => {
            expect(() => missingField.requiredCustomValue()).toThrow();
        });
        
        it('registers an optionalCustomValues accessor', () => {
            expect(missingField.optionalCustomValues()).toEqual([]);
        });
        
        it('registers a requiredCustomValues accessor', () => {
            expect(missingField.requiredCustomValues()).toEqual([]);
        });
    });
    
    describe('on MissingFlag', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(missingFlag.optionalCustomComment()).toEqual(null);
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(() => missingFlag.requiredCustomComment()).toThrowErrorMatchingSnapshot();
        });
        
        it('registers a customKey accessor', () => {
            expect(() => missingFlag.customKey()).toThrowErrorMatchingSnapshot();
        });
    });
    
    describe('on MissingSection', () => {
        it('registers an optionalCustomComment accessor', () => {
            expect(missingSection.optionalCustomComment()).toEqual(null);
        });
        
        it('registers a requiredCustomComment accessor', () => {
            expect(() => missingSection.requiredCustomComment()).toThrowErrorMatchingSnapshot();
        });
        
        it('registers a customKey accessor', () => {
            expect(() => missingSection.customKey()).toThrowErrorMatchingSnapshot();
        });
    });
});
