const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { interpolatify } = require('../../utilities.js');

const camelCase = string => string.toLowerCase().replace(/[ \-][a-z]/g, boundary => boundary.charAt(1).toUpperCase());

module.exports = async (meta, locales) => {
  const directory = path.join(__dirname, `../../javascript/lib/locales`)
  await fsExtra.emptyDir(directory);

  const messageFunction = message => {
    let translation = message.translation;

    if(message.arguments) {
      const arguments = message.arguments.map(argument => {
        const camelCased = camelCase(argument);
        translation = translation.replace(new RegExp(`\\[${argument}\\]`, 'g'), `\${${camelCased}}`);
        return camelCased;
      });

      return `${camelCase(message.name)}: (${arguments.join(', ')}) => \`${translation}\``;
    } else {
      return `${camelCase(message.name)}: '${translation.replace(/'/g, "\\'")}'`;
    }
  };

  for(const [locale, messages] of Object.entries(locales)) {
    const code = interpolatify`
      // ${meta}

      exports.${locale} = {
        ${messages.map(messageFunction).join(',\n')}
      };
    `;

    await fs.promises.writeFile(path.join(directory, `${locale}.js`), code);
  }
};
