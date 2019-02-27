const { parse } = require('..');

const expected = {
  field: 'Value of a field',
  list: [
    'Value inside a list',
    'Value inside a list'
  ],
  emptyList: []
};

const fieldLoader = value => `${value} of a field`;
const listLoader = value => `${value} inside a list`;

describe('Loaders', () => {
  it('transforms values as specified', () => {
    const document = parse(`
Field: Value
List:
- Value
- Value
Empty List:
    `.trim());

    const result = {
      field: document.field('Field').requiredValue(fieldLoader),
      list: document.list('List').requiredValues(listLoader),
      emptyList: document.list('Empty List').requiredValues(listLoader)
    };

    expect(result).toEqual(expected);
  });
});
