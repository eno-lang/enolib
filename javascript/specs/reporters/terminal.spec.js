import { parse, TerminalReporter } from '../..';

const input = `
> comment
# section

field: value

field_with_items:
- item
- item

> comment
- item

## subsection

field_with_attributes:
attribute = value

> comment
attribute = value
`.trim()

describe('Terminal reporter', () => {
    it('produces colored terminal output', () => {
        const document = parse(input, { reporter: TerminalReporter });
        
        const snippet = new document._context.reporter(document._context).reportElement(document._context._document.elements[0]).snippet();
        
        // Uncomment this to inspect the snippet correctness in a terminal for review
        // console.log(snippet);
        
        expect(snippet).toMatchSnapshot();
    });
});
