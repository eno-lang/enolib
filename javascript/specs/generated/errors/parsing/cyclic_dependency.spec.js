const enolib = require('../../../..');

describe('Multiple sections with multiple cyclical copy chains', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `# section_1 < section_2\n` +
                  `field: value\n` +
                  `\n` +
                  `## subsection_1 < subsection_2\n` +
                  `field: value\n` +
                  `\n` +
                  `# section_2 < section_1\n` +
                  `field: value\n` +
                  `\n` +
                  `## subsection_2 < section_1\n` +
                  `field: value`;

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
    
    const text = `In line 10 'section_1' is copied into itself.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | # section_1 < section_2\n` +
                    `      2 | field: value\n` +
                    `      3 | \n` +
                    ` *    4 | ## subsection_1 < subsection_2\n` +
                    `      5 | field: value\n` +
                    `      6 | \n` +
                    `   ...\n` +
                    `      8 | field: value\n` +
                    `      9 | \n` +
                    ` >   10 | ## subsection_2 < section_1\n` +
                    `     11 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(9);
    expect(error.selection.from.column).toEqual(18);
    expect(error.selection.to.line).toEqual(9);
    expect(error.selection.to.column).toEqual(27);
  });
});

describe('Three ambiguous elements copying each other, two of them cyclically', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `copy < empty\n` +
                  `empty < cyclic\n` +
                  `cyclic < empty`;

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
    
    const text = `In line 3 'empty' is copied into itself.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | copy < empty\n` +
                    ` *    2 | empty < cyclic\n` +
                    ` >    3 | cyclic < empty`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(9);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(14);
  });
});

describe('Three sections with one being copied into its own subsection', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `# section\n` +
                  `## copied_subsection < section\n` +
                  `# copied_section < section`;

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
    
    const text = `In line 2 'section' is copied into itself.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | # section\n` +
                    ` >    2 | ## copied_subsection < section\n` +
                    `      3 | # copied_section < section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(23);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(30);
  });
});

describe('Three sections with one being copied into its own subsubsection', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `# section\n` +
                  `## subsection\n` +
                  `### copied_subsubsection < section`;

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
    
    const text = `In line 3 'section' is copied into itself.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | # section\n` +
                    ` *    2 | ## subsection\n` +
                    ` >    3 | ### copied_subsubsection < section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(27);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(34);
  });
});

describe('Two fieldsets mutually copying each other', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `copy < fieldset\n` +
                  `entry = value\n` +
                  `\n` +
                  `fieldset < copy\n` +
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
    
    const text = `In line 4 'copy' is copied into itself.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | copy < fieldset\n` +
                    `      2 | entry = value\n` +
                    `      3 | \n` +
                    ` >    4 | fieldset < copy\n` +
                    `      5 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(3);
    expect(error.selection.from.column).toEqual(11);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(15);
  });
});

describe('Two lists mutually copying each other', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `copy < list\n` +
                  `- item\n` +
                  `\n` +
                  `list < copy\n` +
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
    
    const text = `In line 4 'copy' is copied into itself.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | copy < list\n` +
                    `      2 | - item\n` +
                    `      3 | \n` +
                    ` >    4 | list < copy\n` +
                    `      5 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(3);
    expect(error.selection.from.column).toEqual(7);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(11);
  });
});