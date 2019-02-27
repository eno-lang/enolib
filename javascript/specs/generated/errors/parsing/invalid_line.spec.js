const eno = require('../../../..');

describe('A line without operators', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `list:\n` +
                  `- item\n` +
                  `- item\n` +
                  `illegal`;

    try {
      eno.parse(input);
    } catch(_error) {
      if(_error instanceof eno.ParseError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ParseError);
    
    const text = `Line 4 does not follow any specified pattern.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `   ...\n` +
                    `      2 | - item\n` +
                    `      3 | - item\n` +
                    ` >    4 | illegal`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(3);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(7);
  });
});