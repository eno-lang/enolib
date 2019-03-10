const enolib = require('../../../..');

describe('Expecting a list but getting an empty section', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section`;

    try {
      enolib.parse(input).list('section');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `A list with the key 'section' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(9);
  });
});

describe('Expecting a list but getting a section with a field and a list', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section\n` +
                  `\n` +
                  `field: value\n` +
                  `\n` +
                  `list:\n` +
                  `- item\n` +
                  `- item`;

    try {
      enolib.parse(input).list('section');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `A list with the key 'section' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # section\n` +
                    ` *    2 | \n` +
                    ` *    3 | field: value\n` +
                    ` *    4 | \n` +
                    ` *    5 | list:\n` +
                    ` *    6 | - item\n` +
                    ` *    7 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(6);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Expecting a list but getting a section with subsections', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section\n` +
                  `\n` +
                  `## subsection\n` +
                  `\n` +
                  `field: value\n` +
                  `\n` +
                  `## subsection\n` +
                  `\n` +
                  `list:\n` +
                  `- item\n` +
                  `- item`;

    try {
      enolib.parse(input).list('section');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `A list with the key 'section' was expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # section\n` +
                    ` *    2 | \n` +
                    ` *    3 | ## subsection\n` +
                    ` *    4 | \n` +
                    ` *    5 | field: value\n` +
                    ` *    6 | \n` +
                    ` *    7 | ## subsection\n` +
                    ` *    8 | \n` +
                    ` *    9 | list:\n` +
                    ` *   10 | - item\n` +
                    ` *   11 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(10);
    expect(error.selection.to.column).toEqual(6);
  });
});