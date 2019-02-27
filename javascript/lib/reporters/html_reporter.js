const { DISPLAY, EMPHASIZE, INDICATE, OMISSION, QUESTION } = require('./reporter.js');
const { HUMAN_INDEXING } = require('../constants.js');
const { Reporter } = require('./reporter.js');

const INDICATORS = {
  [DISPLAY]: ' ',
  [EMPHASIZE]: '>',
  [INDICATE]: '*',
  [QUESTION]: '?'
};

const HTML_ESCAPE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

const escape = string => string.replace(/[&<>"'\/]/g, c => HTML_ESCAPE[c]);

class HtmlReporter extends Reporter {
  constructor(context) {
    super(context);

    const contentHeader = this._context.messages.contentHeader;
    const gutterHeader = this._context.messages.gutterHeader.padStart(5);
    const columnsHeader = this._line(gutterHeader, contentHeader);

    this._gutterWidth = gutterHeader.length + 3;
    this._header = '<pre class="eno-report">\n' + (context.source ? `  <div>${context.source}</div>\n` : '') + columnsHeader;
    this._footer = '</pre>';
  }

  _line(gutter, content, tagClass = '') {
    let result = '';

    result += `  <div class="eno-report-line ${tagClass}">\n`;
    result += `    <div class="eno-report-gutter">${gutter.padStart(10)}</div>\n`;
    result += `    <div class="eno-report-content">${escape(content)}</div>\n`;
    result += '  </div>';

    return result;
  }

  _print(line, tag) {
    if(tag === OMISSION)
      return this._line('...', '...');

    const number = (line + HUMAN_INDEXING).toString();
    const instruction = this._index[line];


    let content;
    if(instruction === undefined) {
      content = '';
    }  else {
      content = this._context.input.substring(instruction.ranges.line[0], instruction.ranges.line[1]);
    }

    let tagClass;
    if(tag === EMPHASIZE) {
      tagClass = 'eno-report-line-emphasized';
    } else if(tag === INDICATE) {
      tagClass = 'eno-report-line-indicated';
    } else if(tag === QUESTION) {
      tagClass = 'eno-report-line-questioned';
    }

    return this._line(number, content, tagClass);
  }
}

exports.HtmlReporter = HtmlReporter;
