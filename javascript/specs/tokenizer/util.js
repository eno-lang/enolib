const { analyze } = require('../../lib/analyze.js');

exports.inspectTokenization = input => {
  const context = { input: input };

  analyze(context);

  return context;
};
