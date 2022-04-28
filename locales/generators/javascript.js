import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { interpolatify } from '../../utilities.js';

const camelCase = string => string.replace(/_[a-z]/g, boundary => boundary.charAt(1).toUpperCase());

export function javascript(meta, locales) {
    const defaultMessages = path.resolve('javascript/lib/messages.js');
    const localesDirectory = path.resolve('javascript/locales');
    
    fsExtra.emptyDirSync(localesDirectory);
    
    const messageFunction = message => {
        let translation = message.translation;
        
        if (message.arguments) {
            const args = message.arguments.map(argument => {
                const camelCased = camelCase(argument);
                translation = translation.replace(new RegExp(`{${argument}}`, 'g'), `\${${camelCased}}`);
                return camelCased;
            });
            
            return `${camelCase(message.name)}: (${args.join(', ')}) => \`${translation}\``;
        } else {
            return `${camelCase(message.name)}: '${translation.replace(/'/g, "\\'")}'`;
        }
    };
    
    for (const [locale, messages] of Object.entries(locales)) {
        const code = interpolatify`
            // ${meta}
            
            export default {
                ${messages.map(messageFunction).join(',\n')}
            };
        `;
        
        if (locale === 'en') {
            fs.writeFileSync(defaultMessages, code);
        } else {
            fs.writeFileSync(path.join(localesDirectory, `${locale}.js`), code);
        }
    }
};
