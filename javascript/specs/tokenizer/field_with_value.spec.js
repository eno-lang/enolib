import { inspectTokenization } from './util.js';

const input = `
key: value

key:    value

key    : value

    key    :    value

key: value
`.trim();

describe('Field with value tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
