const { Context } = require('./context.js');

exports.parse = (input, options = {}) => {
  const context = new Context(input, options);

  return context.document();
};
