const eno = require('../javascript');
const fs = require('fs');
const gettextParser = require('gettext-parser');
const path = require('path');

const javascript = require('./generators/javascript.js');
const php = require('./generators/php.js');
const python = require('./generators/python.js');
const ruby = require('./generators/ruby.js');

const { commaSeparated } = require('../../enotype/javascript');
const { Fieldset, TerminalReporter } = require('../javascript');
const { interpolatify } = require('../utilities.js');

eno.register({ commaSeparated });

const titleCase = /^[A-Z](?:-[A-Z]|[a-z])*( [A-Z](?:-[A-Z]|[a-z])*)*$/;

const generate = async () => {
  // 1. Read in the current specification of supported locales and messages

  const input = fs.readFileSync(path.join(__dirname, 'specification.eno'), 'utf-8');
  const specification = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'specification.eno' });

  // 2. Create/update .po files in translations/ based on current specification

  const locales = {};

  const localesSection = specification.requiredSection('Locales');
  const messagesSection = specification.requiredSection('Messages');

  for(let locale of localesSection.elements()) {
    const localeCode = locale.stringKey();
    const localeName = locale.requiredStringValue();

    locales[localeCode] = [];

    let updated = interpolatify`
      # Message locale '${localeCode}' (${localeName})
      #
      # Note to translators:
      # The first message group ('Terminology') contains the wording for the basic building blocks of eno,
      # take extra care to translate these few items exceptionally well, also taking the liberty to partially
      # or fully keep the english terms if there are no deeply meaningful, accurate and customary translations
      # for the given concept in your language.
      #
      # With this foundation laid out well, you will find the rest of the translations to be merely
      # repetitive finger exercises. :)
      #
      # Thank you for your contibution; to success!
    `;

    updated += '\n\n'

    let existingPo;
    const poFile = path.join(__dirname, `translations/${localeCode}.po`);
    if(fs.existsSync(poFile)) { // TODO: asyncify
      const content = await fs.promises.readFile(poFile, 'utf-8');
      existingPo = gettextParser.po.parse(content);
    } else {
      console.log(`\x1b[36m(eno locales) INFO: Locale '${localeCode}' (${localeName}) does not exist yet, creating at ${poFile}.\x1b[0m`);
    }

    for(let group of messagesSection.elements()) {
      const groupName = group.stringKey();

      updated += `# Message group '${groupName}'\n\n`;

      let previousMessageSpec;
      for(let messageSpec of group.elements()) {
        const messageName = messageSpec.stringKey();

        if(!titleCase.exec(messageName))
          throw messageSpec.error(`Message '${messageName}' in group '${groupName}' is not in title case (every word starting with an uppercase letter, e.g. "My Title", "A Non-Section").`);

        if(previousMessageSpec && previousMessageSpec.stringKey() > messageName) {
          throw messageSpec.error(`Message '${messageName}' in group '${groupName}' is alphabetically incorrectly ordered.`);
        } else {
          previousMessageSpec = messageSpec;
        }

        let arguments, message;
        if(messageSpec instanceof Fieldset) {
          arguments = messageSpec.entry('arguments').requiredCommaSeparatedValue();
          message = messageSpec.entry('message').requiredStringValue();
        } else {
          message = messageSpec.requiredStringValue();
        }

        let translation = '';

        if(existingPo) {
          existingTranslation = existingPo.translations[''][message];

          if(existingTranslation === undefined || existingTranslation.msgstr[0].match(/^\s*$/)) {
            if(localeCode === 'en') {
              translation = message;
            } else {
              console.log(`\x1b[33m(eno locales) WARNING: Locale '${localeCode}' has no translation for '${message}' (${poFile}).\x1b[0m`);
            }
          } else {
            translation = existingTranslation.msgstr[0];

            if(arguments) {
              for(let argument of arguments) {
                if(!translation.includes(`[${argument}]`)) {
                  console.log(`\x1b[33m(eno locales) WARNING: Locale '${localeCode}' does not use argument '${argument}' in message '${translation}' (${poFile}).\x1b[0m`);
                }
              }
            }
          }
        }

        if(groupName !== 'Terminology') {
          locales[localeCode].push({
            arguments: arguments,
            name: messageName,
            translation: translation
          });
        }

        updated += `msgid "${message}"\n`;
        updated += `msgstr "${translation}"\n\n`;
      }
    }

    locales[localeCode].sort((a,b) => {
      if(a.arguments && !b.arguments)
        return 1;
      else if(b.arguments && !a.arguments)
        return -1;

      return a.name > b.name ? 1 : -1;
    });

    fs.writeFileSync(poFile, updated);
  }

  specification.assertAllTouched();

  // 3. Generate message catalog code for all currently supported programming languages

  const meta = ` GENERATED ON ${(new Date()).toISOString().substr(0, 19)} - DO NOT EDIT MANUALLY`;

  await javascript(meta, locales);
  await php(meta, locales);
  await python(meta, locales);
  await ruby(meta, locales);
};

generate();
