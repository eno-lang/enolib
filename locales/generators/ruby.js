const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { interpolatify } = require('../../utilities.js');

const screamingSnakeCase = string => string.toUpperCase().replace(/[ \-]/g, '_');
const snakeCase = string => string.toLowerCase().replace(/[ \-]/g, '_');
const titleCase = string => string.replace(/^./, initial => initial.toUpperCase());

module.exports = async (meta, locales) => {
  const directory = path.join(__dirname, '../../ruby/lib/enolib/messages');
  await fsExtra.emptyDir(directory);

  const messageFunction = message => {
    let translation = message.translation

    if(message.arguments) {
      const arguments = message.arguments.map(argument => {
        const snakeCased = snakeCase(argument);
        translation = translation.replace(new RegExp(`\\[${argument}\\]`, 'g'), `#{${snakeCased}}`);
        return snakeCased;
      });

      return `def self.${snakeCase(message.name)}(${arguments.join(', ')}) "${translation}" end`;
    } else {
      return `${screamingSnakeCase(message.name)} = '${translation.replace(/'/g, "\\'")}'`;
    }
  };

  for(const [locale, messages] of Object.entries(locales)) {
    const titleCaseLocale = locale.replace(/^./, initial => initial.toUpperCase());

    const code = interpolatify`
      # frozen_string_literal: true

      # ${meta}

      module Enolib
        module Messages
          module ${titleCase(locale)}
            ${messages.map(messageFunction).join('\n')}
          end
        end
      end
    `;

    await fs.promises.writeFile(path.join(directory, `${locale}.rb`), code);
  }
};
