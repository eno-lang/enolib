const eno = require('../../..');

describe('Touching elements in a section that were copied from another section does not touch the original elements', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `# section\n` +
                  `field: value\n` +
                  `\n` +
                  `# copy < section`;

    try {
      const document = eno.parse(input);
      
      document.section('section').stringKey();
      document.section('copy').field('field').stringKey();
      
      document.assertAllTouched();
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | # section\n` +
                    ` >    2 | field: value\n` +
                    `      3 | \n` +
                    `      4 | # copy < section`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(1);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(12);
  });
});