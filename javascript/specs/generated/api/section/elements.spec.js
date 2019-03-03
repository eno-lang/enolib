const eno = require('../../../..');

describe('Querying all elements from a section', () => {
  it('produces the expected result', () => {
    const input = `# section\n` +
                  `one: value\n` +
                  `two: value`;

    const output = eno.parse(input).section('section').elements().map(element => element.stringKey());

    expect(output).toEqual(['one', 'two']);
  });
});

describe('Querying elements from a section by key', () => {
  it('produces the expected result', () => {
    const input = `# section\n` +
                  `field: value\n` +
                  `other: one\n` +
                  `other: two`;

    const output = eno.parse(input).section('section').elements('other').map(element => element.requiredStringValue());

    expect(output).toEqual(['one', 'two']);
  });
});