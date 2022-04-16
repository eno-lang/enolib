import { parse } from '../..';
import { unpack } from '../unpack.js';

const input = `
field_with_value: [value]
\\ [spaced_continuation]
| [direct_continuation]

field_with_attribute:
attribute = [value]
\\ [spaced_continuation]
| [direct_continuation]

field_with_item:
- [item]
\\ [spaced_continuation]
| [direct_continuation]

empty_field:
\\ [spaced_continuation]
| [direct_continuation]

field_with_empty_attribute:
empty_attribute =
\\ [spaced_continuation]
| [direct_continuation]

field_with_empty_item:
-
\\ [spaced_continuation]
| [direct_continuation]
`.trim();

describe('Blackbox test', () => {
    describe('Continuations', () => {
        it('performs as expected', () => {
            const document = parse(input);
            expect(unpack(document)).toMatchSnapshot();
        });
    });
});
