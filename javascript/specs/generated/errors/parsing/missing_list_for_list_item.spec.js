const eno = require('../../../..');

describe('Parsing a list item without any previous element', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `- item`;

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
    
    const text = `Line 1 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    ` >    1 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(0);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(0);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a line continuation', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field:\n` +
                  `| continuation\n` +
                  `- item`;

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
    
    const text = `Line 3 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | field:\n` +
                    `      2 | | continuation\n` +
                    ` >    3 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a fieldset entry', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `entry = value\n` +
                  `- item`;

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
    
    const text = `Line 3 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `      1 | fieldset:\n` +
                    `      2 | entry = value\n` +
                    ` >    3 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(2);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(2);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a copied field', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `field: value\n` +
                  `\n` +
                  `copy < field\n` +
                  `- item`;

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
    
    const text = `Line 4 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `   ...\n` +
                    `      2 | \n` +
                    `      3 | copy < field\n` +
                    ` >    4 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(3);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(3);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a copied fieldset', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `fieldset:\n` +
                  `entry = value\n` +
                  `\n` +
                  `copy < fieldset\n` +
                  `- item`;

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
    
    const text = `Line 5 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `   ...\n` +
                    `      3 | \n` +
                    `      4 | copy < fieldset\n` +
                    ` >    5 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(4);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(4);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by a multiline field', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `-- multiline_field\n` +
                  `value\n` +
                  `-- multiline_field\n` +
                  `\n` +
                  `copy < multiline_field\n` +
                  `- item`;

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
    
    const text = `Line 6 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `   ...\n` +
                    `      4 | \n` +
                    `      5 | copy < multiline_field\n` +
                    ` >    6 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(5);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(5);
    expect(error.selection.to.column).toEqual(6);
  });
});

describe('Parsing a list item preceded by an empty multiline field', () => {
  it('throws the expected ParseError', () => {
    let error = null;

    const input = `-- multiline_field\n` +
                  `-- multiline_field\n` +
                  `\n` +
                  `copy < multiline_field\n` +
                  `- item`;

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
    
    const text = `Line 5 contains a list item without a list being specified before.`;
    
    expect(error.text).toEqual(text);
    
    const snippet = `   Line | Content\n` +
                    `   ...\n` +
                    `      3 | \n` +
                    `      4 | copy < multiline_field\n` +
                    ` >    5 | - item`;
    
    expect(error.snippet).toEqual(snippet);
    
    expect(error.selection.from.line).toEqual(4);
    expect(error.selection.from.column).toEqual(0);
    expect(error.selection.to.line).toEqual(4);
    expect(error.selection.to.column).toEqual(6);
  });
});