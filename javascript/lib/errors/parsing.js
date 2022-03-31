const { BEGIN, DOCUMENT, END, HUMAN_INDEXING } = require('../constants.js');
const { cursor, selectLine } = require('./selections.js');
const { ParseError } = require('../error_types.js');

// ```key: value
const UNTERMINATED_ESCAPED_KEY = /^\s*(`+)(?!`)((?:(?!\1).)+)$/;
const unterminatedEscapedKey = (context, instruction, unterminated) => {
  const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);
  const selectionColumn = line.lastIndexOf(unterminated);

  return new ParseError(
    context.messages.unterminatedEscapedKey(instruction.line + HUMAN_INDEXING),
    new context.reporter(context).reportLine(instruction).snippet(),
    { from: { column: selectionColumn, index: instruction.ranges.line[0] + selectionColumn, line: instruction.line }, to: cursor(instruction, 'line', END) }
  );
};

exports.errors = {
  invalidLine: (context, instruction) => {
    const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);

    let match;
    if( (match = UNTERMINATED_ESCAPED_KEY.exec(line)) ) {
      return unterminatedEscapedKey(context, instruction, match[2]);
    }

    // TODO: This is a reoccurring pattern and can be DRYed up - line_error or something
    //       (Also in other implementations)
    return new ParseError(
      context.messages.invalidLine(instruction.line + HUMAN_INDEXING),
      new context.reporter(context).reportLine(instruction).snippet(),
      selectLine(instruction)
    );
  },

  missingElementForContinuation: (context, continuation) => {
    return new ParseError(
      context.messages.missingElementForContinuation(continuation.line + HUMAN_INDEXING),
      new context.reporter(context).reportLine(continuation).snippet(),
      selectLine(continuation)
    );
  },

  missingFieldsetForFieldsetEntry: (context, entry) => {
    return new ParseError(
      context.messages.missingFieldsetForFieldsetEntry(entry.line + HUMAN_INDEXING),
      new context.reporter(context).reportLine(entry).snippet(),
      selectLine(entry)
    );
  },

  missingListForListItem: (context, item) => {
    return new ParseError(
      context.messages.missingListForListItem(item.line + HUMAN_INDEXING),
      new context.reporter(context).reportLine(item).snippet(),
      selectLine(item)
    );
  },

  sectionHierarchyLayerSkip: (context, section, superSection) => {
    const reporter = new context.reporter(context).reportLine(section);

    if(superSection.type !== DOCUMENT) {
      reporter.indicateLine(superSection);
    }

    return new ParseError(
      context.messages.sectionHierarchyLayerSkip(section.line + HUMAN_INDEXING),
      reporter.snippet(),
      selectLine(section)
    );
  },

  unterminatedMultilineField: (context, field) => {
    return new ParseError(
      context.messages.unterminatedMultilineField(field.key, field.line + HUMAN_INDEXING),
      new context.reporter(context).reportElement(field).snippet(),
      selectLine(field)
    );
  }
};
