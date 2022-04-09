import slug from 'speakingurl';

export function crop(text) {
    text = text.replace(/^\s*\n|\n\s*$/g, '');
    const lines = text.split('\n');
    
    const depth = lines.reduce((minDepth, line) => {
        const leadingWhitespace = line.match(/^\s*(?=\S)/);
        
        if (leadingWhitespace) {
            const depth = leadingWhitespace[0].length;
            
            if (minDepth === null || depth < minDepth)
            return depth;
        }
        
        return minDepth;
    }, null);
    
    return text.split('\n').map(line => line.substring(depth)).join('\n');
};

export const escapeDoubleQuotes = string => string.replace(/"/g, '\\"');
export const escapeNewlines = string => string.replace(/\n/g, '\\n');
export const escapeSingleQuotes = string => string.replace(/'/g, "\\'");

export const filenamify = string => slug(string, { custom: { '-': '_' }, separator: '_' });

export function indent(text, depth) {
    return text.split('\n').map(line => ' '.repeat(depth) + line).join('\n');
};

export function interpolatify(strings, ...variables) {
    let interpolated = '';
    
    for (const [index, string] of strings.entries()) {
        if (index === strings.length - 1) {
            interpolated += string.replace(/\n\s*$/, ''); // strip trailing empty lines
        } else {
            if (index === 0) {
                interpolated += string.replace(/^\s*\n/, ''); // strip leading empty lines
            } else {
                interpolated += string;
            }
            
            let variable = variables[index];
            
            if (typeof variable === 'string') {
                const leadingCharacters = string.match(/(^|\n)([^\n]*)$/)[2];
                const leadingSpace = ' '.repeat(leadingCharacters.length);
                
                variable = variable.split('\n').map((line, index) => {
                    return index === 0 ? line : leadingSpace + line;
                }).join('\n');
                
            }
            
            interpolated += variable;
        }
    }
    
    return crop(interpolated);  // TODO: Integrate hard-coded
};

export function quotedJavaScriptMultilineString(text) {
    text = text.replace(/\\/g, '\\\\'); // escape backslashes
    text = text.replace(/`/g, '\\`');   // escape quotes
    
    return `\`${text.replace(/\n/g, '\\n` +\n`')}\``;
}

export function quotedPhpMultilineString(text) {
    text = text.replace(/\\/g, '\\\\'); // escape backslashes
    text = text.replace(/"/g, '\\"');   // escape quotes
    
    return `"${text.replace(/\n/g, '\\n" .\n"')}"`;
}

export function quotedPythonMultilineString(text) {
    text = text.replace(/\\/g, '\\\\'); // escape backslashes
    text = text.replace(/"/g, '\\"');   // escape quotes
    
    return '("' + text.replace(/\n/g, '\\n"\n "') + '")';
}

export function quotedRubyMultilineString(text) {
    return text.split('\n').map((line, index, lines) => {
        // Last line is quoted in single quotes (following ruby convention) because there is no \n inside
        if (index === lines.length - 1) {
            return `'${line.replace(/'/g, "\\'")}'`;
        } else {
            return `"${line.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}\\n"`;
        }
    }).join(' \\\n');
}
