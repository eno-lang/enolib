const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { interpolatify } = require('../../utilities.js');

const screamingSnakeCase = string => string.toUpperCase().replace(/[ \-]/g, '_');
const snakeCase = string => string.toLowerCase().replace(/[ \-]/g, '_');

module.exports = async (meta, locales) => {
  const directory = path.join(__dirname, '../../python/enolib/messages');

  await fsExtra.emptyDir(directory);
  await fsExtra.ensureFile(path.join(directory, '__init__.py'));

  const messageFunction = message => {
    let translation = message.translation

    if(message.arguments) {
      const arguments = message.arguments.map(argument => {
        const snakeCased = snakeCase(argument);
        translation = translation.replace(new RegExp(`\\[${argument}\\]`, 'g'), `{${snakeCased}}`);
        return snakeCased;
      });

      return `${snakeCase(message.name)} = lambda ${arguments.join(', ')}: f"${translation}"`;
    } else {
      return `${screamingSnakeCase(message.name)} = '${translation.replace(/'/g, "\\'")}'`;
    }
  };

  for(const [locale, messages] of Object.entries(locales)) {
    const titleCaseLocale = locale.replace(/^./, initial => initial.toUpperCase());

    const code = interpolatify`
      # ${meta}

      ${messages.map(messageFunction).join('\n')}
    `;

    await fs.promises.writeFile(path.join(directory, `${locale}.py`), code);
  }
};
