const { Context } = require('./context.js');
const { Element } = require('./elements/element.js');

// TODO: if(element.type === MULTILINE_FIELD_BEGIN) - Here and elsewhere there will be trouble if the multiline field is really COPIED, because then we can't go through .lines (!) revisit boldly

const {
  BEGIN,
  END,
  FIELD,
  FIELDSET,
  LIST,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('./constants.js');

const checkMultilineFieldByLine = (field, line) => {
  if(line < field.line || line > field.end.line)
    return false;

  if(line === field.line)
    return { element: field, instruction: field };

  if(line === field.end.line)
    return { element: field, instruction: field.end };

  return { element: field, instruction: field.lines.find(valueLine => valueLine.line === line) };
};

const checkMultilineFieldByIndex = (field, index) => {
  if(index < field.ranges.line[BEGIN] || index > field.end.ranges.line[END])
    return false;

  if(index <= field.ranges.line[END])
    return { element: field, instruction: field };

  if(index >= field.end.ranges.line[BEGIN])
    return { element: field, instruction: field.end };

  return { element: field, instruction: field.lines.find(line => index <= line.ranges.line[END]) };
};

const checkFieldByLine = (field, line) => {
  if(line < field.line)
    return false;

  if(line === field.line)
    return { element: field, instruction: field };

  if(!field.hasOwnProperty('continuations') ||
     field.continuations.length === 0 ||
     line > field.continuations[field.continuations.length - 1].line)
    return false;

  for(const continuation of field.continuations) {
    if(line === continuation.line)
      return { element: field, instruction: continuation };
    if(line < continuation.line)
      return { element: field, instruction: null };
  }
};

const checkFieldByIndex = (field, index) => {
  if(index < field.ranges.line[BEGIN])
    return false;

  if(index <= field.ranges.line[END])
    return { element: field, instruction: field };

  if(!field.hasOwnProperty('continuations') ||
     field.continuations.length === 0 ||
     index > field.continuations[field.continuations.length - 1].ranges.line[END])
    return false;

  for(const continuation of field.continuations) {
    if(index < continuation.ranges.line[BEGIN])
      return { element: field, instruction: null };
    if(index <= continuation.ranges.line[END])
      return { element: field, instruction: continuation };
  }
};

const checkFieldsetByLine = (fieldset, line) => {
  if(line < fieldset.line)
    return false;

  if(line === fieldset.line)
    return { element: fieldset, instruction: fieldset };

  if(!fieldset.hasOwnProperty('entries') ||
     fieldset.entries.length === 0 ||
     line > fieldset.entries[fieldset.entries.length - 1].line)
    return false;

  for(const entry of fieldset.entries) {
    if(line === entry.line)
      return { element: entry, instruction: entry };

      if(line < entry.line) {
        if(entry.hasOwnProperty('comments') && line >= entry.comments[0].line) {
          return {
            element: entry,
            instruction: entry.comments.find(comment => line == comment.line)
          };
        }
        return { element: fieldset, instruction: null };
      }

    const matchInEntry = checkFieldByLine(entry, line);

    if(matchInEntry)
      return matchInEntry;
  }
};

const checkFieldsetByIndex = (fieldset, index) => {
  if(index < fieldset.ranges.line[BEGIN])
    return false;

  if(index <= fieldset.ranges.line[END])
    return { element: fieldset, instruction: fieldset };

  if(!fieldset.hasOwnProperty('entries') ||
     fieldset.entries.length === 0 ||
     index > fieldset.entries[fieldset.entries.length - 1].ranges.line[END])
    return false;

  for(const entry of fieldset.entries) {
    if(index < entry.ranges.line[BEGIN]) {
      if(entry.hasOwnProperty('comments') && index >= entry.comments[0].ranges.line[BEGIN]) {
        return {
          element: entry,
          instruction: entry.comments.find(comment => index <= comment.ranges.line[END])
        };
      }
      return { element: fieldset, instruction: null };
    }

    if(index <= entry.ranges.line[END])
      return { element: entry, instruction: entry };

    const matchInEntry = checkFieldByIndex(entry, index);

    if(matchInEntry)
      return matchInEntry;
  }
};

const checkListByLine = (list, line) => {
  if(line < list.line)
    return false;

  if(line === list.line)
    return { element: list, instruction: list };

  if(!list.hasOwnProperty('items') ||
     line > list.items[list.items.length - 1].line)
    return false;

  for(const item of list.items) {
    if(line === item.line)
      return { element: item, instruction: item };

    if(line < item.line) {
      if(item.hasOwnProperty('comments') && line >= item.comments[0].line) {
        return {
          element: item,
          instruction: item.comments.find(comment => line == comment.line)
        };
      }
      return { element: list, instruction: null };
    }

    const matchInItem = checkFieldByLine(item, line);

    if(matchInItem)
      return matchInItem;
  }
};

const checkListByIndex = (list, index) => {
  if(index < list.ranges.line[BEGIN])
    return false;

  if(index <= list.ranges.line[END])
    return { element: list, instruction: list };

  if(!list.hasOwnProperty('items') ||
     index > list.items[list.items.length - 1].ranges.line[END])
    return false;

  for(const item of list.items) {
    if(index < item.ranges.line[BEGIN]) {
      if(item.hasOwnProperty('comments') && index >= item.comments[0].ranges.line[BEGIN]) {
        return {
          element: item,
          instruction: item.comments.find(comment => index <= comment.ranges.line[END])
        };
      }
      return { element: list, instruction: null };
    }

    if(index <= item.ranges.line[END])
      return { element: item, instruction: item };

    const matchInItem = checkFieldByIndex(item, index);

    if(matchInItem)
      return matchInItem;
  }
};

const checkInSectionByLine = (section, line) => {
  for(let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
    const element = section.elements[elementIndex];

    if(element.hasOwnProperty('comments')) {
      if(line < element.comments[0].line) continue;

      if(line <= element.comments[element.comments.length - 1].line) {
        return {
          element: element,
          instruction: element.comments.find(comment => line == comment.line)
        };
      }
    }

    if(element.line > line)
      continue;

    if(element.line === line)
      return { element: element, instruction: element };

    switch(element.type) {
      case FIELD: {
        const matchInField = checkFieldByLine(element, line);
        if(matchInField) return matchInField;
        break;
      }
      case FIELDSET: {
        const matchInFieldset = checkFieldsetByLine(element, line);
        if(matchInFieldset) return matchInFieldset;
        break;
      }
      case LIST: {
        const matchInList = checkListByLine(element, line);
        if(matchInList) return matchInList;
        break;
      }
      case MULTILINE_FIELD_BEGIN:
        if(!element.hasOwnProperty('template')) {  // TODO: More elegant copy detection?
          const matchInMultilineField = checkMultilineFieldByLine(element, line);
          if(matchInMultilineField) return matchInMultilineField;
        }
        break;
      case SECTION:
        return checkInSectionByLine(element, line);
    }
    break;
  }
  return { element: section, instruction: null };
};

const checkInSectionByIndex = (section, index) => {
  for(let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
    const element = section.elements[elementIndex];

    if(element.hasOwnProperty('comments')) {
      if(index < element.comments[0].ranges.line[BEGIN]) continue;

      if(index <= element.comments[element.comments.length - 1].ranges.line[END]) {
        return {
          element: element,
          instruction: element.comments.find(comment => index <= comment.ranges.line[END])
        };
      }
    }

    if(index < element.ranges.line[BEGIN])
      continue;

    if(index <= element.ranges.line[END])
      return { element: element, instruction: element };

    switch(element.type) {
      case FIELD: {
        const matchInField = checkFieldByIndex(element, index);
        if(matchInField) return matchInField;
        break;
      }
      case FIELDSET: {
        const matchInFieldset = checkFieldsetByIndex(element, index);
        if(matchInFieldset) return matchInFieldset;
        break;
      }
      case LIST: {
        const matchInList = checkListByIndex(element, index);
        if(matchInList) return matchInList;
        break;
      }
      case MULTILINE_FIELD_BEGIN:
        if(!element.hasOwnProperty('template')) {  // TODO: More elegant copy detection?
          const matchInMultilineField = checkMultilineFieldByIndex(element, index);
          if(matchInMultilineField) return matchInMultilineField;
        }
        break;
      case SECTION:
        return checkInSectionByIndex(element, index);
    }
    break;
  }
  return { element: section, instruction: null };
};


exports.lookup = (position, input, options = {}) => {
  let { column, index, line } = position;

  const context = new Context(input, options);

  let match;
  if(index === undefined) {
    if(line < 0 || line >= context._lineCount)
      throw new RangeError(`You are trying to look up a line (${line}) outside of the document's line range (0-${context._lineCount - 1})`);

    match = checkInSectionByLine(context._document, line);
  } else {
    if(index < 0 || index > context._input.length)
      throw new RangeError(`You are trying to look up an index (${index}) outside of the document's index range (0-${context._input.length})`);

    match = checkInSectionByIndex(context._document, index);
  }

  const result = {
    element: new Element(context, match.element),
    range: null
  };

  let instruction = match.instruction;

  if(!instruction) {
    if(index === undefined) {
      instruction = context._meta.find(instruction => instruction.line === line);
    } else {
      instruction = context._meta.find(instruction =>
        index >= instruction.ranges.line[BEGIN] && index <= instruction.ranges.line[END]
      );
    }

    if(!instruction)
      return result;
  }

  let rightmostMatch = instruction.ranges.line[0];

  if(index === undefined) {
    index = instruction.ranges.line[0] + column;
  }

  for(const [type, range] of Object.entries(instruction.ranges)) {
    if(type === 'line') continue;

    if(index >= range[BEGIN] && index <= range[END] && range[BEGIN] >= rightmostMatch) {
      result.range = type;
      // TODO: Provide content of range too as convenience
      rightmostMatch = index;
    }
  }

  return result;
};
