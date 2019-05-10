const slug = require('speakingurl');

exports.crop = text => {
  text = text.replace(/^\s*\n|\n\s*$/g, '');
  lines = text.split('\n');

  const depth = lines.reduce((minDepth, line) => {
    const leadingWhitespace = line.match(/^\s*(?=\S)/);

    if(leadingWhitespace) {
      const depth = leadingWhitespace[0].length;

      if(minDepth === null || depth < minDepth)
        return depth;
    }

    return minDepth;
  }, null);

  return text.split('\n').map(line => line.substring(depth)).join('\n');
};

exports.escapeDoubleQuotes = string => string.replace(/"/g, '\\"');
exports.escapeNewlines = string => string.replace(/\n/g, '\\n');
exports.escapeSingleQuotes = string => string.replace(/'/g, "\\'");

exports.filenamify = string => slug(string, { custom: { '-': '_' }, separator: '_' });

exports.indent = (text, depth) => {
  return text.split('\n').map(line => ' '.repeat(depth) + line).join('\n');
};

exports.interpolatify = (strings, ...variables) => {
  let interpolated = '';

  for(const [index, string] of strings.entries()) {
    if(index === strings.length - 1) {
      interpolated += string.replace(/\n\s*$/, ''); // strip trailing empty lines
    } else {
      if(index === 0) {
        interpolated += string.replace(/^\s*\n/, ''); // strip leading empty lines
      } else {
        interpolated += string;
      }

      let variable = variables[index];

      if(typeof variable === 'string') {
        const leadingCharacters = string.match(/(^|\n)([^\n]*)$/)[2];
        const leadingSpace = ' '.repeat(leadingCharacters.length);

        variable = variable.split('\n').map((line, index) => {
          return index === 0 ? line : leadingSpace + line;
        }).join('\n');

      }

      interpolated += variable;
    }
  }

  return exports.crop(interpolated);  // TODO: Integrate hard-coded
};

exports.quotedJavaScriptMultilineString = text => {
  text = text.replace(/\\/g, '\\\\'); // escape backslashes
  text = text.replace(/`/g, '\\`');   // escape quotes

  return `\`${text.replace(/\n/g, '\\n` +\n`')}\``;
}

exports.quotedPhpMultilineString = text => {
  text = text.replace(/\\/g, '\\\\'); // escape backslashes
  text = text.replace(/"/g, '\\"');   // escape quotes

  return `"${text.replace(/\n/g, '\\n" .\n"')}"`;
}

exports.quotedPythonMultilineString = text => {
  text = text.replace(/\\/g, '\\\\'); // escape backslashes
  text = text.replace(/"/g, '\\"');   // escape quotes

  return '("' + text.replace(/\n/g, '\\n"\n "') + '")';
}

exports.quotedRubyMultilineString = text => {
  return text.split('\n').map((line, index, lines) => {
    // Last line is quoted in single quotes (following ruby convention) because there is no \n inside
    if(index === lines.length - 1) {
      return `'${line.replace(/'/g, "\\'")}'`;
    } else {
      return `"${line.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}\\n"`;
    }
  }).join(' \\\n');
}
