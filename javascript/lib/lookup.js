const { analyze } = require('./analyze.js');
const { Empty } = require('./elements/empty.js');
const { en } = require('./messages/en.js');
const { Field } = require('./elements/field.js');
const { Fieldset } = require('./elements/fieldset.js');
const { List } = require('./elements/list.js');
const { resolve } =  require('./resolve.js');
const { TextReporter } = require('./reporters/text_reporter.js');
const { Section } = require('./elements/section.js');

// TODO: if(element.type === MULTILINE_FIELD_BEGIN) - Here and elsewhere there will be trouble if the multiline field is really COPIED, because then we can't go through .lines (!) revisit boldly

const {
  BEGIN,
  COMMENT,
  ELEMENT,
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

const checkMultilineField = (context, field, line, column) => {
  if(line < field.line || line > field.end.line)
    return false;

  if(line === field.line)
    return { element: new Field(context, field), instruction: field };

  if(line === field.end.line)
    return { element: new Field(context, field), instruction: field.end };

  return {
    element: new Field(context, field),
    instruction: field.lines.find(valueLine => valueLine.line === line)
  };
};

const checkMultilineFieldByIndex = (context, field, index) => {
  if(index < field.ranges.line[BEGIN] || index > field.end.ranges.line[END])  // TODO: Consider terminology 'range' => 'indices' everywhere ? (the "range name" then is the "range" simply)
    return false;

  if(index <= field.ranges.line[END])
    return { element: new Field(context, field), instruction: field };

  if(index >= field.end.ranges.line[BEGIN])
    return { element: new Field(context, field), instruction: field.end };

  return {
    element: new Field(context, field),
    instruction: field.lines.find(line => index <= line.ranges.line[END])
  };
};

const checkField = (context, field, line, column) => {
  if(line < field.line)
    return false;

  if(line === field.line)
    return { element: new Field(context, field), instruction: field };

  if(field.continuations.length === 0 ||
     line > field.continuations[field.continuations.length - 1].line)
    return false;

  for(const continuation of field.continuations) {
    if(line === continuation.line)
      return { element: new Field(context, field), instruction: continuation };
    if(line < continuation.line)
      return { element: new Field(context, field), instruction: null };
  }
};

const checkFieldByIndex = (context, field, index) => {
  if(index < field.ranges.line[BEGIN])
    return false;

  if(index <= field.ranges.line[END])
    return { element: new Field(context, field), instruction: field };

  if(field.continuations.length === 0 ||
     index > field.continuations[field.continuations.length - 1].ranges.line[END])
    return false;

  for(const continuation of field.continuations) {
    if(index < continuation.ranges.line[BEGIN])
      return { element: new Field(context, field), instruction: null };
    if(index <= continuation.ranges.line[END])
      return { element: new Field(context, field), instruction: continuation };
  }
};

const checkFieldset = (context, fieldset, line, column) => {
  if(line < fieldset.line)
    return false;

  if(line === fieldset.line)
    return { element: new Fieldset(context, fieldset), instruction: fieldset };

  if(fieldset.entries.length === 0 ||
     line > fieldset.entries[fieldset.entries.length - 1].line)
    return false;

  for(const entry of fieldset.entries) {
    if(line === entry.line)
      return { element: new Field(context, entry), instruction: entry };
    if(line < entry.line)
      return { element: new Fieldset(context, fieldset), instruction: null };

    const matchInEntry = checkField(context, entry, line, column);

    if(matchInEntry)
      return matchInEntry;
  }
};

const checkFieldsetByIndex = (context, fieldset, index) => {
  if(index < fieldset.ranges.line[BEGIN])
    return false;

  if(index <= fieldset.ranges.line[END])
    return { element: new Fieldset(context, fieldset), instruction: fieldset };

  if(fieldset.entries.length === 0 ||
     index > fieldset.entries[fieldset.entries.length - 1].ranges.line[END])
    return false;

  for(const entry of fieldset.entries) {
    if(index < entry.ranges.line[BEGIN])
      return { element: new Fieldset(context, fieldset), instruction: null };
    if(index <= entry.ranges.line[END])
      return { element: new Field(context, entry), instruction: entry };

    const matchInEntry = checkFieldByIndex(context, entry, index);

    if(matchInEntry)
      return matchInEntry;
  }
};

const checkList = (context, list, line, column) => {
  if(line < list.line)
    return false;

  if(line === list.line)
    return { element: new List(context, list), instruction: list };

  if(list.items.length === 0 ||
     line > list.items[list.items.length - 1].line)
    return false;

  for(const item of list.items) {
    if(line === item.line)
      return { element: new Field(context, item), instruction: item };
    if(line < item.line)
      return { element: new List(context, list), instruction: null };

    const matchInItem = checkField(context, item, line, column);

    if(matchInItem)
      return matchInItem;
  }
};

const checkListByIndex = (context, list, index) => {
  if(index < list.ranges.line[BEGIN])
    return false;

  if(index <= list.ranges.line[END])
    return { element: new Fieldset(context, list), instruction: list };

  if(list.entries.length === 0 ||
     index > list.entries[list.entries.length - 1].ranges.line[END])
    return false;

  for(const item of list.items) {
    if(index < item.ranges.line[BEGIN])
      return { element: new Fieldset(context, list), instruction: null };
    if(index <= item.ranges.line[END])
      return { element: new Field(context, item), instruction: item };

    const matchInItem = checkFieldByIndex(context, item, index);

    if(matchInItem)
      return matchInItem;
  }
};

const checkInSection = (context, section, line, column) => {
  for(let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
    const element = section.elements[elementIndex];

    if(element.line > line)
      continue;

    // TODO: Probably redundant because done in check* methods below anyway? (except for ELEMENT)
    if(element.line === line) {
      switch(element.type) {
        case ELEMENT: return { element: new Empty(context, element), instruction: element };
        case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
        case FIELD: return { element: new Field(context, element), instruction: element };
        case FIELDSET: return { element: new Fieldset(context, element), instruction: element };
        case LIST: return { element: new List(context, element), instruction: element };
        case SECTION: return { element: new Section(context, element), instruction: element };
      }
    }

    if(element.type === SECTION)
      return checkInSection(context, element, line, column);

    if(element.type === MULTILINE_FIELD_BEGIN && !element.hasOwnProperty('template')) {  // TODO: More elegant copy detection?
      const matchInMultilineField = checkMultilineField(context, element, line, column);
      if(matchInMultilineField) return matchInMultilineField;
    }

    if(element.type === FIELD) {
      const matchInField = checkField(context, element, line, column);
      if(matchInField) return matchInField;
    }

    if(element.type === FIELDSET) {
      const matchInFieldset = checkFieldset(context, element, line, column);
      if(matchInFieldset) return matchInFieldset;
    }

    if(element.type === LIST) {
      const matchInList = checkList(context, element, line, column);
      if(matchInList) return matchInList;
    }

    break;
  }

  return { element: section, instruction: null };
};

const checkInSectionByIndex = (context, section, index) => {
  for(let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
    const element = section.elements[elementIndex];

    if(index < element.ranges.line[BEGIN])
      continue;

    // TODO: Probably redundant because done in check* methods below anyway? (except for ELEMENT)
    if(index <= element.ranges.line[END]) {
      switch(element.type) {
        case ELEMENT: return { element: new Empty(context, element), instruction: element };
        case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
        case FIELD: return { element: new Field(context, element), instruction: element };
        case FIELDSET: return { element: new Fieldset(context, element), instruction: element };
        case LIST: return { element: new List(context, element), instruction: element };
        case SECTION: return { element: new Section(context, element), instruction: element };
      }
    }

    if(element.type === SECTION)
      return checkInSectionByIndex(context, element, index);

    if(element.type === MULTILINE_FIELD_BEGIN && !element.hasOwnProperty('template')) {  // TODO: More elegant copy detection?
      const matchInMultilineField = checkMultilineFieldByIndex(context, element, index);
      if(matchInMultilineField) return matchInMultilineField;
    }

    if(element.type === FIELD) {
      const matchInField = checkFieldByIndex(context, element, index);
      if(matchInField) return matchInField;
    }

    if(element.type === FIELDSET) {
      const matchInFieldset = checkFieldsetByIndex(context, element, index);
      if(matchInFieldset) return matchInFieldset;
    }

    if(element.type === LIST) {
      const matchInList = checkListByIndex(context, element, index);
      if(matchInList) return matchInList;
    }

    break;
  }

  return { element: section, instruction: null };
};

exports.lookup = (position, input, options = {}) => {
  let { column, index, line } = position;

  const context = {
    input,
    messages: options.hasOwnProperty('locale') ? options.locale : en,
    reporter: options.hasOwnProperty('reporter') ? options.reporter : TextReporter,
    source: options.hasOwnProperty('source') ? options.source : null
  };

  analyze(context);

  if(context.hasOwnProperty('copy')) {
    resolve(context);
  }

  if(index) {
    if(index < 0 || index >= context.input.length)
      throw new RangeError(`You are trying to look up an index (${index}) outside of the document's index range (0-${context.input.length - 1})`);
  } else if(line < 0 || line >= context.lineCount) {
    throw new RangeError(`You are trying to look up a line (${line}) outside of the document's line range (0-${context.lineCount - 1})`);
  }

  let match;
  if(index) {
    match = checkInSectionByIndex(context, context.document, index);
  } else {
    match = checkInSection(context, context.document, line, column);
  }

  const result = {
    element: match.element,
    range: null
  };

  let instruction = match.instruction;

  if(!instruction) {
    instruction = context.meta.find(instruction => instruction.line === line);

    if(!instruction)
      return result;
  }

  let rightmostMatch = instruction.ranges.line[0];

  if(!index) {
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
