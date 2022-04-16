import { parse, ParseError, ValidationError } from '../../../../lib/esm/main.js';

describe('Querying a value from a field with a loader that always produces an error', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value`;
        
        try {
            const loader = value => { throw `my error for '${value}'`; };
            
            parse(input).field('field').requiredValue(loader);
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my error for 'value'`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(7);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(12);
    });
});

describe('Requesting a value error from a field with a static message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value`;
        
        try {
            throw parse(input).field('field').valueError('my static message');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my static message`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(7);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(12);
    });
});

describe('Requesting a value error from a field with a dynamically generated message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value`;
        
        try {
            throw parse(input).field('field').valueError(value => `my generated message for '${value}'`);
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my generated message for 'value'`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(7);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(12);
    });
});

describe('Requesting a value error from an embed with a static message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        try {
            throw parse(input).embed('embed').valueError('my static message');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my static message`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | -- embed\n` +
                        ` >    2 | value\n` +
                        `      3 | -- embed`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(5);
    });
});

describe('Requesting a value error from an embed with a dynamically generated message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `-- embed\n` +
                      `value\n` +
                      `-- embed`;
        
        try {
            throw parse(input).embed('embed').valueError(value => `my generated message for '${value}'`);
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my generated message for 'value'`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        `      1 | -- embed\n` +
                        ` >    2 | value\n` +
                        `      3 | -- embed`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(1);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(5);
    });
});

describe('Requesting a value error from an empty embed with a static message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `-- embed\n` +
                      `-- embed`;
        
        try {
            throw parse(input).embed('embed').valueError('my static message');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my static message`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | -- embed\n` +
                        ` *    2 | -- embed`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(8);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(8);
    });
});

describe('Requesting a value error from an empty embed with a dynamically generated message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `-- embed\n` +
                      `-- embed`;
        
        try {
            throw parse(input).embed('embed').valueError(_value => `my generated message`);
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my generated message`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | -- embed\n` +
                        ` *    2 | -- embed`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(8);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(8);
    });
});

describe('Requesting a value error from a field with continuations with a static message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value\n` +
                      `\\ continuation\n` +
                      `\\ continuation\n` +
                      `|\n` +
                      `\n` +
                      `|`;
        
        try {
            throw parse(input).field('field').valueError('my static message');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my static message`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value\n` +
                        ` *    2 | \\ continuation\n` +
                        ` *    3 | \\ continuation\n` +
                        ` *    4 | |\n` +
                        ` *    5 | \n` +
                        ` *    6 | |`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(7);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(1);
    });
});

describe('Requesting a value error from a field with continuations with a dynamically generated message', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value\n` +
                      `\\ continuation\n` +
                      `\\ continuation\n` +
                      `|\n` +
                      `\n` +
                      `|`;
        
        try {
            throw parse(input).field('field').valueError(value => `my generated message for '${value}'`);
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `There is a problem with the value of this element: my generated message for 'value continuation continuation'`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value\n` +
                        ` *    2 | \\ continuation\n` +
                        ` *    3 | \\ continuation\n` +
                        ` *    4 | |\n` +
                        ` *    5 | \n` +
                        ` *    6 | |`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(7);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(1);
    });
});