const eno = require('../../../..');

describe('Asserting everything was touched when the only present field was not touched', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      eno.parse(input).assertAllTouched()
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(12);
  });
});

describe('Asserting everything was touched when the only present field was touched', () => {
  it('produces the expected result', () => {
    const input = `field: value`;

    const document = eno.parse(input);
    
    document.field('field').touch();
    document.assertAllTouched();

    expect('it passes').toBeTruthy();
  });
});