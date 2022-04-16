import { parse } from '../..';

const reverseLoader = value => value.split('').reverse().join('');
const upperCaseLoader = value => value.toUpperCase();

describe('Loaders', () => {
    it('transforms values as specified', () => {
        const document = parse(`
field_with_value: value
field_with_items:
- item
- item
empty_field:
            `.trim());
            
            const fieldWithValues = document.field('field_with_value').requiredValue(reverseLoader);
            expect(fieldWithValues).toEqual('eulav');
            
            const fieldWithItems = document.field('field_with_items').requiredValues(upperCaseLoader);
            expect(fieldWithItems).toEqual(['ITEM', 'ITEM']);
            
            const emptyField = document.field('empty_field').requiredValues(reverseLoader);
            expect(emptyField).toEqual([]);
        });
    });
