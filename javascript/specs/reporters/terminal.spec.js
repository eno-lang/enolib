const enolib = require('../..');
const { TerminalReporter } = require('../..');

const input = `
> comment
# section

field: value

list:
- item
- item

> comment
- item

## subsection

fieldset:
entry = value

> comment
entry = value
`.trim()

describe('Terminal reporter', () => {
  it('produces colored terminal output', () => {
    const document = enolib.parse(input, { reporter: TerminalReporter });

    const snippet = new document._context.reporter(document._context).reportElement(document._context._document.elements[0]).snippet();

    // Uncomment this to inspect the snippet correctness in a terminal for review
    // console.log(snippet);

    expect(snippet).toMatchSnapshot();
  });
});
