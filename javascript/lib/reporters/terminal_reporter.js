const { COMMENT, HUMAN_INDEXING, SECTION } = require('../constants.js');
const { DISPLAY, EMPHASIZE, INDICATE, OMISSION, QUESTION } = require('./reporter.js');
const { Reporter } = require('./reporter.js');

// TODO: Revisit output style design

const INDICATORS = {
  [DISPLAY]: ' ',
  [EMPHASIZE]: '>',
  [INDICATE]: '*',
  [QUESTION]: '?'
};

const BRIGHT = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const BLACK = '\x1b[30m';
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const WHITE = '\x1b[37m';

const RED_BACKGROUND = '\x1b[41m';

const HIGHLIGHTING = {
  [DISPLAY]: RESET,
  [EMPHASIZE]: BRIGHT + RED_BACKGROUND,
  [INDICATE]: YELLOW,
  [QUESTION]: YELLOW,
  'elementOperator': MAGENTA,
  'itemOperator': MAGENTA,
  'entryOperator': MAGENTA,
  'sectionOperator': MAGENTA,
  'commentOperator': WHITE,
  'key': BLUE,
  'value': WHITE
};

class TerminalReporter extends Reporter {
  constructor(context) {
    super(context);

    const contentHeader = this._context.messages.contentHeader;
    const gutterHeader = this._context.messages.gutterHeader.padStart(5);
    const columnsHeader = `${BRIGHT}  ${gutterHeader} | ${contentHeader}${RESET}`;

    this._gutterWidth = gutterHeader.length + 3;
    this._header = context.source ? `-- ${BRIGHT}${context.source}${RESET} --\n\n${columnsHeader}` : columnsHeader;
  }

  _print(line, tag) {
    if(tag === OMISSION)
      return `${BRIGHT}${' '.repeat(this._gutterWidth - 5)}...${RESET}`;

    const number = (line + HUMAN_INDEXING).toString();
    const instruction = this._index[line];

    let content = '';
    if(instruction !== undefined) {
      content = this._context.input.substring(instruction.ranges.line[0], instruction.ranges.line[1]);

      const ranges = Object.entries(instruction.ranges).filter(([name, _]) => name !== 'line');

      ranges.sort((a,b) => a[1][0] < b[1][0] ? 1 : -1);

      for(const [name, range] of ranges) {
        const before = content.substring(0, instruction.ranges[name][0] - instruction.ranges.line[0]);
        const after = content.substr(instruction.ranges[name][1] - instruction.ranges.line[0]);

        if(instruction.type === SECTION && name === 'key') {
          content = before + YELLOW + this._context.input.substring(instruction.ranges[name][0], instruction.ranges[name][1]) + WHITE + after;
        } else {
          content = before + HIGHLIGHTING[name] + this._context.input.substring(instruction.ranges[name][0], instruction.ranges[name][1]) + WHITE + after;
        }
      }

      if(instruction.type === COMMENT) {
        content = DIM + content + RESET;
      }
    }

    return ` ${INDICATORS[tag]}${number.padStart(this._gutterWidth - 3)} | ${HIGHLIGHTING[tag]}${content}${RESET}`;
  }
}

exports.TerminalReporter = TerminalReporter;
