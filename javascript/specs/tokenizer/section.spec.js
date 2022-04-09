import { inspectTokenization } from './util.js';

const input = `
# key

    ## key

###    key

    ####    key

# key
`.trim();

describe('Section tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
