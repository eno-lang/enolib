const { Context } = require('../../lib/context.js');

exports.inspectTokenization = input => {
  const context = new Context(input, {});

  return {
    _document: context._document,
    _lineCount: context._lineCount,
    _meta: context._meta
  };
};
