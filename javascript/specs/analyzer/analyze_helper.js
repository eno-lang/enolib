const { analyze } = require('../../lib/analyze.js');

exports.analyze = input => {
  const context = { input: input };

  analyze(context);

  return context.instructions;
};
