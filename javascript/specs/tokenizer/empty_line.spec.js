import { inspectTokenization } from './util.js';

let input = '\n' +
            ' \n' +
            '  \n' +
            '   \n' +
            '\n' +
            ' \n' +
            '  \n' +
            '   \n';

describe('Empty line tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
    
    describe('Zero-length input', () => {
        it('performs as specified', () => {
            expect(inspectTokenization('')).toMatchSnapshot();
        });
    })
});
