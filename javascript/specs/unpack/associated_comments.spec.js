import { parse } from '../..';
import { unpack } from '../unpack.js';

const input = `
> [comment]
> [comment]

> [comment]

> [comment_associated_with_field_with_items]
field_with_items:

> [comment_associated_with_item]
- item
> [comment]

> [comment]
> [comment]

> [comment_associated_with_field_with_attributes]
field_with_attributes:

> [comment_associated_with_attribute_begin]
> [comment_associated_with_attribute_between]
> [comment_associated_with_attribute_end]
attribute = value

> [comment_associated_with_section_begin]
> [comment_associated_with_section_end]
# section
`.trim();

describe('Blackbox test', () => {
    describe('Associated comments', () => {
        let document;
        
        beforeAll(() => {
            document = parse(input);
        });
        
        it('associates a comment to the field with items', () => {
            expect(document.field('field_with_items').requiredStringComment()).toEqual('[comment_associated_with_field_with_items]');
        });
        
        it('associates a comment to the item', () => {
            expect(document.field('field_with_items').items()[0].requiredStringComment()).toEqual('[comment_associated_with_item]');
        });
        
        it('associates a comment to the field with attributes', () => {
            expect(document.field('field_with_attributes').requiredStringComment()).toEqual('[comment_associated_with_field_with_attributes]');
        });
        
        it('associates three comments to the attribute', () => {
            expect(document.field('field_with_attributes').attribute('attribute').requiredStringComment()).toEqual(
                '[comment_associated_with_attribute_begin]\n' +
                '[comment_associated_with_attribute_between]\n' +
                '[comment_associated_with_attribute_end]'
            );
        });
        
        it('associates two comments to the section', () => {
            expect(document.section('section').requiredStringComment()).toEqual(
                '[comment_associated_with_section_begin]\n' +
                '[comment_associated_with_section_end]'
            );
        });
    });
});
