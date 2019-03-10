const enolib = require('../../../..');

describe('Asserting everything was touched on an untouched document', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      enolib.parse(input).assertAllTouched();
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
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

describe('Asserting everything was touched on an untouched document, with a custom message', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      enolib.parse(input).assertAllTouched('my custom message');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `my custom message`;
    
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