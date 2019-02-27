const eno = require('../../../..');

describe('Triggering an error inside a custom loader when querying a required comment on a field', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `> comment\n` +
                  `field: value`;

    try {
      eno.parse(input).field('field').requiredComment(() => { throw 'my error'; });
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `There is a problem with the comment of this element: my error`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | > comment\n` +
                    ` *    2 | field: value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(2);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(9);
  });
});