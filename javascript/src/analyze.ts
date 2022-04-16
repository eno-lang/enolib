import { errors } from './errors/parsing.js';

import {
    ATTRIBUTE_OPERATOR_INDEX,
    ATTRIBUTE_VALUE_INDEX,
    COMMENT_INDEX,
    COMMENT_OPERATOR_INDEX,
    CONTINUATION_OPERATOR_INDEX,
    CONTINUATION_VALUE_INDEX,
    EMBED_KEY_INDEX,
    EMBED_OPERATOR_INDEX,
    EMPTY_LINE_INDEX,
    FIELD_OPERATOR_INDEX,
    FIELD_VALUE_INDEX,
    GRAMMAR_REGEXP,
    ITEM_OPERATOR_INDEX,
    ITEM_VALUE_INDEX,
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX,
    KEY_ESCAPED_INDEX,
    KEY_UNESCAPED_INDEX,
    SECTION_KEY_INDEX,
    SECTION_OPERATOR_INDEX
} from './grammar_matcher.js';

import {
    ATTRIBUTE,
    COMMENT,
    CONTINUATION,
    DOCUMENT,
    END,
    FLAG,
    FIELD,
    ITEM,
    EMBED_BEGIN,
    EMBED_END,
    EMBED_VALUE,
    SECTION,
    UNPARSED
} from './constants.js';

const parseAfterError = (context, index, line, errorInstruction = null) => {
    if (errorInstruction) {
        context._meta.push(errorInstruction);
        index = errorInstruction.ranges.line[END];
        line++;
    }
    
    while (index < context._input.length) {
        let endOfLineIndex = context._input.indexOf('\n', index);
        
        if (endOfLineIndex === -1) {
            endOfLineIndex = context._input.length;
        }
        
        const instruction = {
            line: line,
            ranges: { line: [index, endOfLineIndex] },
            type: UNPARSED
        };
        
        if (errorInstruction === null) {
            errorInstruction = instruction;
        }
        
        context._meta.push(instruction);
        index = endOfLineIndex + 1;
        line++;
    }
    
    context._lineCount = context._input[context._input.length - 1] === '\n' ? line + 1 : line;
    
    return errorInstruction;
};

