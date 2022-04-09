import { Context } from './context.js';
import { Section } from './elements/section.js';

/**
 * Main parser entry point
 * @param {string} input The *content* of an eno document as a string
 * @param {object} options Optional parser settings
 * @param {string} options.source A source label to include in error messages - provide (e.g.) a filename or path to let users know in which file the error occured.
 */
export function parse(input: string, options = {}) {
    const context = new Context(input, options);

    return new Section(context, context._document);
};
