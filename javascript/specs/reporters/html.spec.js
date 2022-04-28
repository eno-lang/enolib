import { parse, HtmlReporter } from '../..';

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

describe('HTML reporter', () => {
    it('produces html output', () => {
        const document = parse(input, { reporter: HtmlReporter });
        
        const snippet = new document._context.reporter(document._context).reportElement(document._context._document.elements[0]).snippet();
        
        expect(snippet).toMatchSnapshot();
    });
});
