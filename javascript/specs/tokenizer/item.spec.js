import { inspectTokenization } from './util.js';

const input = `
field:

- value

-    value

    - value

    -    value

- value
`.trim();

describe('Item tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
