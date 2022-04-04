const { analyze } = require('./analyze.js');
const en = require('./locales/en.js');
const { TextReporter } = require('./reporters/text_reporter.js');

const {
    ATTRIBUTE,
    DOCUMENT,
    EMPTY,
    FIELD,
    FIELDSET,
    FIELD_OR_FIELDSET_OR_LIST,
    ITEM,
    LIST,
    MULTILINE_FIELD_BEGIN,
    PRETTY_TYPES,
    SECTION
} = require('./constants.js');

class Context {
  constructor(input, options) {
    this._input = input;
    this.messages = options.hasOwnProperty('locale') ? options.locale : en;
    this.reporter = options.hasOwnProperty('reporter') ? options.reporter : TextReporter;
    this.source = options.hasOwnProperty('source') ? options.source : null;

    this._analyze();
  }

  comment(element) {
    if(!element.hasOwnProperty('computedComment')) {
      if(element.hasOwnProperty('comments')) {
        if(element.comments.length === 1) {
          element.computedComment = element.comments[0].comment;
        } else {
          let firstNonEmptyLineIndex = null;
          let sharedIndent = Infinity;
          let lastNonEmptyLineIndex = null;

          for(const [index, comment] of element.comments.entries()) {
            if(comment.comment !== null) {
              if(firstNonEmptyLineIndex == null) {
                firstNonEmptyLineIndex = index;
              }

              const indent = comment.ranges.comment[0] - comment.ranges.line[0];
              if(indent < sharedIndent) {
                sharedIndent = indent;
              }

              lastNonEmptyLineIndex = index;
            }
          }

          if(firstNonEmptyLineIndex !== null) {
            const nonEmptyLines = element.comments.slice(
              firstNonEmptyLineIndex,
              lastNonEmptyLineIndex + 1
            );

            element.computedComment = nonEmptyLines.map(comment => {
              if(comment.comment === null) {
                return '';
              } else if(comment.ranges.comment[0] - comment.ranges.line[0] === sharedIndent) {
                return comment.comment;
              } else {
                return ' '.repeat(comment.ranges.comment[0] - comment.ranges.line[0] - sharedIndent) + comment.comment;
              }
            }).join('\n');
          } else {
            element.computedComment = null;
          }
        }
      } else {
        element.computedComment = null;
      }
    }

    return element.computedComment;
  }

  elements(section) {
      if (!section.hasOwnProperty('computedElements')) {
        section.computedElementsMap = {};
        section.computedElements = section.elements;

        for(const element of section.computedElements) {
          if(section.computedElementsMap.hasOwnProperty(element.key)) {
            section.computedElementsMap[element.key].push(element);
          } else {
            section.computedElementsMap[element.key] = [element];
          }
        }
      }

      return section.computedElements;
  }

  entries(fieldset) {
      if (!fieldset.hasOwnProperty('computedEntries')) {
        fieldset.computedEntriesMap = {};
        fieldset.computedEntries = fieldset.entries;

        for(const entry of fieldset.computedEntries) {
          if(fieldset.computedEntriesMap.hasOwnProperty(entry.key)) {
            fieldset.computedEntriesMap[entry.key].push(entry);
          } else {
            fieldset.computedEntriesMap[entry.key] = [entry];
          }
        }
      }

      return fieldset.computedEntries;
  }

  items(list) {
      return list.items;
  }

  raw(element) {
    const result = {
      type: PRETTY_TYPES[element.type]
    };

    if(element.hasOwnProperty('comments')) {
      result.comment = this.comment(element);
    }

    switch(element.type) {
      case ATTRIBUTE:
        result.key = element.key;
        result.value = this.value(element);
        break;
      case FIELD_OR_FIELDSET_OR_LIST:  // fall through
      case EMPTY:
        result.key = element.key;
        break;
      case FIELD:
        result.key = element.key;
        result.value = this.value(element);
        break;
      case ITEM:
        result.value = this.value(element);
        break;
      case MULTILINE_FIELD_BEGIN:
        result.key = element.key;
        result.value = this.value(element);
        break;
      case LIST:
        result.key = element.key;
        result.items = this.items(element).map(item => this.raw(item))
        break;
      case FIELDSET:
        result.key = element.key;
        result.entries = this.entries(element).map(entry => this.raw(entry))
        break;
      case SECTION:
        result.key = element.key;
        // fall through
      case DOCUMENT:
        result.elements = this.elements(element).map(sectionElement => this.raw(sectionElement))
        break;
    }

    return result;
  }

  value(element) {
    if (!element.hasOwnProperty('computedValue')) {
      element.computedValue = null;

      if(element.type === MULTILINE_FIELD_BEGIN) {
        if(element.lines.length > 0) {
          element.computedValue = this._input.substring(
            element.lines[0].ranges.line[0],
            element.lines[element.lines.length - 1].ranges.line[1]
          );
        }
      } else {
        if(element.hasOwnProperty('value')) {
          element.computedValue = element.value;  // TODO: *Could* consider not actually storing those, but lazily aquiring from substring as well (probably only makes sense in e.g. rust implementation though)
        }

        if(element.hasOwnProperty('continuations')) {
          let unappliedSpacing = false;

          for(let continuation of element.continuations) {
            if(element.computedValue === null) {
              element.computedValue = continuation.value;
              unappliedSpacing = false;
            } else if(continuation.value === null) {
              unappliedSpacing = unappliedSpacing || continuation.spaced;
            } else if(continuation.spaced || unappliedSpacing) {
              element.computedValue += ' ' + continuation.value;
              unappliedSpacing = false;
            } else {
              element.computedValue += continuation.value;
            }
          }
        }
      }
    }

    return element.computedValue;
  }
}

Context.prototype._analyze = analyze;

exports.Context = Context;
