import { parse } from '../lib/esm/main.js';

const sample = `
field: value
items:
- item
- item
attributes:
foo = bar
bar = baz
empty:
`.trim();

const expected = {
    attributes: {
        foo: 'bar',
        bar: 'baz'
    },
    empty: [],
    field: 'value',
    items: [
        'item',
        'item'
    ]
};

describe('Getters', () => {
    test('return values as expected', () => {
        const document = parse(sample);
        
        const result = {
            attributes: document.field('attributes'),
            empty: document.field('empty').requiredStringValues(),
            field: document.field('field').requiredStringValue(),
            items: document.field('items').requiredStringValues()
        };
        
        result.attributes  = {
            foo: result.attributes.attribute('foo').requiredStringValue(),
            bar: result.attributes.attribute('bar').requiredStringValue()
        };
        
        expect(result).toEqual(expected);
    });
});
