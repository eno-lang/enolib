const eno = require('../../../..');

describe('Expecting fields but getting a list with one item', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `- item`;

    try {
      eno.parse(input).fields('list');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only fields with the key 'list' were expected, but a list with this key was found.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | list:\n` +
                    ` *    2 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(1);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Expecting fields but getting a list with empty lines and multiple items', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `\n` +
                  `- item\n` +
                  `\n` +
                  `- item\n` +
                  `\n` +
                  `- item\n` +
                  ``;

    try {
      eno.parse(input).fields('list');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only fields with the key 'list' were expected, but a list with this key was found.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | list:\n` +
                    ` *    2 | \n` +
                    ` *    3 | - item\n` +
                    ` *    4 | \n` +
                    ` *    5 | - item\n` +
                    ` *    6 | \n` +
                    ` *    7 | - item\n` +
                    `      8 | `;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(6);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Expecting fields but getting a list with two items with comments', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `> comment\n` +
                  `- item\n` +
                  `\n` +
                  `> comment\n` +
                  `- item`;

    try {
      eno.parse(input).fields('list');
    } catch(_error) {
      if(_error instanceof eno.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(eno.ValidationError);
    
    const text = `Only fields with the key 'list' were expected, but a list with this key was found.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | list:\n` +
                    ` *    2 | > comment\n` +
                    ` *    3 | - item\n` +
                    ` *    4 | \n` +
                    ` *    5 | > comment\n` +
                    ` *    6 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(5);
    expect(error.selection.to.column).toEqual(6);
  });
});