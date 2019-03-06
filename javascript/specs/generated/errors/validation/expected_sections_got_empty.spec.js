const eno = require('../../../..');

describe('Expecting sections but getting an empty element', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `element:`;

    try {
      eno.parse(input).sections('element');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only sections with the key 'element' were expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | element:`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(8);
  });
});