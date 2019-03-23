const enolib = require('..');

// TODO: Error case lookups (indices -1/length+1 etc. and same for line/column)

const input = `
field: value

list:
- item

- item

fieldset:
entry = value

entry = value

copied_field < field
copied_fieldset < fieldset
copied_list < list

# section

-- empty
-- empty

-- multiline
value
value
-- multiline

copied_multiline < multiline

## subsection
## copy < subsection
`.trim();

const SNIPPET_PADDING_WIDTH = 3
const SNIPPET_PADDING = '▓'.repeat(SNIPPET_PADDING_WIDTH);
const snippetInput = SNIPPET_PADDING + input.replace(/\n/g, '⏎').replace(/\t/g, '⇥').replace(/ /g, '␣') + ' ' + SNIPPET_PADDING;

const snippet = index => {
  index += SNIPPET_PADDING_WIDTH;

  return snippetInput.substring(index - SNIPPET_PADDING_WIDTH, index) +
         '  ' + snippetInput.charAt(index) + '  ' +
         snippetInput.substring(index + 1, index + SNIPPET_PADDING_WIDTH + 1);
};

describe('lookup', () => {
  let column = 0;
  let line = 0;

  let summary = '\nINDEX  SNIPPET            KEY                  RANGE\n\n';

  for(let index = 0; index <= input.length; index++) {
    const indexLookup = enolib.lookup({ index }, input);
    const lineColumnLookup = enolib.lookup({ line, column }, input);

    if(indexLookup.range !== lineColumnLookup.range)
      throw `Lookup by index produced a different range (${indexLookup.range}) than by line/column (${lineColumnLookup.range})`;

    if(indexLookup.element.stringKey() !== lineColumnLookup.element.stringKey())
      throw `Lookup by index produced a different key (${indexLookup.element.stringKey()}) than by line/column (${lineColumnLookup.element.stringKey()})`;

    const { element, range } = indexLookup;
    const key = element.stringKey() === null ? 'document' : element.stringKey();
    summary += `${index.toString().padEnd(5)}  ${snippet(index).padStart(9)}   =>   ${key.padEnd(20)} ${range}\n`;

    if(input.charAt(index) === '\n') {
      line++;
      column = 0;
    } else {
      column++;
    }
  }

  it(`produces the expected summary`, () => {
    expect(summary).toMatchSnapshot();
  });
});
