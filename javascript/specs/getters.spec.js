const { parse } = require('..');

const sample = `
Field: Value
List:
- Value
- Value
Fieldset:
Foo = Bar
Bar = Baz
Empty List:
`;

const expected = {
  fieldset: {
    foo: 'Bar',
    bar: 'Baz'
  },
  emptyList: [],
  field: 'Value',
  list: [
    'Value',
    'Value'
  ]
};

describe('Getters', () => {
  test('return values as expected', () => {
    const document = parse(sample);

    const result = {
      fieldset: document.fieldset('Fieldset'),
      emptyList: document.list('Empty List').requiredStringValues(),
      field: document.field('Field').requiredStringValue(),
      list: document.list('List').requiredStringValues()
    };

    result.fieldset  = {
      foo: result.fieldset.entry('Foo').requiredStringValue(),
      bar: result.fieldset.entry('Bar').requiredStringValue()
    };

    expect(result).toEqual(expected);
  });
});