export function analyze() {
    this._document = {
        depth: 0,
        elements: [],
        type: DOCUMENT
    };
    
    this._meta = [];
    
    if (this._input.length === 0) {
        this._lineCount = 1;
        return;
    }
    
    let comments = null;
    let lastContinuableElement = null;
    let lastField = null;
    let lastSection = this._document;
    
    let index = 0;
    let line = 0;
    
    // TODO: This is maybe not really (concurrency) safe (?)
    // GRAMMAR_REGEXP is "compile time" instantiated as one single instance shared among all concurrent "threads" ...
    const matcherRegex = GRAMMAR_REGEXP;
    matcherRegex.lastIndex = index;
    
    let instruction;
    
    while (index < this._input.length) {
        const match = matcherRegex.exec(this._input);
        
        if (match === null) {
            instruction = parseAfterError(this, index, line);
            throw errors.invalidLine(this, instruction);
        } else {
            instruction = {
                line: line,
                ranges: {
                    line: [index, matcherRegex.lastIndex]
                }
            };
        }
        
        if (match[EMPTY_LINE_INDEX] !== undefined) {
            
            if (comments) {
                this._meta.push(...comments);
                comments = null;
            }
            
        } else if (match[FIELD_OPERATOR_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            instruction.key = match[KEY_UNESCAPED_INDEX];
            instruction.type = FIELD;
            
            let fieldOperatorIndex;
            if (instruction.key !== undefined) {
                const keyIndex = this._input.indexOf(instruction.key, index);
                fieldOperatorIndex = this._input.indexOf(':', keyIndex + instruction.key.length);
                
                instruction.ranges.fieldOperator = [fieldOperatorIndex, fieldOperatorIndex + 1];
                instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            } else {
                instruction.key = match[KEY_ESCAPED_INDEX];
                
                const escapeOperator = match[KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
                const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, index);
                const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
                const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);
                fieldOperatorIndex = this._input.indexOf(':', escapeEndOperatorIndex + escapeOperator.length);
                
                instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
                instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
                instruction.ranges.fieldOperator = [fieldOperatorIndex, fieldOperatorIndex + 1];
                instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            }
            
            const value = match[FIELD_VALUE_INDEX];
            if (value) {
                instruction.value = value;
                
                const valueIndex = this._input.indexOf(value, fieldOperatorIndex + 1);
                instruction.ranges.value = [valueIndex, valueIndex + value.length];
            }
            
            instruction.parent = lastSection;
            lastSection.elements.push(instruction);
            lastContinuableElement = instruction;
            lastField = instruction;
            
        } else if (match[ITEM_OPERATOR_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            instruction.type = ITEM;
            instruction.value = match[ITEM_VALUE_INDEX] || null;
            
            const operatorIndex = this._input.indexOf('-', index);
            
            instruction.ranges.itemOperator = [operatorIndex, operatorIndex + 1];
            
            if (instruction.value) {
                const valueIndex = this._input.indexOf(instruction.value, operatorIndex + 1);
                instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
            }
            
            if (lastField === null) {
                parseAfterError(this, index, line, instruction);
                throw errors.instructionOutsideField(this, instruction, 'item');
            } else if (lastField.hasOwnProperty('items')) {
                lastField.items.push(instruction);
            } else if (lastField.hasOwnProperty('attributes') ||
                       lastField.hasOwnProperty('continuations') || // TODO: If continuations are straight away added to value we can skip this check
                       lastField.hasOwnProperty('value')) {
                parseAfterError(this, index, line, instruction);
                throw errors.mixedFieldContent(this, lastField, instruction);
            } else {
                lastField.items = [instruction];
            }
            
            instruction.parent = lastField;
            lastContinuableElement = instruction;
            
        } else if (match[ATTRIBUTE_OPERATOR_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            instruction.type = ATTRIBUTE;
            
            let attributeOperatorIndex;
            
            if (match[KEY_UNESCAPED_INDEX] === undefined) {
                instruction.key = match[KEY_ESCAPED_INDEX];
                
                const escapeOperator = match[KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
                const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, index);
                const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
                const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);
                attributeOperatorIndex = this._input.indexOf('=', escapeEndOperatorIndex + escapeOperator.length);
                
                instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
                instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
                instruction.ranges.attributeOperator = [attributeOperatorIndex, attributeOperatorIndex + 1];
                instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            } else {
                instruction.key = match[KEY_UNESCAPED_INDEX];
                
                const keyIndex = this._input.indexOf(instruction.key, index);
                attributeOperatorIndex = this._input.indexOf('=', keyIndex + instruction.key.length);
                
                instruction.ranges.attributeOperator = [attributeOperatorIndex, attributeOperatorIndex + 1];
                instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            }
            
            if (match[ATTRIBUTE_VALUE_INDEX] === undefined) {
                instruction.value = null;
            } else {
                instruction.value = match[ATTRIBUTE_VALUE_INDEX];
                
                const valueIndex = this._input.indexOf(instruction.value, attributeOperatorIndex + 1);
                instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
            }
            
            if (lastField === null) {
                parseAfterError(this, index, line, instruction);
                throw errors.instructionOutsideField(this, instruction, 'attribute');
            } else if (lastField.hasOwnProperty('attributes')) {
                lastField.attributes.push(instruction);
            } else if (lastField.hasOwnProperty('continuations') || // TODO: If continuations are straight away added to value we can skip this check
                       lastField.hasOwnProperty('items') ||
                       lastField.hasOwnProperty('value')) {
                parseAfterError(this, index, line, instruction);
                throw errors.mixedFieldContent(this, lastField, instruction);
            } else {
                lastField.attributes = [instruction];
            }
            
            instruction.parent = lastField;
            lastContinuableElement = instruction;
            
        } else if (match[CONTINUATION_OPERATOR_INDEX] !== undefined) {
            
            const operator = match[CONTINUATION_OPERATOR_INDEX];
            const operatorIndex = this._input.indexOf(operator, index);
            
            instruction.type = CONTINUATION;
            
            if (operator === '\\') {
                instruction.spaced = true;
                instruction.ranges.spacedContinuationOperator = [operatorIndex, operatorIndex + 1];
            } else {
                instruction.ranges.directContinuationOperator = [operatorIndex, operatorIndex + 1];
            }
            
            if (match[CONTINUATION_VALUE_INDEX] !== undefined) {
                instruction.value = match[CONTINUATION_VALUE_INDEX];
                const valueIndex = this._input.indexOf(instruction.value, operatorIndex + 1);
                instruction.ranges.value = [valueIndex, valueIndex + instruction.value.length];
            }
            
            if (lastContinuableElement === null) {
                parseAfterError(this, index, line, instruction);
                throw errors.instructionOutsideField(this, instruction, 'continuation');
            }
            
            if (lastContinuableElement.hasOwnProperty('continuations')) {
                lastContinuableElement.continuations.push(instruction);
            } else {
                lastContinuableElement.continuations = [instruction];
            }
            
            if (comments) {
                this._meta.push(...comments);
                comments = null;
            }
            
        } else if (match[SECTION_OPERATOR_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            const sectionOperator = match[SECTION_OPERATOR_INDEX];
            
            instruction.depth = sectionOperator.length;
            instruction.elements = []; // TODO: Lazy-assign this?
            instruction.type = SECTION;
            
            const sectionOperatorIndex = this._input.indexOf(sectionOperator, index);
            instruction.key = match[SECTION_KEY_INDEX];
            
            const keyIndex = this._input.indexOf(instruction.key, sectionOperatorIndex + sectionOperator.length);
            
            instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            instruction.ranges.sectionOperator = [sectionOperatorIndex, sectionOperatorIndex + sectionOperator.length];
            
            if (instruction.depth === lastSection.depth + 1) {
                instruction.parent = lastSection;
            } else if (instruction.depth === lastSection.depth) {
                instruction.parent = lastSection.parent;
            } else if (instruction.depth < lastSection.depth) {
                while (instruction.depth < lastSection.depth) {
                    lastSection = lastSection.parent;
                }
                
                instruction.parent = lastSection.parent;
            } else {
                parseAfterError(this, index, line, instruction);
                throw errors.sectionLevelSkip(this, instruction, lastSection);
            }
            
            instruction.parent.elements.push(instruction);
            
            lastSection = instruction;
            lastContinuableElement = null;
            lastField = null;
            
        } else if (match[EMBED_OPERATOR_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            const operator = match[EMBED_OPERATOR_INDEX];
            
            instruction.key = match[EMBED_KEY_INDEX];
            instruction.lines = [];
            instruction.type = EMBED_BEGIN;
            
            let operatorIndex = this._input.indexOf(operator, index);
            let keyIndex = this._input.indexOf(instruction.key, operatorIndex + operator.length);
            
            instruction.ranges.embedOperator = [operatorIndex, operatorIndex + operator.length];
            instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            
            index = matcherRegex.lastIndex + 1;
            line += 1;
            
            instruction.parent = lastSection;
            lastSection.elements.push(instruction);
            
            lastContinuableElement = null;
            lastField = null;
            const beginInstruction = instruction;
            
            const keyEscaped = instruction.key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const terminatorMatcher = new RegExp(`[^\\S\\n]*(${operator})(?!-)[^\\S\\n]*(${keyEscaped})[^\\S\\n]*(?=\\n|$)`, 'y');
            
            while (true) {
                terminatorMatcher.lastIndex = index;
                let terminatorMatch = terminatorMatcher.exec(this._input);
                
                if (terminatorMatch) {
                    operatorIndex = this._input.indexOf(operator, index);
                    keyIndex = this._input.indexOf(instruction.key, operatorIndex + operator.length);
                    
                    instruction = {
                        line: line,
                        ranges: {
                            line: [index, terminatorMatcher.lastIndex],
                            embedOperator: [operatorIndex, operatorIndex + operator.length],
                            key: [keyIndex, keyIndex + instruction.key.length]
                        },
                        type: EMBED_END
                    };
                    
                    beginInstruction.end = instruction;
                    
                    matcherRegex.lastIndex = terminatorMatcher.lastIndex;
                    
                    break;
                } else {
                    const endofLineIndex = this._input.indexOf('\n', index);
                    
                    if (endofLineIndex === -1) {
                        beginInstruction.lines.push({
                            line: line,
                            ranges: {
                                line: [index, this._input.length],
                                value: [index, this._input.length]  // TODO: line range === value range, drop value range? (see how the custom terminal reporter eg. handles this for syntax coloring, then revisit)
                            },
                            type: EMBED_VALUE
                        });
                        
                        throw errors.unterminatedEmbed(this, instruction);
                    } else {
                        beginInstruction.lines.push({
                            line: line,
                            ranges: {
                                line: [index, endofLineIndex],
                                value: [index, endofLineIndex]  // TODO: line range === value range, drop value range? (see how the custom terminal reporter eg. handles this for syntax coloring, then revisit)
                            },
                            type: EMBED_VALUE
                        });
                        
                        index = endofLineIndex + 1;
                        line++;
                    }
                }
            }
            
        } else if (match[COMMENT_OPERATOR_INDEX] !== undefined) {
            
            if (comments === null) {
                comments = [instruction];
            } else {
                comments.push(instruction);
            }
            
            instruction.type = COMMENT;
            
            const operatorIndex = this._input.indexOf('>', index);
            instruction.ranges.commentOperator = [operatorIndex, operatorIndex + 1];
            
            if (match[COMMENT_INDEX] !== undefined) {
                instruction.comment = match[COMMENT_INDEX];
                
                const commentIndex = this._input.indexOf(instruction.comment, operatorIndex + 1);
                instruction.ranges.comment = [commentIndex, commentIndex + instruction.comment.length];
            } else {
                instruction.comment = null;
            }
            
        } else if (match[KEY_UNESCAPED_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            instruction.key = match[KEY_UNESCAPED_INDEX];
            instruction.type = FLAG;
            
            const keyIndex = this._input.indexOf(instruction.key, index);
            
            instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            
            instruction.parent = lastSection;
            lastSection.elements.push(instruction);
            lastContinuableElement = null;
            lastField = null;
            
        } else if (match[KEY_ESCAPED_INDEX] !== undefined) {
            
            if (comments) {
                instruction.comments = comments;
                comments = null;
            }
            
            instruction.key = match[KEY_ESCAPED_INDEX];
            instruction.type = FLAG;
            
            const escapeOperator = match[KEY_ESCAPE_BEGIN_OPERATOR_INDEX];
            const escapeBeginOperatorIndex = this._input.indexOf(escapeOperator, index);
            const keyIndex = this._input.indexOf(instruction.key, escapeBeginOperatorIndex + escapeOperator.length);
            const escapeEndOperatorIndex = this._input.indexOf(escapeOperator, keyIndex + instruction.key.length);
            
            instruction.ranges.escapeBeginOperator = [escapeBeginOperatorIndex, escapeBeginOperatorIndex + escapeOperator.length];
            instruction.ranges.escapeEndOperator = [escapeEndOperatorIndex, escapeEndOperatorIndex + escapeOperator.length];
            instruction.ranges.key = [keyIndex, keyIndex + instruction.key.length];
            
            instruction.parent = lastSection;
            lastSection.elements.push(instruction);
            lastContinuableElement = null;
            lastField = null;
            
        }
        
        line += 1;
        index = matcherRegex.lastIndex + 1;
        matcherRegex.lastIndex = index;
    } // ends while (index < this._input.length) {

    this._lineCount = this._input[this._input.length - 1] === '\n' ? line + 1 : line;
    
    if (comments) {
        this._meta.push(...comments);
    }
};
