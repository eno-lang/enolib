const enolib = require('../../../..');

describe('Expecting a section but getting two sections', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section\n` +
                  `\n` +
                  `# section\n` +
                  ``;

    try {
      enolib.parse(input).section('section');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only a single section with the key 'section' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # section\n` +
                    `      2 | \n` +
                    ` >    3 | # section\n` +
                    `      4 | `;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(9);
  });
});

describe('Expecting a section but getting two sections with elements, empty lines and continuations', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `> comment\n` +
                  `# section\n` +
                  `\n` +
                  `field: value\n` +
                  `\n` +
                  `# section\n` +
                  `\n` +
                  `list:\n` +
                  `- item\n` +
                  `\\ continuation\n` +
                  `\n` +
                  `- item`;

    try {
      enolib.parse(input).section('section');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only a single section with the key 'section' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | > comment\n` +
                    ` >    2 | # section\n` +
                    ` *    3 | \n` +
                    ` *    4 | field: value\n` +
                    `      5 | \n` +
                    ` >    6 | # section\n` +
                    ` *    7 | \n` +
                    ` *    8 | list:\n` +
                    ` *    9 | - item\n` +
                    ` *   10 | \\ continuation\n` +
                    ` *   11 | \n` +
                    ` *   12 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(12);
  });
});