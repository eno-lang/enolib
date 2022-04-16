import { Context } from '../../lib/context.js';

export function inspectTokenization(input) {
    const context = new Context(input, {});
    
    return {
        _document: context._document,
        _lineCount: context._lineCount,
        _meta: context._meta
    };
};
