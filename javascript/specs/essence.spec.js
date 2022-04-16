import { parse } from '..';
import { unpack } from './unpack.js';

const input = `
> Text of Comment

Date: 1st of November in the year 2017

-- Book Description
Lacks a certain ...
something
-- Book Description

Shopping List:

- Apples

- Oranges

Telephone Numbers:
Ben = +49 1943 24724784
Rachel = +59 3459 35935593

# Body
## Limbs
### Left Arm

\`--format pretty\`: Pretty formatting option

\`> Friends\`:
- Jack the Ripper
- Frankenstein

\`\`Use \`\${arg}\` style options\`\`:
'--output dir' = Specify a different output directory
'--filters disabled' = Enable/disable filters
`;

describe('Essence testrun', () => {
    test('succeeds', () => {
        const document = parse(input);
        expect(unpack(document)).toMatchSnapshot();
    });
});
