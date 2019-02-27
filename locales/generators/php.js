const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { interpolatify } = require('../../utilities.js');

const camelCase = string => string.toLowerCase().replace(/[ \-][a-z]/g, boundary => boundary.charAt(1).toUpperCase());
const screamingSnakeCase = string => string.toUpperCase().replace(/[ \-]/g, '_');
const snakeCase = string => string.toLowerCase().replace(/[ \-]/g, '_');
const titleCase = string => string.replace(/^./, initial => initial.toUpperCase());

module.exports = async (meta, locales) => {
  const directory = path.join(__dirname, `../../php/src/messages`)
  await fsExtra.emptyDir(directory);

  const messageFunction = message => {
    let translation = message.translation

    if(message.arguments) {
      const arguments = message.arguments.map(argument => {
        const snakeCased = snakeCase(argument);
        translation = translation.replace(new RegExp(`\\[${argument}\\]`, 'g'), `{$${snakeCased}}`);
        return `$${snakeCased}`;
      });

      return `public static function ${camelCase(message.name)}(${arguments.join(', ')}) { return "${translation}"; }`;
    } else {
      return `const ${screamingSnakeCase(message.name)} = '${translation.replace(/'/g, "\\'")}';`;
    }
  };

  for(const [locale, messages] of Object.entries(locales)) {
    const code = interpolatify`
      <?php declare(strict_types=1);

      // ${meta}

      namespace Eno\\Messages;

      class ${titleCase(locale)} {
        ${messages.map(messageFunction).join('\n')}
      }
    `;

    await fs.promises.writeFile(path.join(directory, `${titleCase(locale)}.php`), code);
  }
};
