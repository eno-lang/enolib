const enolib = require('../../../..');

describe('Asserting everything was touched when the only present multiline field was not touched', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    try {
      enolib.parse(input).assertAllTouched()
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | -- multiline_field\n` +
                    ` *    2 | value\n` +
                    ` *    3 | -- multiline_field`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(18);
  });
});

describe('Asserting everything was touched when the only present multiline field was touched', () => {
  it('produces the expected result', () => {
    const input = `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field`;

    const document = enolib.parse(input);
    
    document.field('multiline_field').touch();
    document.assertAllTouched();

    expect('it passes').toBeTruthy();
  });
});