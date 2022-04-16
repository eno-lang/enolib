import { register } from '../..';

describe('register (with invalid arguments)', () => {
    describe("trying to register 'string'", () => {
        it('throws an error', () => {
            expect(() => register({ string: value => value })).toThrowErrorMatchingSnapshot();
        });
    });
});
