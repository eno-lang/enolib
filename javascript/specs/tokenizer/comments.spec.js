const { inspectTokenization } = require('./util.js');

const input = '> value\n' +
              '> more value  \n' +
              '    >    value\n' +
              '    >    ';

describe('Comment tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
