import { parse, HtmlReporter, TerminalReporter } from '../lib/esm/main.js';

describe('Parser options', () => {
    describe('source', () => {
        it('is printed in text reports if provided', () => {
            expect(() => parse(':invalid', { source: 'custom-source.eno' })).toThrowErrorMatchingSnapshot();
        });
        
        it('is printed in html reports if provided', () => {
            expect(() => parse(':invalid', { reporter: HtmlReporter, source: 'custom-source.eno' })).toThrowErrorMatchingSnapshot();
        });
        
        it('is printed in terminal reports if provided', () => {
            expect(() => parse(':invalid', { reporter: TerminalReporter, source: 'custom-source.eno' })).toThrowErrorMatchingSnapshot();
        });
    });
});
