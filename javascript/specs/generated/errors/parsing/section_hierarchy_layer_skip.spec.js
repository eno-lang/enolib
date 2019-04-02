const enolib = require('../../../..');

describe('Starting a section two levels deeper than the current one', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `# section\n` +
                  `### subsubsection`;

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
    
    const text = `Line 2 starts a section that is more than one level deeper than the current one.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | # section\n` +
                    ` >    2 | ### subsubsection`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(17);
  });
});

describe('Starting the first section in the document at a deep level', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `### section`;

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
    
    const text = `Line 1 starts a section that is more than one level deeper than the current one.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | ### section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(11);
  });
});