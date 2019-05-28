const enolib = require('../javascript');
const glob = require('fast-glob');
const fs = require('fs');
const path = require('path');

const { TerminalReporter } = require('../javascript');

const LANGUAGES = ['javascript', 'php', 'python', 'ruby']; // TODO: 'rust'
const LOCALES = ['de', 'en', 'es'];

const selection = value => {
  const match = value.match(/\[([0-9]+),([0-9]+)\] => \[([0-9]+),([0-9]+)\]/);

  if(!match)
    throw new Error('Illegal selection data - allowed format: [line,column] => [line,column]');

  return [[parseInt(match[1]), parseInt(match[2])], [parseInt(match[3]), parseInt(match[4])]];
};

module.exports = async () => {
  const specs = [];

  const blueprints = await glob('**/*.eno', { cwd: path.join(__dirname, 'blueprints') })

  for(const file of blueprints.sort()) {
    const specDocument = enolib.parse(
      await fs.promises.readFile(path.join(__dirname, 'blueprints', file), 'utf-8'),
      { reporter: TerminalReporter, source: file }
    );

    const tests = [];

    for(testSection of specDocument.sections()) {
      const test = {
        description: testSection.stringKey(),
        input: testSection.field('input').requiredStringValue()
      };

      const errorSection = testSection.optionalSection('ParseError') ||
                           testSection.optionalSection('ValidationError');

      if(errorSection) {
        test.error = {
          selection: errorSection.field('selection').optionalValue(selection),
          snippet: errorSection.field('snippet').optionalStringValue(),
          text: errorSection.field('text').optionalStringValue(),
          type: errorSection.stringKey()
        };
      }

      if(!test.error || test.error.type == 'ValidationError') {
        test.javascript = testSection.field('javascript').requiredStringValue();
        test.php = testSection.field('php').requiredStringValue();
        test.python = testSection.field('python').requiredStringValue();
        test.ruby = testSection.field('ruby').requiredStringValue();
      }

      const resultSection = testSection.optionalSection('Result');

      if(resultSection) {
        const stringField = resultSection.optionalField('string');

        if(stringField) {
          test.result = {
            string: stringField.requiredStringValue()
          };
        } else {
          test.result = {
            javascript: resultSection.field('javascript').requiredStringValue(),
            php: resultSection.field('php').requiredStringValue(),
            python: resultSection.field('python').requiredStringValue(),
            ruby: resultSection.field('ruby').requiredStringValue(),
          };
        }
      }

      const nothingSection = testSection.optionalSection('Nothing');

      if(nothingSection) {
        test.result = { nothing: true };

        nothingSection.touch();
      }

      const passesSection = testSection.optionalSection('Passes');

      if(passesSection) {
        test.result = { passes: true };

        passesSection.touch();
      }

      tests.push(test);
    }

    specDocument.assertAllTouched();

    specs.push({
      path: file.substring(0, file.length - 4),
      tests
    });
  }

  return specs;
};
