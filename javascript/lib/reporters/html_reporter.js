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
  _line(line, tag) {
    if(tag === OMISSION)
      return this._markup('...', '...');

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

    return this._markup(number, content, tagClass);
  }

  _markup(gutter, content, tagClass = '') {
    return `<div class="eno-report-line ${tagClass}">` +
           `<div class="eno-report-gutter">${gutter.padStart(10)}</div>` +
           `<div class="eno-report-content">${escape(content)}</div>` +
           '</div>';
  }

  _print() {
    const columnsHeader = this._markup(this._context.messages.gutterHeader, this._context.messages.contentHeader);
    const snippet = this._snippet.map((tag, line) => this._line(line, tag))
                                 .filter(line => line !== undefined)
                                 .join('');

    return `<div>${this._context.source ? `<div>${this._context.source}</div>` : ''}<pre class="eno-report">${columnsHeader}${snippet}</pre></div>`;
  }
}

exports.HtmlReporter = HtmlReporter;
