import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { interpolatify } from '../../utilities.js';

export function python(meta, locales) {
    const directory = path.resolve('python/enolib/locales');
    
    fsExtra.emptyDirSync(directory);
    fsExtra.ensureFileSync(path.join(directory, '__init__.py'));
    
    const messageFunction = message => {
        let translation = message.translation
        
        if (message.arguments) {
            return `${message.name} = lambda ${message.arguments.join(', ')}: f"${translation}"`;
        } else {
            return `${message.name} = '${translation.replace(/'/g, "\\'")}'`;
        }
    };
    
    for (const [locale, messages] of Object.entries(locales)) {
        const titleCaseLocale = locale.replace(/^./, initial => initial.toUpperCase());
        
        const code = interpolatify`
            # ${meta}
            
            ${messages.map(messageFunction).join('\n')}
        `;
        
        fs.writeFileSync(path.join(directory, `${locale}.py`), code);
    }
};
