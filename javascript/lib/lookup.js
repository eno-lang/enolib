const { Context } = require('./context.js');
const { Empty } = require('./elements/empty.js');
const { Field } = require('./elements/field.js');
const { Fieldset } = require('./elements/fieldset.js');
const { List } = require('./elements/list.js');
const { Element } = require('./elements/element.js');

// TODO: if(element.type === MULTILINE_FIELD_BEGIN) - Here and elsewhere there will be trouble if the multiline field is really COPIED, because then we can't go through .lines (!) revisit boldly

const {
  BEGIN,
  COMMENT,
  EMPTY_ELEMENT,
  END,
  FIELD,
  FIELDSET,
  FIELDSET_ENTRY,
  LIST,
  LIST_ITEM,
  MULTILINE_FIELD_BEGIN,
  MULTILINE_FIELD_VALUE,
  SECTION
} = require('./constants.js');

const checkMultilineField = (field, line, column) => {
  if(line < field.line || line > field.end.line)
    return false;

  if(line === field.line)
    return { element: field, instruction: field };

  if(line === field.end.line)
    return { element: field, instruction: field.end };

  return { element: field, instruction: field.lines.find(valueLine => valueLine.line === line) };
};

const checkMultilineFieldByIndex = (field, index) => {
  if(index < field.ranges.line[BEGIN] || index > field.end.ranges.line[END])  // TODO: Consider terminology 'range' => 'indices' everywhere ? (the "range name" then is the "range" simply)
    return false;

  if(index <= field.ranges.line[END])
    return { element: field, instruction: field };

  if(index >= field.end.ranges.line[BEGIN])
    return { element: field, instruction: field.end };

  return { element: field, instruction: field.lines.find(line => index <= line.ranges.line[END]) };
};

const checkField = (field, line, column) => {
  if(line < field.line)
    return false;

  if(line === field.line)
    return { element: field, instruction: field };

  if(field.continuations.length === 0 ||
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

  if(field.continuations.length === 0 ||
     index > field.continuations[field.continuations.length - 1].ranges.line[END])
    return false;

  for(const continuation of field.continuations) {
    if(index < continuation.ranges.line[BEGIN])
      return { element: field, instruction: null };
    if(index <= continuation.ranges.line[END])
      return { element: field, instruction: continuation };
  }
};

const checkFieldset = (fieldset, line, column) => {
  if(line < fieldset.line)
    return false;

  if(line === fieldset.line)
    return { element: fieldset, instruction: fieldset };

  if(fieldset.entries.length === 0 ||
     line > fieldset.entries[fieldset.entries.length - 1].line)
    return false;

  for(const entry of fieldset.entries) {
    if(line === entry.line)
      return { element: entry, instruction: entry };
    if(line < entry.line)
      return { element: fieldset, instruction: null };

    const matchInEntry = checkField(entry, line, column);

    if(matchInEntry)
      return matchInEntry;
  }
};

const checkFieldsetByIndex = (fieldset, index) => {
  if(index < fieldset.ranges.line[BEGIN])
    return false;

  if(index <= fieldset.ranges.line[END])
    return { element: fieldset, instruction: fieldset };

  if(fieldset.entries.length === 0 ||
     index > fieldset.entries[fieldset.entries.length - 1].ranges.line[END])
    return false;

  for(const entry of fieldset.entries) {
    if(index < entry.ranges.line[BEGIN])
      return { element: fieldset, instruction: null };
    if(index <= entry.ranges.line[END])
      return { element: entry, instruction: entry };

    const matchInEntry = checkFieldByIndex(entry, index);

    if(matchInEntry)
      return matchInEntry;
  }
};

const checkList = (list, line, column) => {
  if(line < list.line)
    return false;

  if(line === list.line)
    return { element: list, instruction: list };

  if(list.items.length === 0 ||
     line > list.items[list.items.length - 1].line)
    return false;

  for(const item of list.items) {
    if(line === item.line)
      return { element: item, instruction: item };
    if(line < item.line)
      return { element: list, instruction: null };

    const matchInItem = checkField(item, line, column);

    if(matchInItem)
      return matchInItem;
  }
};

const checkListByIndex = (list, index) => {
  if(index < list.ranges.line[BEGIN])
    return false;

  if(index <= list.ranges.line[END])
    return { element: list, instruction: list };

  if(list.entries.length === 0 ||
     index > list.entries[list.entries.length - 1].ranges.line[END])
    return false;

  for(const item of list.items) {
    if(index < item.ranges.line[BEGIN])
      return { element: list, instruction: null };
    if(index <= item.ranges.line[END])
      return { element: item, instruction: item };

    const matchInItem = checkFieldByIndex(item, index);

    if(matchInItem)
      return matchInItem;
  }
};

const checkInSection = (section, line, column) => {
  for(let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
    const element = section.elements[elementIndex];

    if(element.line > line)
      continue;

    if(element.line === line)
      return { element: element, instruction: element };

    switch(element.type) {
      case FIELD:
        const matchInField = checkField(element, line, column);
        if(matchInField) return matchInField;
        break;
      case FIELDSET:
        const matchInFieldset = checkFieldset(element, line, column);
        if(matchInFieldset) return matchInFieldset;
        break;
      case LIST:
        const matchInList = checkList(element, line, column);
        if(matchInList) return matchInList;
        break;
      case MULTILINE_FIELD_BEGIN:
        if(!element.hasOwnProperty('template')) {  // TODO: More elegant copy detection?
          const matchInMultilineField = checkMultilineField(element, line, column);
          if(matchInMultilineField) return matchInMultilineField;
        }
        break;
      case SECTION:
        return checkInSection(element, line, column);
    }
    break;
  }
  return { element: section, instruction: null };
};

const checkInSectionByIndex = (section, index) => {
  for(let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
    const element = section.elements[elementIndex];

    if(index < element.ranges.line[BEGIN])
      continue;

    if(index <= element.ranges.line[END])
      return { element: element, instruction: element };

    switch(element.type) {
      case FIELD:
        const matchInField = checkFieldByIndex(element, index);
        if(matchInField) return matchInField;
        break;
      case FIELDSET:
        const matchInFieldset = checkFieldsetByIndex(element, index);
        if(matchInFieldset) return matchInFieldset;
        break;
      case LIST:
        const matchInList = checkListByIndex(element, index);
        if(matchInList) return matchInList;
        break;
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

    match = checkInSection(context._document, line, column);
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
    instruction = context._meta.find(instruction => instruction.line === line);

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
