import { inspectTokenization } from './util.js';

const input = `
-- key
value
-- key

--    key

value

    -- key

    --    key
value

    value
        -- key
`.trim();

describe('Embed tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
