const { BEGIN, END, HUMAN_INDEXING } = require('../constants.js');
const { cursor, selectLine, selectTemplate } = require('./selections.js');
const { ParseError } = require('../error_types.js');

// ```key: value
const UNTERMINATED_ESCAPED_KEY = /^\s*#*\s*(`+)(?!`)((?:(?!\1).)+)$/;
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
  cyclicDependency: (context, instruction, instructionChain) => {
    const firstOccurrence = instructionChain.indexOf(instruction);
    const feedbackChain = instructionChain.slice(firstOccurrence);

    const firstInstruction = feedbackChain[0];
    const lastInstruction = feedbackChain[feedbackChain.length - 1];

    let copyInstruction;
    if(lastInstruction.hasOwnProperty('template')) {
      copyInstruction = lastInstruction;
    } else if(firstInstruction.hasOwnProperty('template')) {
      copyInstruction = firstInstruction;
    }

    const reporter = new context.reporter(context);

    reporter.reportLine(copyInstruction);

    for(const element of feedbackChain) {
      if(element !== copyInstruction) {
        reporter.indicateLine(element);
      }
    }

    return new ParseError(
      context.messages.cyclicDependency(copyInstruction.line + HUMAN_INDEXING, copyInstruction.template),
      reporter.snippet(),
      selectTemplate(copyInstruction)
    );
  },

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

  nonSectionElementNotFound: (context, copy) => {
    return new ParseError(
      context.messages.nonSectionElementNotFound(copy.line + HUMAN_INDEXING, copy.template),
      new context.reporter(context).reportLine(copy).snippet(),
      selectLine(copy)
    );
  },

  sectionHierarchyLayerSkip: (context, section, superSection) => {
    // TODO: Handle superSection being the document (no line to indicate there) - see python impl.

    return new ParseError(
      context.messages.sectionHierarchyLayerSkip(section.line + HUMAN_INDEXING),
      new context.reporter(context).reportLine(section).indicateLine(superSection).snippet(),
      selectLine(section)
    );
  },

  sectionNotFound: (context, copy) => {
    return new ParseError(
      context.messages.sectionNotFound(copy.line + HUMAN_INDEXING, copy.template),
      new context.reporter(context).reportLine(copy).snippet(),
      selectLine(copy)
    );
  },

  twoOrMoreTemplatesFound: (context, copy, firstTemplate, secondTemplate) => {
    return new ParseError(
      context.messages.twoOrMoreTemplatesFound(copy.template),
      new context.reporter(context).reportLine(copy).questionLine(firstTemplate).questionLine(secondTemplate).snippet(),
      selectLine(copy)
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
