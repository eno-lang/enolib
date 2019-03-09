const { errors } = require('./errors/parsing.js');
const matcher = require('./grammar_matcher.js');
const {
  COMMENT,
  CONTINUATION,
  DOCUMENT,
  EMPTY_ELEMENT,
  FIELD,
  FIELDSET,
  FIELDSET_ENTRY,
  LIST,
  LIST_ITEM,
  MULTILINE_FIELD_BEGIN,
  MULTILINE_FIELD_END,
  MULTILINE_FIELD_VALUE,
  SECTION,
  UNPARSED
} = require('./constants.js');

const tokenizeErrorContext = (context, index, line) => {
  let firstInstruction = null;

  while(true) {
    const endOfLineIndex = context.input.indexOf('\n', index);

    if(endOfLineIndex === -1) {
      const instruction = {
        line: line,
        ranges: { line: [index, context.input.length ] }
      };

      if(firstInstruction) {
        instruction.type = UNPARSED;
      }

      context.lineCount = line + 1;
      context.meta.push(instruction);

      return firstInstruction || instruction;
    } else {
      const instruction = {
        line: line,
        ranges: { line: [index, endOfLineIndex] }
      };

      context.meta.push(instruction);

      if(firstInstruction) {
        instruction.type = UNPARSED;
      } else {
        firstInstruction = instruction;
      }

      index = endOfLineIndex + 1;
      line++;
    }
  }
};

