import { register } from '../../lib/esm/main.js';

describe('register (with invalid arguments)', () => {
    describe("trying to register 'string'", () => {
        it('throws an error', () => {
            expect(() => register({ string: value => value })).toThrowErrorMatchingSnapshot();
        });
    });
});
