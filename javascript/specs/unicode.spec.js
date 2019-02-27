const eno = require('..');

describe('Unicode special characters', () => {
  test('Line separator is handled correctly', () => {
    const document = eno.parse(`Unicode line separator: Here it comes   that was it`);
    const value = document.field('Unicode line separator').requiredStringValue();
    
    expect(value).toEqual(`Here it comes   that was it`);
  });
});
