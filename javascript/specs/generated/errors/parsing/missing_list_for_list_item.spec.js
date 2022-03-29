const enolib = require('../../../..');

describe('Parsing a list item without any previous element', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `- item`;

    try {
      enolib.parse(input);
    } catch(_error) {
      if(_error instanceof enolib.ParseError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ParseError);
    
    const text = `Line 1 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a line continuation', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field:\n` +
                  `| continuation\n` +
                  `- item`;

    try {
      enolib.parse(input);
    } catch(_error) {
      if(_error instanceof enolib.ParseError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ParseError);
    
    const text = `Line 3 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | field:\n` +
                    `      2 | | continuation\n` +
                    ` >    3 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a fieldset entry', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `entry = value\n` +
                  `- item`;

    try {
      enolib.parse(input);
    } catch(_error) {
      if(_error instanceof enolib.ParseError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ParseError);
    
    const text = `Line 3 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | fieldset:\n` +
                    `      2 | entry = value\n` +
                    ` >    3 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(6);
  });
});