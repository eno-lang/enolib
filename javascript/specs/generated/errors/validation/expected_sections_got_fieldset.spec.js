const enolib = require('../../../..');

describe('Expecting sections but getting a fieldset with one item', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `entry = value`;

    try {
      enolib.parse(input).sections('fieldset');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only sections with the key 'fieldset' were expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | fieldset:\n` +
                    ` *    2 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(13);
  });
});

describe('Expecting sections but getting a fieldset with empty lines and multiple entries', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `\n` +
                  `entry = value\n` +
                  `\n` +
                  `entry = value\n` +
                  `\n` +
                  `entry = value\n` +
                  ``;

    try {
      enolib.parse(input).sections('fieldset');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only sections with the key 'fieldset' were expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | fieldset:\n` +
                    ` *    2 | \n` +
                    ` *    3 | entry = value\n` +
                    ` *    4 | \n` +
                    ` *    5 | entry = value\n` +
                    ` *    6 | \n` +
                    ` *    7 | entry = value\n` +
                    `      8 | `;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(6);
    expect(error.selection.to.column).toEqual(13);
  });
});

describe('Expecting sections but getting a fieldset with two entries with comments', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `> comment\n` +
                  `entry = value\n` +
                  `\n` +
                  `> comment\n` +
                  `entry = value`;

    try {
      enolib.parse(input).sections('fieldset');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only sections with the key 'fieldset' were expected.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | fieldset:\n` +
                    ` *    2 | > comment\n` +
                    ` *    3 | entry = value\n` +
                    ` *    4 | \n` +
                    ` *    5 | > comment\n` +
                    ` *    6 | entry = value`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(5);
    expect(error.selection.to.column).toEqual(13);
  });
});