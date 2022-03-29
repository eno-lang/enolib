const enolib = require('../../../..');

describe('Parsing a fieldset entry without a fieldset', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `entry = value`;

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
    
    const text = `Line 1 contains a fieldset entry without a fieldset being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a line continuation', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field:\n` +
                  `| line_continuation\n` +
                  `entry = value`;

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
    
    const text = `Line 3 contains a fieldset entry without a fieldset being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | field:\n` +
                    `      2 | | line_continuation\n` +
                    ` >    3 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a field', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field: value\n` +
                  `entry = value`;

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
    
    const text = `Line 2 contains a fieldset entry without a fieldset being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | field: value\n` +
                    ` >    2 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a list item', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `list:\n` +
                  `- item\n` +
                  `entry = value`;

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
    
    const text = `Line 3 contains a fieldset entry without a fieldset being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | list:\n` +
                    `      2 | - item\n` +
                    ` >    3 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(13);
  });
});