import { parse } from '../lib/esm/main.js';

const input = `
> comment

# section
## section
### section

field: value

field:
attribute = value
attribute = value

field:
- item
- item

-- embed
value
-- embed
`.trim();

describe('A basic testrun', () => {
    test('succeeds', () => {
        const document = parse(input);
        
        expect(document.requiredStringComment()).toMatch('comment');
    });
});
