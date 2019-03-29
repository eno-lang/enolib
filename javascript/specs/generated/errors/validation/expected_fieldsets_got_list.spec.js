const enolib = require('../../../..');

describe('Expecting fieldsets but getting a list with one item', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `- item`;

    try {
      enolib.parse(input).fieldsets('list');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only fieldsets with the key 'list' were expected.`;
    
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

describe('Expecting fieldsets but getting a list with empty lines and multiple items', () => {
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
      enolib.parse(input).fieldsets('list');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only fieldsets with the key 'list' were expected.`;
    
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

describe('Expecting fieldsets but getting a list with two items with comments', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `list:\n` +
                  `> comment\n` +
                  `- item\n` +
                  `\n` +
                  `> comment\n` +
                  `- item`;

    try {
      enolib.parse(input).fieldsets('list');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `Only fieldsets with the key 'list' were expected.`;
    
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