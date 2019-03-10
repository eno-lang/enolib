const enolib = require('../..');

const input = `
Field: [value]
\\ [spaced_line_continuation]
| [direct_line_continuation]

Fieldset:
Entry = [value]
\\ [spaced_line_continuation]
| [direct_line_continuation]

List:
- [value]
\\ [spaced_line_continuation]
| [direct_line_continuation]

Empty field:
\\ [spaced_line_continuation]
| [direct_line_continuation]

Fieldset with empty entry:
Empty entry =
\\ [spaced_line_continuation]
| [direct_line_continuation]

List with empty item:
-
\\ [spaced_line_continuation]
| [direct_line_continuation]
`.trim();

describe('Blackbox test', () => {
  describe('Continuations', () => {
    it('performs as expected', () => {
      expect(enolib.parse(input).raw()).toMatchSnapshot();
    });
  });
});
