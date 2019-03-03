const { DISPLAY, EMPHASIZE, INDICATE, OMISSION, QUESTION } = require('./reporter.js');
const { HUMAN_INDEXING } = require('../constants.js');
const { Reporter } = require('./reporter.js');

const INDICATORS = {
  [DISPLAY]: ' ',
  [EMPHASIZE]: '>',
  [INDICATE]: '*',
  [QUESTION]: '?'
};

class TextReporter extends Reporter {
  constructor(context) {
    super(context);

    const gutterHeader = this._context.messages.gutterHeader.padStart(5);
    const columnsHeader = `  ${gutterHeader} | ${this._context.messages.contentHeader}`;

    this._gutterWidth = gutterHeader.length + 3;
    this._header = `${context.source ? `-- ${context.source} --\n\n` : ''}${columnsHeader}\n`;
  }

  _line(line, tag) {
    if(tag === OMISSION)
      return `${' '.repeat(this._gutterWidth - 5)}...`;

    const number = (line + HUMAN_INDEXING).toString();
    const instruction = this._index[line];

    let content;
    if(instruction === undefined) {
      content = '';
    }  else {
      content = this._context.input.substring(instruction.ranges.line[0], instruction.ranges.line[1]);
    }

    return ` ${INDICATORS[tag]}${number.padStart(this._gutterWidth - 3)} | ${content}`;
  }

  _print() {
    const snippet = this._snippet.map((tag, line) => this._line(line, tag))
                                 .filter(line => line !== undefined)
                                 .join('\n');

    return this._header + snippet;
  }
}

exports.TextReporter = TextReporter;
