const eno = require('../../../..');

describe('Querying a fieldset entry for a required but missing value', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `entry =`;

    try {
      eno.parse(input).fieldset('fieldset').entry('entry').requiredStringValue();
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `The fieldset entry 'entry' must contain a value.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | fieldset:\n` +
                    ` >    2 | entry =`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(7);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(7);
  });
});