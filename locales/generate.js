import { TerminalReporter, parse, register } from '../javascript/lib/esm/main.js';
import fs from 'fs';
import gettextParser from 'gettext-parser';

import { javascript } from './generators/javascript.js';
import { php } from './generators/php.js';
import { python } from './generators/python.js';
import { ruby } from './generators/ruby.js';

import { commaSeparated } from 'enotype';
import { interpolatify } from '../utilities.js';

register({ commaSeparated });

const snakeCase = /^[_a-z]*$/;
const titleCase = /^[A-Z](?:-[A-Z]|[a-z])*( [A-Z](?:-[A-Z]|[a-z])*)*$/;

const generate = () => {
    // 1. Read in the current specification of supported locales and messages
    
    const input = fs.readFileSync(new URL('specification.eno', import.meta.url), 'utf-8');
    const specification = parse(input, { reporter: TerminalReporter, source: 'specification.eno' });
    
    // 2. Create/update .po files in translations/ based on current specification
    
    const locales = {};
    
    const localesSection = specification.requiredSection('locales');
    const messagesSection = specification.requiredSection('messages');
    
    for (const localeField of localesSection.fields()) {
        const localeCode = localeField.stringKey();
        const localeName = localeField.requiredStringValue();
        
        locales[localeCode] = [];
        
        let updated = interpolatify`
        # Message locale '${localeCode}' (${localeName})
        #
        # Note to translators:
        # The first message group ('terminology') contains the wording for the basic building blocks of eno,
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
        const poFile = new URL(`translations/${localeCode}.po`, import.meta.url);
        if (fs.existsSync(poFile)) {
            const content = fs.readFileSync(poFile, 'utf-8');
            existingPo = gettextParser.po.parse(content);
        } else {
            console.log(`\x1b[36m(eno locales) INFO: Locale '${localeCode}' (${localeName}) does not exist yet, creating at ${poFile}.\x1b[0m`);
        }
            
        for (const groupSection of messagesSection.sections()) {
            const groupName = groupSection.stringKey();
            
            updated += `# Message group '${groupName}'\n\n`;
            
            let previousMessageSpec;
            for (const messageSpec of groupSection.elements()) {
                const messageName = messageSpec.stringKey();
                
                if (!snakeCase.test(messageName))
                    throw messageSpec.error(`Message '${messageName}' in group '${groupName}' is not in snake_case (only lower case letters and underscores).`);
                
                if (previousMessageSpec && previousMessageSpec.stringKey() > messageName) {
                    throw messageSpec.error(`Message '${messageName}' in group '${groupName}' is alphabetically incorrectly ordered.`);
                } else {
                    previousMessageSpec = messageSpec;
                }
                
                let args, message;
                if (messageSpec.hasAttributes()) {
                    args = messageSpec.attribute().commaSeparatedKey();
                    message = messageSpec.attribute().requiredStringValue();
                } else {
                    message = messageSpec.requiredStringValue();
                }
                
                let translation = '';
                
                if (existingPo) {
                    const existingTranslation = existingPo.translations[''][message];
                    
                    if (existingTranslation === undefined || existingTranslation.msgstr[0].match(/^\s*$/)) {
                        if (localeCode === 'en') {
                            translation = message;
                        } else {
                            console.log(`\x1b[33m(eno locales) WARNING: Locale '${localeCode}' has no translation for '${message}' (${poFile}).\x1b[0m`);
                        }
                    } else {
                        translation = existingTranslation.msgstr[0];
                        
                        if (args) {
                            for (const arg of args) {
                                if (!translation.includes(`[${arg}]`)) {
                                    console.log(`\x1b[33m(eno locales) WARNING: Locale '${localeCode}' does not use argument '${arg}' in message '${translation}' (${poFile}).\x1b[0m`);
                                }
                            }
                        }
                    }
                }
                
                if (groupName !== 'terminology') {
                    locales[localeCode].push({
                        arguments: args,
                        name: messageName,
                        translation: translation
                    });
                }
                
                updated += `msgid "${message}"\n`;
                updated += `msgstr "${translation}"\n\n`;
            }
        }
        
        locales[localeCode].sort((a,b) => {
            if (a.arguments && !b.arguments)
            return 1;
            else if (b.arguments && !a.arguments)
            return -1;
            
            return a.name > b.name ? 1 : -1;
        });
        
        fs.writeFileSync(poFile, updated);
    }
    
    specification.assertAllTouched();
    
    // 3. Generate message catalog code for all currently supported programming languages
    
    const meta = ` GENERATED ON ${(new Date()).toISOString().substring(0, 19)} - DO NOT EDIT MANUALLY`;
    
    javascript(meta, locales);
    php(meta, locales);
    python(meta, locales);
    ruby(meta, locales);
};

generate();
