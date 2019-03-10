const enolib = require('../../../..');

describe('Obtaining and throwing an error with a custom message in the context of a field\'s key', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      throw enolib.parse(input).field('field').keyError('my message')
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `There is a problem with the key of this element: my message`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(5);
  });
});

describe('Obtaining and throwing an error with a custom generated message in the context of a field\'s key', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      throw enolib.parse(input).field('field').keyError(key => `my generated message for field '${key}'`)
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `There is a problem with the key of this element: my generated message for field 'field'`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(5);
  });
});