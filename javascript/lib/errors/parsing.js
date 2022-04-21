import { BEGIN, DOCUMENT, END, HUMAN_INDEXING } from '../constants.js';
import { cursor, selectLine } from './selections.js';
import { ParseError } from '../error_types.js';

// = value
// : value
const ATTRIBUTE_OR_FIELD_WITHOUT_KEY = /^\s*([:=]).*$/;
const attributeOrFieldWithoutKey = (context, instruction, line, match) => {
    const operatorColumn = line.indexOf(match[1]);
    const message = `${match[1] === '=' ? 'attribute' : 'field'}WithoutKey`;
    
    return new ParseError(
        context.messages[message](instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: cursor(instruction, 'line', BEGIN),
            to: { column: operatorColumn, index: instruction.ranges.line[BEGIN] + operatorColumn, line: instruction.line }
        }
    );
};

// --
// #
const EMBED_OR_SECTION_WITHOUT_KEY = /^\s*(--+|#+).*$/;
const embedOrSectionWithoutKey = (context, instruction, line, match) => {
    const keyColumn = line.indexOf(match[1]) + match[1].length;
    const message = `${match[1].startsWith('-') ? 'embed' : 'section'}WithoutKey`;
    
    return new ParseError(
        context.messages[message](instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: { column: keyColumn, index: instruction.ranges.line[BEGIN] + keyColumn, line: instruction.line },
            to: cursor(instruction, 'line', END),
        }
    );
};

// ` `
const ESCAPE_WITHOUT_KEY = /^\s*(`+)(?!`)(\s+)\1.*$/;
const escapeWithoutKey = (context, instruction, line, match) => {
    const gapBeginColumn = line.indexOf(match[1]) + match[1].length;
    const gapEndColumn = line.indexOf(match[1], gapBeginColumn);
    
    return new ParseError(
        context.messages.escapeWithoutKey(instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: { column: gapBeginColumn, index: instruction.ranges.line[BEGIN] + gapBeginColumn, line: instruction.line },
            to: { column: gapEndColumn, index: instruction.ranges.line[BEGIN] + gapEndColumn, line: instruction.line },
        }
    );
};

// `key` value
const INVALID_AFTER_ESCAPE = /^\s*(`+)(?!`)(?:(?!\1).)+\1\s*([^=:].*?)\s*$/;
const invalidAfterEscape = (context, instruction, line, match) => {
    const invalidBeginColumn = line.lastIndexOf(match[2]);
    const invalidEndColumn = invalidBeginColumn + match[2].length;
    
    return new ParseError(
        context.messages.invalidAfterEscape(instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: { column: invalidBeginColumn, index: instruction.ranges.line[BEGIN] + invalidBeginColumn, line: instruction.line },
            to: { column: invalidEndColumn, index: instruction.ranges.line[BEGIN] + invalidEndColumn, line: instruction.line },
        }
    );
};

// `key
const UNTERMINATED_ESCAPED_KEY = /^\s*(`+)(?!`)(.*)$/;
const unterminatedEscapedKey = (context, instruction, line, match) => {
    const selectionColumn = line.lastIndexOf(match[2]);
    
    return new ParseError(
        context.messages.unterminatedEscapedKey(instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: { column: selectionColumn, index: instruction.ranges.line[BEGIN] + selectionColumn, line: instruction.line },
            to: cursor(instruction, 'line', END)
        }
    );
};

export const errors = {
    invalidLine: (context, instruction) => {
        const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);
        
        let match;
        if ( (match = ATTRIBUTE_OR_FIELD_WITHOUT_KEY.exec(line)) ) {
            return attributeOrFieldWithoutKey(context, instruction, line, match);
        } else if ( (match = EMBED_OR_SECTION_WITHOUT_KEY.exec(line)) ) {
            return embedOrSectionWithoutKey(context, instruction, line, match);
        } else if ( (match = ESCAPE_WITHOUT_KEY.exec(line)) ) {
            return escapeWithoutKey(context, instruction, line, match);
        } else if ( (match = INVALID_AFTER_ESCAPE.exec(line)) ) {
            return invalidAfterEscape(context, instruction, line, match);
        } else if ( (match = UNTERMINATED_ESCAPED_KEY.exec(line)) ) {
            return unterminatedEscapedKey(context, instruction, line, match);
        }
    },
    instructionOutsideField: (context, instruction, type) => {
        return new ParseError(
            context.messages[`${type}OutsideField`](instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            selectLine(instruction)
        );
    },
    mixedFieldContent: (context, field, conflicting) => {
        return new ParseError(
            context.messages.mixedFieldContent(field.line + HUMAN_INDEXING),
            new context.reporter(context).indicateElement(field).reportLine(conflicting).snippet(),
            selectLine(conflicting)
        );
    },
    sectionLevelSkip: (context, section, superSection) => {
        const reporter = new context.reporter(context).reportLine(section);
        
        if(superSection.type !== DOCUMENT) {
            reporter.indicateLine(superSection);
        }
        
        return new ParseError(
            context.messages.sectionLevelSkip(section.line + HUMAN_INDEXING),
            reporter.snippet(),
            selectLine(section)
        );
    },
    unterminatedEmbed: (context, embed) => {
        return new ParseError(
            context.messages.unterminatedEmbed(embed.key, embed.line + HUMAN_INDEXING),
            new context.reporter(context).reportElement(embed).snippet(),
            selectLine(embed)
        );
    }
};
