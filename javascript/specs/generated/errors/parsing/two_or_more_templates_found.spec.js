const enolib = require('../../../..');

describe('Copying a field that exists twice', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field: value\n` +
                  `field: value\n` +
                  `\n` +
                  `copy < field`;

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
    
    const text = `There are at least two elements with the key 'field' that qualify for being copied here, it is not clear which to copy.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` ?    1 | field: value\n` +
                    ` ?    2 | field: value\n` +
                    `      3 | \n` +
                    ` >    4 | copy < field`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(3);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(12);
  });
});

describe('Copying a section that exists twice', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `# section\n` +
                  `\n` +
                  `# section\n` +
                  `\n` +
                  `# copy < section`;

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
    
    const text = `There are at least two elements with the key 'section' that qualify for being copied here, it is not clear which to copy.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` ?    1 | # section\n` +
                    `      2 | \n` +
                    ` ?    3 | # section\n` +
                    `      4 | \n` +
                    ` >    5 | # copy < section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(4);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(4);
    expect(error.selection.to.column).toEqual(16);
  });
});