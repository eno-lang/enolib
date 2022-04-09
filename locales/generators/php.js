import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { interpolatify } from '../../utilities.js';

const camelCase = string => string.replace(/_[a-z]/g, boundary => boundary.charAt(1).toUpperCase());
const upperCaseInitial = string => string.replace(/^./, initial => initial.toUpperCase());

export function php(meta, locales) {
    const directory = path.resolve('php/src/locales');
    
    fsExtra.emptyDirSync(directory);
    
    const messageFunction = message => {
        let translation = message.translation
        
        if (message.arguments) {
            const args = message.arguments.map(argument => {
                translation = translation.replace(new RegExp(`{${argument}}`, 'g'), `{$${argument}}`);
                return `$${argument}`;
            });
            
            return `public static function ${camelCase(message.name)}(${args.join(', ')}) { return "${translation}"; }`;
        } else {
            return `const ${message.name.toUpperCase()} = '${translation.replace(/'/g, "\\'")}';`;
        }
    };
    
    for (const [locale, messages] of Object.entries(locales)) {
        const code = interpolatify`
            <?php declare(strict_types=1);
            
            // ${meta}
            
            namespace Eno\\Locales;
            
            class ${upperCaseInitial(locale)} {
                ${messages.map(messageFunction).join('\n')}
            }
        `;
        
        fs.writeFileSync(path.join(directory, `${upperCaseInitial(locale)}.php`), code);
    }
};
