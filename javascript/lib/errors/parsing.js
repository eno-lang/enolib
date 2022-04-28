import { ID_TYPE_DOCUMENT, HUMAN_INDEXING, RANGE_BEGIN, RANGE_END } from '../constants.js';
import { cursor, selectLine } from './selections.js';
import { ParseError } from '../error_types.js';

const ATTRIBUTE_OR_FIELD_WITHOUT_KEY = /^\s*([:=]).*$/; // = value OR : value
const EMBED_OR_SECTION_WITHOUT_KEY = /^\s*(--+|#+).*$/; // -- OR #
const ESCAPE_WITHOUT_KEY = /^\s*(`+)(?!`)(\s+)\1.*$/; // ` `
const INVALID_AFTER_ESCAPE = /^\s*(`+)(?!`)(?:(?!\1).)+\1\s*([^=:].*?)\s*$/; // `key` value
const UNTERMINATED_ESCAPED_KEY = /^\s*(`+)(?!`)(.*)$/; // `key

export function invalidLine(context, instruction) {
    const line = context._input.substring(instruction.ranges.line[RANGE_BEGIN], instruction.ranges.line[RANGE_END]);
    
    let match;
    if ( (match = ATTRIBUTE_OR_FIELD_WITHOUT_KEY.exec(line)) ) {
        const operatorColumn = line.indexOf(match[1]);
        const message = match[1] === '=' ? 'attributeWithoutKey' : 'fieldWithoutKey';
        
        return new ParseError(
            context.messages[message](instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            {
                from: cursor(instruction, 'line', RANGE_BEGIN),
                to: { column: operatorColumn, index: instruction.ranges.line[RANGE_BEGIN] + operatorColumn, line: instruction.line }
            }
        );
    } else if ( (match = EMBED_OR_SECTION_WITHOUT_KEY.exec(line)) ) {
        const keyColumn = line.indexOf(match[1]) + match[1].length;
        const message = match[1].startsWith('-') ? 'embedWithoutKey' : 'sectionWithoutKey';
        
        return new ParseError(
            context.messages[message](instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            {
                from: { column: keyColumn, index: instruction.ranges.line[RANGE_BEGIN] + keyColumn, line: instruction.line },
                to: cursor(instruction, 'line', RANGE_END),
            }
        );
    } else if ( (match = ESCAPE_WITHOUT_KEY.exec(line)) ) {
        const gapBeginColumn = line.indexOf(match[1]) + match[1].length;
        const gapEndColumn = line.indexOf(match[1], gapBeginColumn);
        
        return new ParseError(
            context.messages.escapeWithoutKey(instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            {
                from: { column: gapBeginColumn, index: instruction.ranges.line[RANGE_BEGIN] + gapBeginColumn, line: instruction.line },
                to: { column: gapEndColumn, index: instruction.ranges.line[RANGE_BEGIN] + gapEndColumn, line: instruction.line },
            }
        );
    } else if ( (match = INVALID_AFTER_ESCAPE.exec(line)) ) {
        const invalidBeginColumn = line.lastIndexOf(match[2]);
        const invalidEndColumn = invalidBeginColumn + match[2].length;
        
        return new ParseError(
            context.messages.invalidAfterEscape(instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            {
                from: { column: invalidBeginColumn, index: instruction.ranges.line[RANGE_BEGIN] + invalidBeginColumn, line: instruction.line },
                to: { column: invalidEndColumn, index: instruction.ranges.line[RANGE_BEGIN] + invalidEndColumn, line: instruction.line },
            }
        );
    } else if ( (match = UNTERMINATED_ESCAPED_KEY.exec(line)) ) {
        const selectionColumn = line.lastIndexOf(match[2]);
        
        return new ParseError(
            context.messages.unterminatedEscapedKey(instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            {
                from: { column: selectionColumn, index: instruction.ranges.line[RANGE_BEGIN] + selectionColumn, line: instruction.line },
                to: cursor(instruction, 'line', RANGE_END)
            }
        );
    }
}

export function instructionOutsideField(context, instruction, type) {
    return new ParseError(
        context.messages[`${type}OutsideField`](instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        selectLine(instruction)
    );
}

export function mixedFieldContent(context, field, conflicting) {
    return new ParseError(
        context.messages.mixedFieldContent(field.line + HUMAN_INDEXING),
        new context.reporter(context).indicateElement(field).reportLine(conflicting).snippet(),
        selectLine(conflicting)
    );
}

export function sectionLevelSkip(context, section, superSection) {
    const reporter = new context.reporter(context).reportLine(section);
    
    if (!(superSection.id & ID_TYPE_DOCUMENT)) {
        reporter.indicateLine(superSection);
    }
    
    return new ParseError(
        context.messages.sectionLevelSkip(section.line + HUMAN_INDEXING),
        reporter.snippet(),
        selectLine(section)
    );
}

export function unterminatedEmbed(context, embed) {
    return new ParseError(
        context.messages.unterminatedEmbed(embed.key, embed.line + HUMAN_INDEXING),
        new context.reporter(context).reportElement(embed).snippet(),
        selectLine(embed)
    );
}
