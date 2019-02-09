const { Context } = require('./context.js');

/**
 * Main parser entry point
 * @param {string} input The *content* of an eno document as a string
 * @param {object} options Optional parser settings
 * @param {object} options.locale A custom locale for error messages
 * @param {string} options.source A source label to include in error messages - provide (e.g.) a filename or path to let users know in which file the error occured.
 */
exports.parse = (input, options = {}) => {
  const context = new Context(input, options);

  return context.document();
};
