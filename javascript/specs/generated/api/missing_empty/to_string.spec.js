const enolib = require('../../../..');

describe('A missing empty queried without a key leaves out the key in the debug string representation', () => {
  it('produces the expected result', () => {
    const input = ``;

    const output = enolib.parse(input).empty().toString();

    expect(output).toEqual('[object MissingEmpty]');
  });
});

describe('A missing empty queried with a key includes the key in the debug string representation', () => {
  it('produces the expected result', () => {
    const input = ``;

    const output = enolib.parse(input).empty('key').toString();

    expect(output).toEqual('[object MissingEmpty key=key]');
  });
});