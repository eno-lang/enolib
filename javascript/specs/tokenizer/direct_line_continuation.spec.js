const { inspectTokenization } = require('./util.js');

const input = `
field:

| value

|    value

    | value

    |    value

| value
`.trim();

describe('Direct line continuation tokenization', () => {
  it('is performed as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
