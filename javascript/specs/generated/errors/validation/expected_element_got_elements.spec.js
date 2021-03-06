const enolib = require('../../../..');

describe('Expecting an element but getting two elements', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `element:\n` +
                  `element:`;

    try {
      enolib.parse(input).element('element');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only a single element with the key 'element' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | element:\n` +
                    ` >    2 | element:`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(8);
  });
});

describe('Expecting an element but getting two elements with comments and empty lines', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `> comment\n` +
                  `element:\n` +
                  `\n` +
                  `> comment\n` +
                  `element:`;

    try {
      enolib.parse(input).element('element');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only a single element with the key 'element' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | > comment\n` +
                    ` >    2 | element:\n` +
                    `      3 | \n` +
                    `      4 | > comment\n` +
                    ` >    5 | element:`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(8);
  });
});