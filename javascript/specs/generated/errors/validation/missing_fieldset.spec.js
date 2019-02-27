const eno = require('../../../..');

describe('Querying a section for a required but missing fieldset', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section`;

    try {
      eno.parse(input).section('section').requiredFieldset('fieldset');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `The fieldset 'fieldset' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` *    1 | # section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(9);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(9);
  });
});