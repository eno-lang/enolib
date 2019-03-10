const enolib = require('..');

describe('Unicode special characters', () => {
  test('Line separator is handled correctly', () => {
    const document = enolib.parse(`Unicode line separator: Here it comes   that was it`);
    const value = document.field('Unicode line separator').requiredStringValue();
    
    expect(value).toEqual(`Here it comes   that was it`);
  });
});
