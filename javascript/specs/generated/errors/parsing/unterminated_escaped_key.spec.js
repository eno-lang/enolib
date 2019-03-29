const enolib = require('../../../..');

describe('A single field with an terminated escaped key', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `\`field: value`;

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
    
    const text = `In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | \`field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(1);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(13);
  });
});

describe('A single section with an unterminated escaped key', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `# \`field: value`;

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
    
    const text = `In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # \`field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(3);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(15);
  });
});