exports.analyze = context => {
  context.document = {
    depth: 0,
    elements: []
  };

  // TODO: Possibly flatten into two properties?
  context.copy = {
    nonSectionElements: {},
    sections: {}
  };

  context.meta = [];

  let comments = null;
  let lastContinuableElement = null;
  let lastNonSectionElement = null;
  let lastSection = context.document;

  let index = 0;
  let line = 0;
  const matcherRegex = matcher.GRAMMAR_REGEXP;
  matcherRegex.lastIndex = index;

  let instruction;

  while(true) {
    const match = matcherRegex.exec(context.input);

    if(match === null) {
      const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing
      throw errors.invalidLine(context, instruction);
    } else {
      instruction = {
        line: line,
        ranges: {
          line: [index, matcherRegex.lastIndex]
        }
      };
    }

    if(match[matcher.EMPTY_LINE_INDEX] !== undefined) {

      if(comments) {
        context.meta.push(...comments);
        comments = null;
      }

    } else if(match[matcher.ELEMENT_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      const unescapedKey = match[matcher.KEY_UNESCAPED_INDEX];
      let elementOperatorIndex;

      if(unescapedKey) {
        instruction.key = unescapedKey;

        const keyIndex = context.input.indexOf(instruction.key, index);
        elementOperatorIndex = context.input.indexOf(':', keyIndex + instruction.key.length);

        instruction.ranges.elementOperator = [elementOperatorIndex, elementOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      } else {
        instruction.key = match[matcher.KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, index);
        const keyIndex = context.input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, keyIndex + instruction.key.length);
        elementOperatorIndex = context.input.indexOf(':', escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
        instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
        instruction.ranges.elementOperator = [elementOperatorIndex, elementOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      }

      const value = match[matcher.FIELD_VALUE_INDEX];
      if(value) {
        instruction.continuations = [];
        instruction.type = FIELD;
        instruction.value = value;

        const valueIndex = context.input.indexOf(value, elementOperatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + value.length];
      } else {
        instruction.type = EMPTY_ELEMENT;
      }

      instruction.parent = lastSection;
      lastSection.elements.push(instruction);
      lastContinuableElement = instruction;
      lastNonSectionElement = instruction;

    } else if(match[matcher.LIST_ITEM_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      instruction.continuations = [];
      instruction.type = LIST_ITEM;
      instruction.value = match[matcher.LIST_ITEM_VALUE_INDEX] || null;

      const operatorIndex = context.input.indexOf('-', index);

      instruction.ranges.itemOperator = [operatorIndex, operatorIndex + 1];

      if(instruction.value) {
        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      }

      if(lastNonSectionElement === null) {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingListForListItem(context, instruction);
      } else if(lastNonSectionElement.type === LIST) {
        lastNonSectionElement.items.push(instruction);
      } else if(lastNonSectionElement.type === EMPTY_ELEMENT) {
        lastNonSectionElement.items = [instruction];
        lastNonSectionElement.type = LIST;
      } else {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingListForListItem(context, instruction);
      }

      instruction.parent = lastNonSectionElement;
      lastContinuableElement = instruction;

    } else if(match[matcher.FIELDSET_ENTRY_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      instruction.continuations = [];
      instruction.type = FIELDSET_ENTRY;

      let entryOperatorIndex;

      if(match[matcher.KEY_UNESCAPED_INDEX] === undefined) {
        instruction.key = match[matcher.KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, index);
        const keyIndex = context.input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, keyIndex + instruction.key.length);
        entryOperatorIndex = context.input.indexOf('=', escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
        instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
        instruction.ranges.entryOperator = [entryOperatorIndex, entryOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      } else {
        instruction.key = match[matcher.KEY_UNESCAPED_INDEX];

        const keyIndex = context.input.indexOf(instruction.key, index);
        entryOperatorIndex = context.input.indexOf('=', keyIndex + instruction.key.length);

        instruction.ranges.entryOperator = [entryOperatorIndex, entryOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      }

      if(match[matcher.FIELDSET_ENTRY_VALUE_INDEX] === undefined) {
        instruction.value = null;
      } else {
        instruction.value = match[matcher.FIELDSET_ENTRY_VALUE_INDEX];

        const valueIndex = context.input.indexOf(instruction.value, entryOperatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      }

      if(lastNonSectionElement === null) {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingFieldsetForFieldsetEntry(context, instruction);
      } else if(lastNonSectionElement.type === FIELDSET) {
        lastNonSectionElement.entries.push(instruction);
      } else if(lastNonSectionElement.type === EMPTY_ELEMENT) {
        lastNonSectionElement.entries = [instruction];
        lastNonSectionElement.type = FIELDSET;
      } else {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingFieldsetForFieldsetEntry(context, instruction);
      }

      instruction.parent = lastNonSectionElement;
      lastContinuableElement = instruction;

    } else if(match[matcher.SPACED_LINE_CONTINUATION_OPERATOR_INDEX] !== undefined) {

      if(lastContinuableElement === null) {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingElementForContinuation(context, instruction);
      }

      instruction.spaced = true;
      instruction.type = CONTINUATION;

      const operatorIndex = context.input.indexOf('\\', index);
      instruction.ranges.spacedLineContinuationOperator = [operatorIndex, operatorIndex + 1];

      if(match[matcher.SPACED_LINE_CONTINUATION_VALUE_INDEX] === undefined) {
        instruction.value = null;
      } else {
        instruction.value = match[matcher.SPACED_LINE_CONTINUATION_VALUE_INDEX];

        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      }

      if(lastContinuableElement.type === EMPTY_ELEMENT) {
        lastContinuableElement.continuations = [instruction];
        lastContinuableElement.type = FIELD;
      } else {
        lastContinuableElement.continuations.push(instruction);
      }

      if(comments) {
        context.meta.push(...comments);
        comments = null;
      }


    } else if(match[matcher.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX] !== undefined) {

      if(lastContinuableElement === null) {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingElementForContinuation(context, instruction);
      }

      instruction.spaced = false;
      instruction.type = CONTINUATION;

      const operatorIndex = context.input.indexOf('|', index);
      instruction.ranges.directLineContinuationOperator = [operatorIndex, operatorIndex + 1];

      if(match[matcher.DIRECT_LINE_CONTINUATION_VALUE_INDEX] !== undefined) {
        instruction.value = match[matcher.DIRECT_LINE_CONTINUATION_VALUE_INDEX];
        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      } else {
        instruction.value = null;
      }

      if(lastContinuableElement.type === EMPTY_ELEMENT) {
        lastContinuableElement.continuations = [instruction];
        lastContinuableElement.type = FIELD;
      } else {
        lastContinuableElement.continuations.push(instruction);
      }

      if(comments) {
        context.meta.push(...comments);
        comments = null;
      }

    } else if(match[matcher.SECTION_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      const sectionOperator = match[matcher.SECTION_OPERATOR_INDEX];

      instruction.depth = sectionOperator.length;

      if(instruction.depth === lastSection.depth + 1) {
        instruction.parent = lastSection;
      } else if(instruction.depth === lastSection.depth) {
        instruction.parent = lastSection.parent;
      } else if(instruction.depth < lastSection.depth) {
        while(instruction.depth < lastSection.depth) {
          lastSection = lastSection.parent;
        }

        instruction.parent = lastSection.parent;
      } else {
        const instruction = tokenizeErrorContext(context, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.sectionHierarchyLayerSkip(context, instruction, lastSection);
      }

      instruction.parent.elements.push(instruction);
      lastSection = instruction;

      instruction.elements = [];
      instruction.type = SECTION;

      const sectionOperatorIndex = context.input.indexOf(sectionOperator, index);
      const unescapedKey = match[matcher.SECTION_KEY_UNESCAPED_INDEX];
      let keyEndIndex;

      if(unescapedKey) {
        instruction.key = unescapedKey;

        const keyIndex = context.input.indexOf(instruction.key, sectionOperatorIndex + sectionOperator.length);
        keyEndIndex = keyIndex + unescapedKey.length;

        instruction.ranges.key = [keyIndex, keyIndex + unescapedKey.length];
        instruction.ranges.sectionOperator = [sectionOperatorIndex, sectionOperatorIndex + sectionOperator.length];
      } else {
        instruction.key = match[matcher.SECTION_KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, sectionOperatorIndex + sectionOperator.length);
        const keyIndex = context.input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, keyIndex + instruction.key.length);
        keyEndIndex = escapeEndOperatorIndex + escapeOperator.length;

        instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
        instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
        instruction.ranges.sectionOperator = [sectionOperatorIndex, sectionOperatorIndex + sectionOperator.length];
      }

      if(match[matcher.SECTION_TEMPLATE_INDEX] !== undefined) {
        instruction.template = match[matcher.SECTION_TEMPLATE_INDEX];

        for(let parent = instruction.parent; parent.hasOwnProperty('parent'); parent = parent.parent) {
          parent.deepResolve = true;
        }

        const copyOperator = match[matcher.SECTION_COPY_OPERATOR_INDEX];
        const copyOperatorIndex = context.input.indexOf(copyOperator, keyEndIndex);
        const templateIndex = context.input.indexOf(instruction.template, copyOperatorIndex + copyOperator.length);

        instruction.deepCopy = copyOperator.length > 1;

        if(instruction.deepCopy) {
          instruction.ranges.deepCopyOperator = [copyOperatorIndex, copyOperatorIndex + copyOperator.length];
        } else {
          instruction.ranges.copyOperator = [copyOperatorIndex, copyOperatorIndex + copyOperator.length];
        }

        instruction.ranges.template = [templateIndex, templateIndex + instruction.template.length];

        if(context.copy.sections.hasOwnProperty(instruction.template)) {
          context.copy.sections[instruction.template].targets.push(instruction);
        } else {
          context.copy.sections[instruction.template] = { targets: [instruction] };
        }

        instruction.copy = context.copy.sections[instruction.template];
      }

      lastContinuableElement = null;
      lastNonSectionElement = null; // TODO: Actually wrong terminology - it's a Field/List/Fieldset but can't be List Item or Fieldset Entry!

    } else if(match[matcher.MULTILINE_FIELD_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      const operator = match[matcher.MULTILINE_FIELD_OPERATOR_INDEX];

      instruction.key = match[matcher.MULTILINE_FIELD_KEY_INDEX];
      instruction.lines = [];
      instruction.type = MULTILINE_FIELD_BEGIN;

      let operatorIndex = context.input.indexOf(operator, index);
      let keyIndex = context.input.indexOf(instruction.key, operatorIndex + operator.length);

      instruction.ranges.multilineFieldOperator = [operatorIndex, operatorIndex + operator.length];
      instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];

      index = matcherRegex.lastIndex + 1;
      line += 1;

      instruction.parent = lastSection;
      lastSection.elements.push(instruction);

      lastContinuableElement = null;
      lastNonSectionElement = instruction;

      const startOfMultilineFieldIndex = index;

      const keyEscaped = instruction.key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const terminatorMatcher = new RegExp(`[^\\S\\n]*(${operator})(?!-)[^\\S\\n]*(${keyEscaped})[^\\S\\n]*(?=\\n|$)`, 'y');

      while(true) {
        terminatorMatcher.lastIndex = index;
        let terminatorMatch = terminatorMatcher.exec(context.input);

        if(terminatorMatch) {
          operatorIndex = context.input.indexOf(operator, index);
          keyIndex = context.input.indexOf(instruction.key, operatorIndex + operator.length);

          instruction = {
            line: line,
            ranges: {
              line: [index, terminatorMatcher.lastIndex],
              multilineFieldOperator: [operatorIndex, operatorIndex + operator.length],
              key: [keyIndex, keyIndex + instruction.key.length]
            },
            type: MULTILINE_FIELD_END
          };

          lastNonSectionElement.end = instruction;
          lastNonSectionElement = null;

          matcherRegex.lastIndex = terminatorMatcher.lastIndex;

          break;
        } else {
          const endofLineIndex = context.input.indexOf('\n', index);

          if(endofLineIndex === -1) {
            lastNonSectionElement.lines.push({
              line: line,
              ranges: {
                line: [index, context.input.length],
                value: [index, context.input.length]  // TODO: line range === value range, drop value range? (see how the custom terminal reporter eg. handles this for syntax coloring, then revisit)
              },
              type: MULTILINE_FIELD_VALUE
            });

            throw errors.unterminatedMultilineField(context, instruction);
          } else {
            lastNonSectionElement.lines.push({
              line: line,
              ranges: {
                line: [index, endofLineIndex],
                value: [index, endofLineIndex]  // TODO: line range === value range, drop value range? (see how the custom terminal reporter eg. handles this for syntax coloring, then revisit)
              },
              type: MULTILINE_FIELD_VALUE
            });

            index = endofLineIndex + 1;
            line++;
          }
        }
      }

    } else if(match[matcher.COPY_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      instruction.template = match[matcher.TEMPLATE_INDEX]; // TODO: We can possibly make this ephemeral (local variable) because the new copyData reference replaces its function
      instruction.type = ELEMENT;

      const copyOperator = match[matcher.COPY_OPERATOR_INDEX];
      let copyOperatorIndex;

      if(match[matcher.KEY_UNESCAPED_INDEX] !== undefined) {
        instruction.key = match[matcher.KEY_UNESCAPED_INDEX];

        const keyIndex = context.input.indexOf(instruction.key, index);
        copyOperatorIndex = context.input.indexOf(copyOperator, keyIndex + instruction.key.length);

        instruction.ranges.copyOperator = [copyOperatorIndex, copyOperatorIndex + copyOperator.length];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      } else {
        instruction.key = match[matcher.KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, index);
        const keyIndex = context.input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, keyIndex + instruction.key.length);
        copyOperatorIndex = context.input.indexOf(copyOperator, escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges.copyOperator = [copyOperatorIndex, copyOperatorIndex + copyOperator.length];
        instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
        instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      }

      const templateIndex = context.input.indexOf(instruction.template, copyOperatorIndex + 1);
      instruction.ranges.template = [templateIndex, templateIndex + instruction.template.length];

      instruction.parent = lastSection;
      lastSection.elements.push(instruction);
      lastContinuableElement = null;
      lastNonSectionElement = instruction;

      if(context.copy.nonSectionElements.hasOwnProperty(instruction.template)) {
        context.copy.nonSectionElements[instruction.template].targets.push(instruction);
      } else {
        context.copy.nonSectionElements[instruction.template] = { targets: [instruction] };
      }

      instruction.copy = context.copy.nonSectionElements[instruction.template];

    } else if(match[matcher.COMMENT_OPERATOR_INDEX] !== undefined) {

      if(comments === null) {
        comments = [instruction];
      } else {
        comments.push(instruction);
      }

      instruction.type = COMMENT;

      const operatorIndex = context.input.indexOf('>', index);
      instruction.ranges.commentOperator = [operatorIndex, operatorIndex + 1];

      if(match[matcher.COMMENT_VALUE_INDEX] !== undefined) {
        instruction.value = match[matcher.COMMENT_VALUE_INDEX];

        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      } else {
        instruction.value = null;
      }

    }

    line += 1;
    index = matcherRegex.lastIndex + 1;
    matcherRegex.lastIndex = index;

    if(index >= context.input.length) {
      // TODO: Possibly solve this by capturing with the unified grammar matcher as last group
      if(context.input[context.input.length - 1] === '\n') {
        context.lineCount = line + 1;
      } else {
        context.lineCount = line;
      }

      break;
    }
  } // ends while(true)

  if(comments) {
    context.meta.push(...comments);
  }
};
