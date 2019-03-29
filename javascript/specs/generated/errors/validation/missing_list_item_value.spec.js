const enolib = require('../../../..');

describe('Directly querying a list item for a required but missing value', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `-`;

    try {
      enolib.parse(input).list('list').items()[0].requiredStringValue();
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The list 'list' may not contain empty items.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | list:\n` +
                    ` >    2 | -`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(1);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(1);
  });
});

describe('Indirectly querying a list with empty items for required values', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `-`;

    try {
      enolib.parse(input).list('list').requiredStringValues();
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The list 'list' may not contain empty items.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | list:\n` +
                    ` >    2 | -`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(1);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(1);
  });
});