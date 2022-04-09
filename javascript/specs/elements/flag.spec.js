import { parse } from '../../lib/esm/main.js';

describe('Flag', () => {
    let flag;
    
    beforeEach(() => {
        flag = parse('flag').flag('flag');
    });
    
    it('is untouched after initialization', () => {
        expect(flag._touched).toBeUndefined();
    });
    
    describe('toString()', () => {
        it('returns a debug abstraction', () => {
            expect(flag.toString()).toEqual('[object Flag key=flag]');
        });
    });
    
    describe('toStringTag symbol', () => {
        it('returns a custom tag', () => {
            expect(Object.prototype.toString.call(flag)).toEqual('[object Flag]');
        });
    });
});
