const enolib = require('../..');
const { HtmlReporter } = require('../..');

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

describe('HTML reporter', () => {
  it('produces html output', () => {
    const document = enolib.parse(input, { reporter: HtmlReporter });

    const snippet = new document._context.reporter(document._context).reportElement(document._context._document.elements[0]).snippet();

    expect(snippet).toMatchSnapshot();
  });
});
