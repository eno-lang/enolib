import { inspectTokenization } from './util.js';

const input = `
field:

attribute = value

attribute    = value

    attribute = value

    attribute    = value

    attribute    =    value

attribute = value
`.trim();

describe('Attribute tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
