const enolib = require('../../..');

describe('Querying a comment with complex indentation from a section', () => {
  it('produces the expected result', () => {
    const input = `               >\n` +
                  `    > indented 0 spaces\n` +
                  `>\n` +
                  `  >       indented 4 spaces \n` +
                  `>       indented 2 spaces\n` +
                  `                              > indented 26 spaces\n` +
                  `                                 >\n` +
                  `# section`;

    const output = enolib.parse(input).section('section').requiredStringComment();

    const expected = `indented 0 spaces\n` +
                     `\n` +
                     `    indented 4 spaces\n` +
                     `  indented 2 spaces\n` +
                     `                          indented 26 spaces`;
    
    expect(output).toEqual(expected);
  });
});