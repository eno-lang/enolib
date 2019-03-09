const { Context } = require('../../lib/context.js');

exports.analyze = input => {
  const context = new Context(input, {});

  return {
    _document: context._document,
    _lineCount: context._lineCount,
    _meta: context._meta
  };
};
