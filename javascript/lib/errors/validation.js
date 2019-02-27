const { ValidationError } = require('../error_types.js');
const { DOCUMENT_BEGIN, selection, cursor, selectComments, selectElement, selectKey } = require('./selections.js');
const {
  BEGIN,
  END,
  ELEMENT,
  FIELD,
  FIELDSET,
  FIELDSET_ENTRY,
  LIST,
  LIST_ITEM,
  MULTILINE_FIELD_BEGIN,
  MULTILINE_FIELD_VALUE,
  SECTION
} = require('../constants.js');

// TODO: Here and prominently also elsewhere - consider replacing instruction.ranges.line with instruction[LINE_RANGE] (where LINE_RANGE = Symbol('descriptive'))

exports.errors = {
  commentError: (context, message, element) => {
    return new ValidationError(
      context.messages.commentError(message),
      new context.reporter(context).reportComments(element).snippet(),
      selectComments(element)
    );
  },

  elementError: (context, message, element) => {
    return new ValidationError(
      context.messages.elementError(message),
      new context.reporter(context).reportElement(element).snippet(),
      selectElement(element)
    );
  },

  keyError: (context, message, element) => {
    return new ValidationError(
      context.messages.keyError(message),
      new context.reporter(context).reportLine(element).snippet(),
      selectKey(element)
    );
  },

  missingComment: (context, element) => {
    return new ValidationError(
      context.messages.missingComment,
      new context.reporter(context).reportLine(element).snippet(), // TODO: Question-tag an empty line before an element with missing comment
      selection(element, 'line', BEGIN)
    );
  },

  missingElement: (context, key, parent, message) => {
    return new ValidationError(
      context.messages[message](key),
      new context.reporter(context).reportMissingElement(parent).snippet(),
      parent === context.document ? DOCUMENT_BEGIN : selection(parent, 'line', END)
    );
  },

  // TODO: Revisit and polish the two core value errors again at some point (missingValue / valueError)
  //       (In terms of quality of results and architecture - DRY up probably)
  //       Share best implementation among other eno libraries

  missingValue: (context, element) => {
    let message;
    const selection = {};

    if(element.type === FIELD || element.type === ELEMENT || element.type === MULTILINE_FIELD_BEGIN) {
      message = context.messages.missingFieldValue(element.key);

      if(element.ranges.hasOwnProperty('template')) {
        selection.from = cursor(element, 'template', END);
      } else if(element.ranges.hasOwnProperty('elementOperator')) {
        selection.from = cursor(element, 'elementOperator', END);
      } else {
        selection.from = cursor(element, 'line', END);
      }
    } else if(element.type === FIELDSET_ENTRY) {
      message = context.messages.missingFieldsetEntryValue(element.key);
      selection.from = cursor(element, 'entryOperator', END);
    } else if(element.type === LIST_ITEM) {
      message = context.messages.missingListItemValue(element.parent.key);
      selection.from = cursor(element, 'itemOperator', END);
    }

    const snippet = new context.reporter(context).reportElement(element).snippet();

    if(element.type !== MULTILINE_FIELD_BEGIN && element.continuations.length > 0) {
      selection.to = cursor(element.continuations[element.continuations.length - 1], 'line', END);
    } else {
      selection.to = cursor(element, 'line', END);
    }

    return new ValidationError(message, snippet, selection);
  },

  unexpectedElement: (context, message, element) => {
    return new ValidationError(
      message || context.messages.unexpectedElement,
      new context.reporter(context).reportElement(element).snippet(),
      selectElement(element)
    );
  },

  unexpectedMultipleElements: (context, key, elements, message) => {
    return new ValidationError(
      context.messages[message](key),
      new context.reporter(context).reportElements(elements).snippet(),
      selectElement(elements[0])
    );
  },

  unexpectedNonSectionElement: (context, element, message) => {
    return new ValidationError(
      context.messages[message](element.key),
      new context.reporter(context).reportElement(element).snippet(),
      selectElement(element)
    );
  },

  unexpectedSection: (context, section, message) => {
    return new ValidationError(
      context.messages[message](section.key),
      new context.reporter(context).reportLine(section).snippet(),
      selectElement(section)
    );
  },

  valueError: (context, message, element) => {
    let snippet, select;

    if(element.mirror) {
      snippet = new context.reporter(context).reportLine(element).snippet();
      select = selectKey(element);
    } else if(element.type === MULTILINE_FIELD_BEGIN) {
      if(element.lines.length > 0) {
        snippet = new context.reporter(context).reportMultilineValue(element).snippet();
        select = selection(element.lines[0], 'line', BEGIN, element.lines[element.lines.length - 1], 'line', END);
      } else {
        snippet = new context.reporter(context).reportElement(element).snippet();
        select = selection(element, 'line', END);
      }
    } else {
      snippet = new context.reporter(context).reportElement(element).snippet();
      select = {};

      if(element.ranges.hasOwnProperty('value')) {
        select.from = cursor(element, 'value', BEGIN);
      } else if(element.ranges.hasOwnProperty('elementOperator')) {
        select.from = cursor(element, 'elementOperator', END);
      } else if(element.ranges.hasOwnProperty('entryOperator')) {
        select.from = cursor(element, 'entryOperator', END);
      } else if(element.type === LIST_ITEM) {
        select.from = cursor(element, 'itemOperator', END);
      } else {
        // TODO: Possibly never reached - think through state permutations
        select.from = cursor(element, 'line', END);
      }

      if(element.continuations.length > 0) {
        select.to = cursor(element.continuations[element.continuations.length - 1], 'line', END);
      } else if(element.ranges.hasOwnProperty('value')) {
        select.to = cursor(element, 'value', END);
      } else {
        select.to = cursor(element, 'line', END);
      }
    }

    return new ValidationError(context.messages.valueError(message), snippet, select);
  }
};
