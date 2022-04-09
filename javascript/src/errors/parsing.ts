import { BEGIN, DOCUMENT, END, HUMAN_INDEXING } from '../constants.js';
import { cursor, selectLine } from './selections.js';
import { ParseError } from '../error_types.js';

// = value
// : value
const ATTRIBUTE_OR_FIELD_WITHOUT_KEY = /^\s*([:=]).*$/;
const attributeOrFieldWithoutKey = (context, instruction, operator) => {
    const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);
    const operatorColumn = line.indexOf(operator);
    const message = `${operator === '=' ? 'attribute' : 'field'}WithoutKey`;
    
    return new ParseError(
        context.messages[message](instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: cursor(instruction, 'line', BEGIN),
            to: { column: operatorColumn, index: instruction.ranges.line[0] + operatorColumn, line: instruction.line }
        }
    );
};

// --
// #
const EMBED_OR_SECTION_WITHOUT_KEY = /^\s*(--+|#+).*$/;
const embedOrSectionWithoutKey = (context, instruction, operator) => {
    const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);
    const keyColumn = line.indexOf(operator) + operator.length;
    const message = `${operator.startsWith('-') ? 'embed' : 'section'}WithoutKey`;
    
    return new ParseError(
        context.messages[message](instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: { column: keyColumn, index: instruction.ranges.line[0] + keyColumn, line: instruction.line },
            to: cursor(instruction, 'line', END),
        }
    );
};

// `key
const UNTERMINATED_ESCAPED_KEY = /^\s*(`+)(?!`)(.*)$/;
const unterminatedEscapedKey = (context, instruction, unterminated) => {
    const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);
    const selectionColumn = line.lastIndexOf(unterminated);
    
    return new ParseError(
        context.messages.unterminatedEscapedKey(instruction.line + HUMAN_INDEXING),
        new context.reporter(context).reportLine(instruction).snippet(),
        {
            from: { column: selectionColumn, index: instruction.ranges.line[0] + selectionColumn, line: instruction.line },
            to: cursor(instruction, 'line', END)
        }
    );
};

export const errors = {
    invalidLine: (context, instruction) => {
        const line = context._input.substring(instruction.ranges.line[BEGIN], instruction.ranges.line[END]);
        
        let match;
        if ( (match = ATTRIBUTE_OR_FIELD_WITHOUT_KEY.exec(line)) ) {
            return attributeOrFieldWithoutKey(context, instruction, match[1]);
        } else if ( (match = EMBED_OR_SECTION_WITHOUT_KEY.exec(line)) ) {
            return embedOrSectionWithoutKey(context, instruction, match[1]);
        } else if ( (match = UNTERMINATED_ESCAPED_KEY.exec(line)) ) {
            return unterminatedEscapedKey(context, instruction, match[2]);
        }
        
        // TODO: This is a reoccurring pattern and can be DRYed up - line_error or something
        //       (Also in other implementations)
        return new ParseError(
            context.messages.invalidLine(instruction.line + HUMAN_INDEXING),
            new context.reporter(context).reportLine(instruction).snippet(),
            selectLine(instruction)
        );
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
    unterminatedEmbed: (context, field) => {
        return new ParseError(
            context.messages.unterminatedEmbed(field.key, field.line + HUMAN_INDEXING),
            new context.reporter(context).reportElement(field).snippet(),
            selectLine(field)
        );
    }
};
