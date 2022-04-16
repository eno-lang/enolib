import { parse, ParseError, ValidationError } from '../../../..';

describe('Expecting sections but getting a field', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value`;
        
        try {
            parse(input).sections('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'field' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(12);
    });
});

describe('Expecting sections but getting a field with continuations', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field:\n` +
                      `| continuation\n` +
                      `| continuation`;
        
        try {
            parse(input).sections('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'field' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field:\n` +
                        ` *    2 | | continuation\n` +
                        ` *    3 | | continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(2);
        expect(error.selection.to.column).toEqual(14);
    });
});

describe('Expecting sections but getting a field with continuations separated by idle lines', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `field: value\n` +
                      `| continuation\n` +
                      `| continuation\n` +
                      `\n` +
                      `> comment\n` +
                      `| continuation`;
        
        try {
            parse(input).sections('field');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'field' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | field: value\n` +
                        ` *    2 | | continuation\n` +
                        ` *    3 | | continuation\n` +
                        ` *    4 | \n` +
                        ` *    5 | > comment\n` +
                        ` *    6 | | continuation`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(14);
    });
});

describe('Expecting sections but getting a field with one attribute', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:\n` +
                      `attribute = value`;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:\n` +
                        ` *    2 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Expecting sections but getting a field with empty lines and three attributes', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:\n` +
                      `\n` +
                      `attribute = value\n` +
                      `\n` +
                      `attribute = value\n` +
                      `\n` +
                      `attribute = value\n` +
                      ``;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:\n` +
                        ` *    2 | \n` +
                        ` *    3 | attribute = value\n` +
                        ` *    4 | \n` +
                        ` *    5 | attribute = value\n` +
                        ` *    6 | \n` +
                        ` *    7 | attribute = value\n` +
                        `      8 | `;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(6);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Expecting sections but getting a field with two attribute with comments', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:\n` +
                      `> comment\n` +
                      `attribute = value\n` +
                      `\n` +
                      `> comment\n` +
                      `attribute = value`;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:\n` +
                        ` *    2 | > comment\n` +
                        ` *    3 | attribute = value\n` +
                        ` *    4 | \n` +
                        ` *    5 | > comment\n` +
                        ` *    6 | attribute = value`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(17);
    });
});

describe('Expecting sections but getting a field with one item', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:\n` +
                      `- item`;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:\n` +
                        ` *    2 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(1);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting sections but getting a field with empty lines and three items', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:\n` +
                      `\n` +
                      `- item\n` +
                      `\n` +
                      `- item\n` +
                      `\n` +
                      `- item\n` +
                      ``;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:\n` +
                        ` *    2 | \n` +
                        ` *    3 | - item\n` +
                        ` *    4 | \n` +
                        ` *    5 | - item\n` +
                        ` *    6 | \n` +
                        ` *    7 | - item\n` +
                        `      8 | `;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(6);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting sections but getting a field with two items with comments', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element:\n` +
                      `> comment\n` +
                      `- item\n` +
                      `\n` +
                      `> comment\n` +
                      `- item`;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element:\n` +
                        ` *    2 | > comment\n` +
                        ` *    3 | - item\n` +
                        ` *    4 | \n` +
                        ` *    5 | > comment\n` +
                        ` *    6 | - item`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(5);
        expect(error.selection.to.column).toEqual(6);
    });
});

describe('Expecting sections but getting a flag', () => {
    it('throws the expected ValidationError', () => {
        let error = null;
        
        const input = `element`;
        
        try {
            parse(input).sections('element');
        } catch(_error) {
            if (_error instanceof ValidationError) {
                error = _error;
            } else {
                throw _error;
            }
        }
        
        expect(error).toBeInstanceOf(ValidationError);
        
        const text = `Only sections with the key 'element' were expected.`;
        
        expect(error.text).toEqual(text);
        
        const snippet = `   Line | Content\n` +
                        ` >    1 | element`;
        
        expect(error.snippet).toEqual(snippet);
        
        expect(error.selection.from.line).toEqual(0);
        expect(error.selection.from.column).toEqual(0);
        expect(error.selection.to.line).toEqual(0);
        expect(error.selection.to.column).toEqual(7);
    });
});