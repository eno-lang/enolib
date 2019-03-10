const enolib = require('../../../..');

describe('Obtaining and throwing an error with a custom message in the context of a field\'s value', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      throw enolib.parse(input).field('field').valueError('my message')
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `There is a problem with the value of this element: my message`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(7);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(12);
  });
});

describe('Obtaining and throwing an error with a custom generated message in the context of a field\'s value', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      throw enolib.parse(input).field('field').valueError(value => `my generated message for value '${value}'`)
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `There is a problem with the value of this element: my generated message for value 'value'`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(7);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(12);
  });
});