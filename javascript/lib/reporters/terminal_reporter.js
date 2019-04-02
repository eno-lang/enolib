const { COMMENT, HUMAN_INDEXING, UNPARSED } = require('../constants.js');
const { DISPLAY, EMPHASIZE, INDICATE, OMISSION, QUESTION, Reporter } = require('./reporter.js');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const BLACK = '\x1b[30m';
const BRIGHT_BLACK = '\x1b[90m';
const WHITE = '\x1b[37m';
const BRIGHT_WHITE = '\x1b[97m';

const BRIGHT_BLACK_BACKGROUND = '\x1b[40m';
const BRIGHT_RED_BACKGROUND = '\x1b[101m';
const WHITE_BACKGROUND = '\x1b[47m';

const INDICATORS = {
  [DISPLAY]: ' ',
  [EMPHASIZE]: '>',
  [INDICATE]: '*',
  [QUESTION]: '?'
};

const GUTTER_STYLE = {
  [DISPLAY]: BRIGHT_BLACK_BACKGROUND,
  [EMPHASIZE]: BLACK + BRIGHT_RED_BACKGROUND,
  [INDICATE]: BLACK + WHITE_BACKGROUND,
  [QUESTION]: BLACK + WHITE_BACKGROUND
};

const RANGE_STYLE = {
  'elementOperator': WHITE,
  'escapeBeginOperator': WHITE,
  'escapeEndOperator': WHITE,
  'itemOperator': WHITE,
  'entryOperator': WHITE,
  'sectionOperator': WHITE,
  'copyOperator': WHITE,
  'deepCopyOperator': WHITE,
  'multilineFieldOperator': WHITE,
  'directLineContinuationOperator': WHITE,
  'spacedLineContinuationOperator': WHITE,
  'key': BOLD + BRIGHT_WHITE,
  'template': BOLD + BRIGHT_WHITE,
  'value': DIM + WHITE
};

class TerminalReporter extends Reporter {
  constructor(context) {
    super(context);

    let highestShownLineNumber = this._snippet.length;

    for(let index = this._snippet.length; index >= 0; index--) {
      if(this._snippet[index] !== undefined && this._snippet[index] !== OMISSION) {
        highestShownLineNumber = index + 1;
        break;
      }
    }

    this._lineNumberPadding = Math.max(4, highestShownLineNumber.toString().length);  // TODO: Pick this up in other reporters
    this._header = '';

    if(context.source) {
      this._header += `${BLACK + BRIGHT_RED_BACKGROUND} ${INDICATORS[EMPHASIZE]} ${' '.padStart(this._lineNumberPadding)} ${RESET} ${BOLD}${context.source}${RESET}\n`;
    }
  }

  _line(line, tag) {
    if(tag === OMISSION)
      return `${DIM + BRIGHT_BLACK_BACKGROUND}${'...'.padStart(this._lineNumberPadding + 2)}  ${RESET}`;

    const number = (line + HUMAN_INDEXING).toString();
    const instruction = this._index[line];

    let content = '';
    if(instruction !== undefined) {
      if(instruction.type === COMMENT || instruction.type === UNPARSED) {
        content = BRIGHT_BLACK + this._context._input.substring(instruction.ranges.line[0], instruction.ranges.line[1]) + RESET;
      } else {
        content = this._context._input.substring(instruction.ranges.line[0], instruction.ranges.line[1]);

        const ranges = Object.entries(instruction.ranges).filter(([name, _]) => name !== 'line');

        ranges.sort((a,b) => a[1][0] < b[1][0] ? 1 : -1);

        for(const [name, range] of ranges) {
          const before = content.substring(0, range[0] - instruction.ranges.line[0]);
          const after = content.substr(range[1] - instruction.ranges.line[0]);

          content = before + RANGE_STYLE[name] + this._context._input.substring(range[0], range[1]) + RESET + after;
        }
      }
    }

    return `${GUTTER_STYLE[tag]} ${INDICATORS[tag]} ${number.padStart(this._lineNumberPadding)} ${RESET} ${content}`;
  }

  _print() {
    const snippet = this._snippet.map((tag, line) => this._line(line, tag))
                                 .filter(line => line !== undefined)
                                 .join('\n');

    return this._header + snippet;
  }
}

exports.TerminalReporter = TerminalReporter;
