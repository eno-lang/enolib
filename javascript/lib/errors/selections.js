import {
    ATTRIBUTE,
    BEGIN,
    EMBED_BEGIN,
    END,
    FIELD,
    ITEM,
    SECTION
} from '../constants.js';

function lastIn(element) {
    if (element.type === FIELD) {
        if (element.hasOwnProperty('attributes')) {
            return lastIn(element.attributes[element.attributes.length - 1]);
        } else if (element.hasOwnProperty('items')) {
            return lastIn(element.items[element.items.length - 1]);
        } else if (element.hasOwnProperty('continuations')) {
            return element.continuations[element.continuations.length - 1];
        }
    } else if ((element.type === ATTRIBUTE || element.type === ITEM) && element.hasOwnProperty('continuations')) {
        return element.continuations[element.continuations.length - 1];
    } else if (element.type === EMBED_BEGIN) {
        return element.end;
    } else if (element.type === SECTION && element.elements.length > 0) {
        return lastIn(element.elements[element.elements.length - 1]);
    }
    
    return element;
}

export function cursor(instruction, range, position) {
    const index = instruction.ranges[range][position];
    
    return {
        column: index - instruction.ranges.line[BEGIN],
        index: index,
        line: instruction.line
    };
};

export function selection(instruction, range, position, ...to) {
    const toInstruction = to.find(argument => typeof argument === 'object') || instruction;
    const toRange = to.find(argument => typeof argument === 'string') || range;
    const toPosition = to.find(argument => typeof argument === 'number') || position;
    
    return {
        from: cursor(instruction, range, position),
        to: cursor(toInstruction, toRange, toPosition)
    };
};

export function selectComments(element) {
    const { comments } = element;
    
    if (comments.length === 1) {
        if (comments[0].hasOwnProperty('comment')) {
            return selection(comments[0], 'comment', BEGIN, END);
        } else {
            return selection(comments[0], 'line', BEGIN, END);
        }
    } else if (comments.length > 1) {
        return selection(comments[0], 'line', BEGIN, comments[comments.length - 1], 'line', END);
    } else {
        return selection(element, 'line', BEGIN);
    }
};

export const DOCUMENT_BEGIN = {
    from: { column: 0, index: 0, line: 0 },
    to: { column: 0, index: 0, line: 0 }
};

export const selectElement = element => selection(element, 'line', BEGIN, lastIn(element), 'line', END);
export const selectKey = element => selection(element, 'key', BEGIN, END);
export const selectLine = element => selection(element, 'line', BEGIN, END);
