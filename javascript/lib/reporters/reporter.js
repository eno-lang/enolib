const {
  DOCUMENT,
  FIELD,
  FIELDSET,
  FIELDSET_ENTRY,
  HUMAN_INDEXING,
  LIST,
  LIST_ITEM,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('../constants.js');

// TODO: Better simple lastIn() / lastMissingIn() utility function usage to get m...n range for tagging?

const DISPLAY = Symbol('Display Line');
const EMPHASIZE = Symbol('Emphasize Line');
const INDICATE = Symbol('Indicate Line');
const OMISSION = Symbol('Insert Omission');
const QUESTION = Symbol('Question Line');

class Reporter {
  constructor(context) {
    this._context = context;
    this._index = new Array(this._context._lineCount);
    this._snippet = new Array(this._context._lineCount);

    this._buildIndex()
  }

  _buildIndex() {
    const indexComments = element => {
      if(element.hasOwnProperty('comments')) {
        for(const comment of element.comments) {
          this._index[comment.line] = comment;
        }
      }
    };

    const traverse = section => {
      for(const element of section.elements) {
        indexComments(element);

        this._index[element.line] = element;

        if(element.type === SECTION) {
          traverse(element);
        } else if(element.type === FIELD) {
          for(const continuation of element.continuations) {
            this._index[continuation.line] = continuation;
          }
        } else if(element.type === MULTILINE_FIELD_BEGIN) {
          // Missing when reporting an unterminated multiline field
          if(element.hasOwnProperty('end')) {
            this._index[element.end.line] = element.end;
          }

          for(const line of element.lines) {
            this._index[line.line] = line;
          }
        } else if(element.type === LIST) {
          for(const item of element.items) {
            indexComments(item);

            this._index[item.line] = item;

            for(const continuation of item.continuations) {
              this._index[continuation.line] = continuation;
            }
          }
        } else if(element.type === FIELDSET) {
          for(const entry of element.entries) {
            indexComments(entry);

            this._index[entry.line] = entry;

            for(const continuation of entry.continuations) {
              this._index[continuation.line] = continuation;
            }
          }
        }
      }
    }

    traverse(this._context._document);

    for(const meta of this._context._meta) {
      this._index[meta.line] = meta;
    }
  }

  _tagContinuations(element, tag) {
    let scanLine = element.line + 1;

    if(element.continuations.length === 0)
      return scanLine;

    for(const continuation of element.continuations) {
      while(scanLine < continuation.line) {
        this._snippet[scanLine] = tag;
        scanLine++;
      }

      this._snippet[continuation.line] = tag;
      scanLine++;
    }

    return scanLine;
  }

  _tagContinuables(element, collection, tag) {
    let scanLine = element.line + 1;

    if(element[collection].length === 0)
      return scanLine;

    for(const continuable of element[collection]) {
      while(scanLine < continuable.line) {
        this._snippet[scanLine] = tag;
        scanLine++;
      }

      this._snippet[continuable.line] = tag;

      scanLine = this._tagContinuations(continuable, tag);
    }

    return scanLine;
  }

  _tagElement(element, tag) {
    if(element.type === FIELD || element.type === LIST_ITEM || element.type === FIELDSET_ENTRY) {
      return this._tagContinuations(element, tag);
    } else if(element.type === LIST) {
      return this._tagContinuables(element, 'items', tag);
    } else if(element.type === FIELDSET && element.entries.length > 0) {
      return this._tagContinuables(element, 'entries', tag);
    } else if(element.type === MULTILINE_FIELD_BEGIN) {
      for(const line of element.lines) {
        this._snippet[line.line] = tag;
      }

      if(element.hasOwnProperty('end')) {
        this._snippet[element.end.line] = tag;
        return element.end.line + 1;
      } else if(element.lines.length > 0) {
        return element.lines[element.lines.length - 1].line + 1;
      } else {
        return element.line + 1;
      }
    } else if(element.type === SECTION) {
      return this._tagSection(element, tag);
    }
  }

  _tagSection(section, tag, recursive = true) {
    let scanLine = section.line + 1;

    for(const element of section.elements) {
      while(scanLine < element.line) {
        this._snippet[scanLine] = INDICATE;
        scanLine++;
      }

      if(!recursive && element.type === SECTION) break;

      this._snippet[element.line] = INDICATE;

      scanLine = this._tagElement(element, tag);
    }

    return scanLine;
  }

  indicateLine(element) {
    this._snippet[element.line] = INDICATE;
    return this;
  }

  questionLine(element) {
    this._snippet[element.line] = QUESTION;
    return this;
  }

  reportComments(element) {
    this._snippet[element.line] = INDICATE;
    for(const comment of element.comments) {
      this._snippet[comment.line] = EMPHASIZE;
    }

    return this;
  }

  reportElement(element) {
    this._snippet[element.line] = EMPHASIZE;
    this._tagElement(element, INDICATE);

    return this;
  }

  reportElements(elements) {
    for(const element of elements) {
      this._snippet[element.line] = EMPHASIZE;
      this._tagElement(element, INDICATE);
    }

    return this;
  }

  reportLine(instruction) {
    this._snippet[instruction.line] = EMPHASIZE;

    return this;
  }

  reportMultilineValue(element) {
    for(const line of element.lines) {
      this._snippet[line.line] = EMPHASIZE;
    }

    return this;
  }

  reportMissingElement(parent) {
    if(parent.type !== DOCUMENT) {
      this._snippet[parent.line] = INDICATE;
    }

    if(parent.type === SECTION) {
      this._tagSection(parent, QUESTION, false);
    } else {
      this._tagElement(parent, QUESTION);
    }

    return this;
  }

  snippet() {
    if(this._snippet.every(line => line === undefined)) {
      for(const [line, tag] of this._snippet.entries()) {
        this._snippet[line] = QUESTION;
      }
    } else {
      // TODO: Possibly better algorithm for this

      for(const [line, tag] of this._snippet.entries()) {
        if(tag !== undefined) continue;

        if(this._snippet[line + 2] !== undefined && this._snippet[line + 2] !== DISPLAY ||
           this._snippet[line - 2] !== undefined && this._snippet[line - 2] !== DISPLAY ||
           this._snippet[line + 1] !== undefined && this._snippet[line + 1] !== DISPLAY ||
           this._snippet[line - 1] !== undefined && this._snippet[line - 1] !== DISPLAY) {
          this._snippet[line] = DISPLAY;
        } else if(this._snippet[line + 3] !== undefined && this._snippet[line + 3] !== DISPLAY) {
          this._snippet[line] = OMISSION;
        }
      }

      if(this._snippet[this._snippet.length - 1] === undefined) {
        this._snippet[this._snippet.length - 1] = OMISSION;
      }
    }

    return this._print();
  }
}

exports.DISPLAY = DISPLAY;
exports.EMPHASIZE = EMPHASIZE;
exports.INDICATE = INDICATE;
exports.OMISSION = OMISSION;
exports.QUESTION = QUESTION;

exports.Reporter = Reporter;
