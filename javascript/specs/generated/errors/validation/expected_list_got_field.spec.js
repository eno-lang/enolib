const enolib = require('../../../..');

describe('Expecting a list but getting a field', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value`;

    try {
      enolib.parse(input).list('field');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `A list with the key 'field' was expected.`;
    
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

describe('Expecting a list but getting a field with continuations', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field:\n` +
                  `| continuation\n` +
                  `| continuation`;

    try {
      enolib.parse(input).list('field');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `A list with the key 'field' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field:\n` +
                    ` *    2 | | continuation\n` +
                    ` *    3 | | continuation`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(14);
  });
});

describe('Expecting a list but getting a field with continuations separated by idle lines', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `field: value\n` +
                  `| continuation\n` +
                  `| continuation\n` +
                  `\n` +
                  `> comment\n` +
                  `| continuation`;

    try {
      enolib.parse(input).list('field');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `A list with the key 'field' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | field: value\n` +
                    ` *    2 | | continuation\n` +
                    ` *    3 | | continuation\n` +
                    ` *    4 | \n` +
                    ` *    5 | > comment\n` +
                    ` *    6 | | continuation`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(5);
    expect(error.selection.to.column).toEqual(14);
  });
});