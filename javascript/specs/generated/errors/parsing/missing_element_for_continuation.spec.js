const enolib = require('../../../..');

describe('Parsing a line continuation without any prior element', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `| continuation`;

    try {
      enolib.parse(input);
    } catch(_error) {
      if(_error instanceof enolib.ParseError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ParseError);
    
    const text = `Line 1 contains a line continuation without a continuable element being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | | continuation`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(14);
  });
});

describe('Parsing a line continuation preceded by a copied field', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field: value\n` +
                  `\n` +
                  `copy < field\n` +
                  `| illegal_continuation`;

    try {
      enolib.parse(input);
    } catch(_error) {
      if(_error instanceof enolib.ParseError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ParseError);
    
    const text = `Line 4 contains a line continuation without a continuable element being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `   ...\n` +
                    `      2 | \n` +
                    `      3 | copy < field\n` +
                    ` >    4 | | illegal_continuation`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(3);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(22);
  });
});