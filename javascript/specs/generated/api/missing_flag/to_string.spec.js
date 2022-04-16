import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('A missing flag queried without a key leaves out the key in the debug string representation', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const output = parse(input).flag().toString();
        
        expect(output).toEqual('[object MissingFlag]');
    });
});

describe('A missing flag queried with a key includes the key in the debug string representation', () => {
    it('produces the expected result', () => {
        const input = ``;
        
        const output = parse(input).flag('key').toString();
        
        expect(output).toEqual('[object MissingFlag key=key]');
    });
});