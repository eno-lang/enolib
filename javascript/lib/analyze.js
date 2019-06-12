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

  let endOfLineIndex;
  while((endOfLineIndex = context._input.indexOf('\n', index)) !== -1) {
    const instruction = {
      line: line,
      ranges: { line: [index, endOfLineIndex] }
    };

    context._meta.push(instruction);

    if(firstInstruction) {
      instruction.type = UNPARSED;
    } else {
      firstInstruction = instruction;
    }

    index = endOfLineIndex + 1;
    line++;
  }

  const instruction = {
    line: line,
    ranges: { line: [index, context._input.length ] }
  };

  if(firstInstruction) {
    instruction.type = UNPARSED;
  }

  context._lineCount = line + 1;
  context._meta.push(instruction);

  return firstInstruction || instruction;
};

exports.analyze = function() {
  this._document = {
    depth: 0,
    elements: [],
    type: DOCUMENT
  };

  // TODO: Possibly flatten into two properties?
  this.copy = {
    nonSectionElements: {},
    sections: {}
  };

  this._meta = [];

  if(this._input.length === 0) {
    this._lineCount = 1;
    return;
  }

  let comments = null;
  let lastContinuableElement = null;
  let lastNonSectionElement = null;
  let lastSection = this._document;

  let index = 0;
  let line = 0;
  const matcherRegex = matcher.GRAMMAR_REGEXP;
  matcherRegex.lastIndex = index;

  let instruction;

  while(index < this._input.length) {
    const match = matcherRegex.exec(this._input);

    if(match === null) {
      const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing
      throw errors.invalidLine(this, instruction);
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
        this._meta.push(...comments);
        comments = null;
      }

    } else if(match[matcher.ELEMENT_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      instruction.key = match[matcher.KEY_UNESCAPED_INDEX];

      let elementOperatorIndex;
      if(instruction.key !== undefined) {
        const keyIndex = this._input.indexOf(instruction.key, index);
        elementOperatorIndex = this._input.indexOf(':', keyIndex + instruction.key.length);

        instruction.ranges.elementOperator = [elementOperatorIndex, elementOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      } else {
        instruction.key = match[matcher.KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, index);
        const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);
        elementOperatorIndex = this._input.indexOf(':', escapeEndOperatorIndex + escapeOperator.length);

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

        const valueIndex = this._input.indexOf(value, elementOperatorIndex + 1);
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

      instruction.continuations = [];  // TODO: Forward allocation of this kind is planned to be removed like in python implementation
      instruction.type = LIST_ITEM;
      instruction.value = match[matcher.LIST_ITEM_VALUE_INDEX] || null;

      const operatorIndex = this._input.indexOf('-', index);

      instruction.ranges.itemOperator = [operatorIndex, operatorIndex + 1];

      if(instruction.value) {
        const valueIndex = this._input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      }

      if(lastNonSectionElement === null) {
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingListForListItem(this, instruction);
      } else if(lastNonSectionElement.type === LIST) {
        lastNonSectionElement.items.push(instruction);
      } else if(lastNonSectionElement.type === EMPTY_ELEMENT) {
        lastNonSectionElement.items = [instruction];
        lastNonSectionElement.type = LIST;
      } else {
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingListForListItem(this, instruction);
      }

      instruction.parent = lastNonSectionElement;
      lastContinuableElement = instruction;

    } else if(match[matcher.FIELDSET_ENTRY_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      instruction.continuations = []; // TODO: Only create ad-hoc, remove here and elsewhere, generally follow this pattern of allocation sparsity
      instruction.type = FIELDSET_ENTRY;

      let entryOperatorIndex;

      if(match[matcher.KEY_UNESCAPED_INDEX] === undefined) {
        instruction.key = match[matcher.KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, index);
        const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);
        entryOperatorIndex = this._input.indexOf('=', escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
        instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
        instruction.ranges.entryOperator = [entryOperatorIndex, entryOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      } else {
        instruction.key = match[matcher.KEY_UNESCAPED_INDEX];

        const keyIndex = this._input.indexOf(instruction.key, index);
        entryOperatorIndex = this._input.indexOf('=', keyIndex + instruction.key.length);

        instruction.ranges.entryOperator = [entryOperatorIndex, entryOperatorIndex + 1];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
      }

      if(match[matcher.FIELDSET_ENTRY_VALUE_INDEX] === undefined) {
        instruction.value = null;
      } else {
        instruction.value = match[matcher.FIELDSET_ENTRY_VALUE_INDEX];

        const valueIndex = this._input.indexOf(instruction.value, entryOperatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      }

      if(lastNonSectionElement === null) {
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingFieldsetForFieldsetEntry(this, instruction);
      } else if(lastNonSectionElement.type === FIELDSET) {
        lastNonSectionElement.entries.push(instruction);
      } else if(lastNonSectionElement.type === EMPTY_ELEMENT) {
        lastNonSectionElement.entries = [instruction];
        lastNonSectionElement.type = FIELDSET;
      } else {
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingFieldsetForFieldsetEntry(this, instruction);
      }

      instruction.parent = lastNonSectionElement;
      lastContinuableElement = instruction;

    } else if(match[matcher.SPACED_LINE_CONTINUATION_OPERATOR_INDEX] !== undefined) {

      if(lastContinuableElement === null) {
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingElementForContinuation(this, instruction);
      }

      instruction.spaced = true;
      instruction.type = CONTINUATION;

      const operatorIndex = this._input.indexOf('\\', index);
      instruction.ranges.spacedLineContinuationOperator = [operatorIndex, operatorIndex + 1];

      if(match[matcher.SPACED_LINE_CONTINUATION_VALUE_INDEX] === undefined) {
        instruction.value = null;
      } else {
        instruction.value = match[matcher.SPACED_LINE_CONTINUATION_VALUE_INDEX];

        const valueIndex = this._input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
      }

      if(lastContinuableElement.type === EMPTY_ELEMENT) {
        lastContinuableElement.continuations = [instruction];
        lastContinuableElement.type = FIELD;
      } else {
        lastContinuableElement.continuations.push(instruction);
      }

      if(comments) {
        this._meta.push(...comments);
        comments = null;
      }


    } else if(match[matcher.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX] !== undefined) {

      if(lastContinuableElement === null) {
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.missingElementForContinuation(this, instruction);
      }

      instruction.spaced = false;  // TODO: Just leave out
      instruction.type = CONTINUATION;

      const operatorIndex = this._input.indexOf('|', index);
      instruction.ranges.directLineContinuationOperator = [operatorIndex, operatorIndex + 1];

      if(match[matcher.DIRECT_LINE_CONTINUATION_VALUE_INDEX] !== undefined) {
        instruction.value = match[matcher.DIRECT_LINE_CONTINUATION_VALUE_INDEX];
        const valueIndex = this._input.indexOf(instruction.value, operatorIndex + 1);
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
        this._meta.push(...comments);
        comments = null;
      }

    } else if(match[matcher.SECTION_OPERATOR_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      const sectionOperator = match[matcher.SECTION_OPERATOR_INDEX];

      instruction.depth = sectionOperator.length;
      instruction.elements = [];
      instruction.type = SECTION;

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
        const instruction = tokenizeErrorContext(this, index, line);  // TODO: variable shadowing etc., generally whack
        throw errors.sectionHierarchyLayerSkip(this, instruction, lastSection);
      }

      instruction.parent.elements.push(instruction);
      lastSection = instruction;

      const sectionOperatorIndex = this._input.indexOf(sectionOperator, index);
      instruction.key = match[matcher.SECTION_KEY_UNESCAPED_INDEX];
      let keyEndIndex;

      if(instruction.key !== undefined) {
        const keyIndex = this._input.indexOf(instruction.key, sectionOperatorIndex + sectionOperator.length);
        keyEndIndex = keyIndex + instruction.key.length;

        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
        instruction.ranges.sectionOperator = [sectionOperatorIndex, sectionOperatorIndex + sectionOperator.length];
      } else {
        instruction.key = match[matcher.SECTION_KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, sectionOperatorIndex + sectionOperator.length);
        const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);
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
        const copyOperatorIndex = this._input.indexOf(copyOperator, keyEndIndex);
        const templateIndex = this._input.indexOf(instruction.template, copyOperatorIndex + copyOperator.length);

        instruction.deepCopy = copyOperator.length > 1;

        if(instruction.deepCopy) {
          instruction.ranges.deepCopyOperator = [copyOperatorIndex, copyOperatorIndex + copyOperator.length];
        } else {
          instruction.ranges.copyOperator = [copyOperatorIndex, copyOperatorIndex + copyOperator.length];
        }

        instruction.ranges.template = [templateIndex, templateIndex + instruction.template.length];

        if(this.copy.sections.hasOwnProperty(instruction.template)) {
          this.copy.sections[instruction.template].targets.push(instruction);
        } else {
          this.copy.sections[instruction.template] = { targets: [instruction] };
        }

        instruction.copy = this.copy.sections[instruction.template];
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

      let operatorIndex = this._input.indexOf(operator, index);
      let keyIndex = this._input.indexOf(instruction.key, operatorIndex + operator.length);

      instruction.ranges.multilineFieldOperator = [operatorIndex, operatorIndex + operator.length];
      instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];

      index = matcherRegex.lastIndex + 1;
      line += 1;

      instruction.parent = lastSection;
      lastSection.elements.push(instruction);

      lastContinuableElement = null;
      lastNonSectionElement = instruction;

      const keyEscaped = instruction.key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const terminatorMatcher = new RegExp(`[^\\S\\n]*(${operator})(?!-)[^\\S\\n]*(${keyEscaped})[^\\S\\n]*(?=\\n|$)`, 'y');

      while(true) {
        terminatorMatcher.lastIndex = index;
        let terminatorMatch = terminatorMatcher.exec(this._input);

        if(terminatorMatch) {
          operatorIndex = this._input.indexOf(operator, index);
          keyIndex = this._input.indexOf(instruction.key, operatorIndex + operator.length);

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
          const endofLineIndex = this._input.indexOf('\n', index);

          if(endofLineIndex === -1) {
            lastNonSectionElement.lines.push({
              line: line,
              ranges: {
                line: [index, this._input.length],
                value: [index, this._input.length]  // TODO: line range === value range, drop value range? (see how the custom terminal reporter eg. handles this for syntax coloring, then revisit)
              },
              type: MULTILINE_FIELD_VALUE
            });

            throw errors.unterminatedMultilineField(this, instruction);
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

    } else if(match[matcher.TEMPLATE_INDEX] !== undefined) {

      if(comments) {
        instruction.comments = comments;
        comments = null;
      }

      instruction.template = match[matcher.TEMPLATE_INDEX]; // TODO: We can possibly make this ephemeral (local variable) because the new copyData reference replaces its function
      instruction.type = EMPTY_ELEMENT;

      let copyOperatorIndex;

      instruction.key = match[matcher.KEY_UNESCAPED_INDEX];

      if(instruction.key !== undefined) {
        const keyIndex = this._input.indexOf(instruction.key, index);
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];

        copyOperatorIndex = this._input.indexOf('<', keyIndex + instruction.key.length);
      } else {
        instruction.key = match[matcher.KEY_ESCAPED_INDEX];

        const escapeOperator = match[matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, index);
        const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);

        instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
        instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
        instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];

        copyOperatorIndex = this._input.indexOf('<', escapeEndOperatorIndex + escapeOperator.length);
      }

      instruction.ranges.copyOperator = [copyOperatorIndex, copyOperatorIndex + 1];

      const templateIndex = this._input.indexOf(instruction.template, copyOperatorIndex + 1);
      instruction.ranges.template = [templateIndex, templateIndex + instruction.template.length];

      instruction.parent = lastSection;
      lastSection.elements.push(instruction);
      lastContinuableElement = null;
      lastNonSectionElement = instruction;

      if(this.copy.nonSectionElements.hasOwnProperty(instruction.template)) {
        this.copy.nonSectionElements[instruction.template].targets.push(instruction);
      } else {
        this.copy.nonSectionElements[instruction.template] = { targets: [instruction] };
      }

      instruction.copy = this.copy.nonSectionElements[instruction.template];

    } else if(match[matcher.COMMENT_OPERATOR_INDEX] !== undefined) {

      if(comments === null) {
        comments = [instruction];
      } else {
        comments.push(instruction);
      }

      instruction.type = COMMENT;

      const operatorIndex = this._input.indexOf('>', index);
      instruction.ranges.commentOperator = [operatorIndex, operatorIndex + 1];

      if(match[matcher.COMMENT_INDEX] !== undefined) {
        instruction.comment = match[matcher.COMMENT_INDEX];

        const commentIndex = this._input.indexOf(instruction.comment, operatorIndex + 1);
        instruction.ranges.comment = [commentIndex, commentIndex + instruction.comment.length];
      } else {
        instruction.comment = null;
      }

    }

    line += 1;
    index = matcherRegex.lastIndex + 1;
    matcherRegex.lastIndex = index;
  } // ends while(index < this._input.length) {

  this._lineCount = this._input[this._input.length - 1] === '\n' ? line + 1 : line;

  if(comments) {
    this._meta.push(...comments);
  }
};
