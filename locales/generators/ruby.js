import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { interpolatify } from '../../utilities.js';

const upperCaseInitial = string => string.replace(/^./, initial => initial.toUpperCase());

export function ruby(meta, locales) {
    const directory = path.resolve('ruby/lib/enolib/locales');
    
    fsExtra.emptyDirSync(directory);
    
    const messageFunction = message => {
        let translation = message.translation
        
        if (message.arguments) {
            for (const argument of message.arguments) {
                translation = translation.replace(new RegExp(`{${argument}}`, 'g'), `#{${argument}}`);
            }
            
            return `def self.${message.name}(${message.arguments.join(', ')}) "${translation}" end`;
        } else {
            return `${message.name.toUpperCase()} = '${translation.replace(/'/g, "\\'")}'`;
        }
    };
    
    for (const [locale, messages] of Object.entries(locales)) {
        const code = interpolatify`
            # frozen_string_literal: true
            
            # ${meta}
            
            module Enolib
              module Locales
                module ${upperCaseInitial(locale)}
                  ${messages.map(messageFunction).join('\n')}
                end
              end
            end
        `;
        
        fs.writeFileSync(path.join(directory, `${locale}.rb`), code);
    }
    
    const requireFile = path.resolve('ruby/lib/enolib/locales.rb');
    
    const code = interpolatify`
        # frozen_string_literal: true
        
        ${Object.keys(locales).filter(locale => locale !== 'en').map(locale => `require 'enolib/locales/${locale}'`).join('\n')}
    `;
    
    fs.writeFileSync(requireFile, code);
};
