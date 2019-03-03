const {
  BEGIN,
  END,
  FIELD,
  FIELDSET,
  FIELDSET_ENTRY,
  LIST,
  LIST_ITEM,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('../constants.js');

// TODO: Strongly consider reverse iteration and/or last subinstruction checks to speed up some lastIn/etc. algorithms here

const lastIn = element => {
  if((element.type === FIELD || element.type === LIST_ITEM || element.type === FIELDSET_ENTRY) && element.continuations.length > 0) {
    return element.continuations[element.continuations.length - 1];
  } else if(element.type === LIST && element.items.length > 0) {
    return lastIn(element.items[element.items.length - 1]);
  } else if(element.type === FIELDSET && element.entries.length > 0) {
    return lastIn(element.entries[element.entries.length - 1]);
  } else if(element.type === MULTILINE_FIELD_BEGIN) {
    return element.end;
  } else if(element.type === SECTION && element.elements.length > 0) {
    return lastIn(element.elements[element.elements.length - 1]);
  } else {
    return element
  }
}

const cursor = (instruction, range, position) => {
  const index = instruction.ranges[range][position];

  return {
    column: index - instruction.ranges.line[BEGIN],
    index: index,
    line: instruction.line
  };
};

const selection = (instruction, range, position, ...to) => {
  const toInstruction = to.find(argument => typeof argument === 'object') || instruction;
  const toRange = to.find(argument => typeof argument === 'string') || range;
  const toPosition = to.find(argument => typeof argument === 'number') || position;

  return {
    from: cursor(instruction, range, position),
    to: cursor(toInstruction, toRange, toPosition)
  };
};

const selectComments = element => {
  const { comments } = element;

  if(comments.length === 1) {
    if(comments[0].hasOwnProperty('value')) {
      return selection(comments[0], 'value', BEGIN, END);
    } else {
      return selection(comments[0], 'line', BEGIN, END);
    }
  } else if(comments.length > 1) {
    return selection(comments[0], 'line', BEGIN, comments[comments.length - 1], 'line', END);
  } else {
    return selection(element, 'line', BEGIN);
  }
};

exports.DOCUMENT_BEGIN = {
  from: { column: 0, index: 0, line: 0 },
  to: { column: 0, index: 0, line: 0 }
};

exports.cursor = cursor;
exports.selection = selection;
exports.selectComments = selectComments;
exports.selectElement = element => selection(element, 'line', BEGIN, lastIn(element), 'line', END);
exports.selectKey = element => selection(element, 'key', BEGIN, END);
exports.selectLine = element => selection(element, 'line', BEGIN, END);
exports.selectTemplate = element => selection(element, 'template', BEGIN, END);
