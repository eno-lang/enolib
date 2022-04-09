import { inspectTokenization } from './util.js';

const input = `
fieldset:

entry = value

entry    = value

    entry = value

    entry    = value

    entry    =    value

entry = value
`.trim();

describe('Attribute tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
