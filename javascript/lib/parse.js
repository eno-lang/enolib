const { analyze } = require('./analyze.js');
const { en } = require('./messages/en.js');
const { resolve } =  require('./resolve.js');
const { Section } = require('./elements/section.js');
const { TextReporter } = require('./reporters/text_reporter.js');

exports.parse = (input, options = {}) => {
  const context = {
    input,
    messages: options.hasOwnProperty('locale') ? options.locale : en,
    reporter: options.hasOwnProperty('reporter') ? options.reporter : TextReporter,
    source: options.hasOwnProperty('source') ? options.source : null
  };

  analyze(context);

  if(context.hasOwnProperty('copy')) {
    resolve(context);
  }

  return new Section(context, context.document);
};
