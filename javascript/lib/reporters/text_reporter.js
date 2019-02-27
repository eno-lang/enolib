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

    const contentHeader = this._context.messages.contentHeader;
    const gutterHeader = this._context.messages.gutterHeader.padStart(5);
    const columnsHeader = `  ${gutterHeader} | ${contentHeader}`;

    this._gutterWidth = gutterHeader.length + 3;
    this._header = context.source ? `-- ${context.source} --\n\n${columnsHeader}` : columnsHeader;
  }

  _print(line, tag) {
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
}

exports.TextReporter = TextReporter;
