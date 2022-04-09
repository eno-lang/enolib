import { inspectTokenization } from './util.js';

const input = `
field:

| value

|    value

    | value

    |    value

| value
`.trim();

describe('Direct continuation tokenization', () => {
    it('is performed as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
