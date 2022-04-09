import { parse } from '../lib/esm/main.js';

describe('Unicode special characters', () => {
    test('Line separator is handled correctly', () => {
        const document = parse(`Unicode line separator: Here it comes   that was it`); // attention: there is a hidden character in between 'comes' and 'that' (!)
        const value = document.field('Unicode line separator').requiredStringValue();
        
        expect(value).toEqual(`Here it comes   that was it`); // attention: there is a hidden character in between 'comes' and 'that' (!)
    });
});
