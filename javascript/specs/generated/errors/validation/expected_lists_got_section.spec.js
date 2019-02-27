const eno = require('../../../..');

describe('Expecting lists but getting an empty section', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section`;

    try {
      eno.parse(input).lists('section');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only lists with the key 'section' were expected, but a section with this key was found.`;
    
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

describe('Expecting lists but getting a section with a field and a list', () => {
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
      eno.parse(input).lists('section');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only lists with the key 'section' were expected, but a section with this key was found.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # section\n` +
                    `      2 | \n` +
                    `      3 | field: value\n` +
                    `   ...`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(6);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Expecting lists but getting a section with subsections', () => {
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
      eno.parse(input).lists('section');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only lists with the key 'section' were expected, but a section with this key was found.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | # section\n` +
                    `      2 | \n` +
                    `      3 | ## subsection\n` +
                    `   ...`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(10);
    expect(error.selection.to.column).toEqual(6);
  });
});