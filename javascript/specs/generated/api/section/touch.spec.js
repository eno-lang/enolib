const enolib = require('../../../..');

describe('Asserting everything was touched when the only present section was not touched', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section`;

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
                    ` >    1 | # section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(9);
  });
});

describe('Asserting everything was touched when the only present section was touched', () => {
  it('produces the expected result', () => {
    const input = `# section`;

    const document = enolib.parse(input);
    
    document.section('section').touch();
    document.assertAllTouched();

    expect('it passes').toBeTruthy();
  });
});