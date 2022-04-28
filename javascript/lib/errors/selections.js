import {
    ID_CONTAINS_ATTRIBUTES,
    ID_CONTAINS_CONTINUATIONS,
    ID_CONTAINS_ITEMS,
    ID_TYPE_ATTRIBUTE,
    ID_TYPE_EMBED,
    ID_TYPE_FIELD,
    ID_TYPE_ITEM,
    ID_TYPE_SECTION,
    RANGE_BEGIN,
    RANGE_END
} from '../constants.js';

function lastIn(element) {
    if (element.id & ID_TYPE_FIELD) {
        if (element.id & ID_CONTAINS_ATTRIBUTES) {
            return lastIn(element.attributes[element.attributes.length - 1]);
        } else if (element.id & ID_CONTAINS_ITEMS) {
            return lastIn(element.items[element.items.length - 1]);
        } else if (element.id & ID_CONTAINS_CONTINUATIONS) {
            return element.continuations[element.continuations.length - 1];
        }
    } else if (element.id & ID_CONTAINS_CONTINUATIONS) {
        return element.continuations[element.continuations.length - 1];
    } else if (element.id & ID_TYPE_EMBED) {
        return element.end;
    } else if (element.id & ID_TYPE_SECTION && element.elements.length > 0) {
        return lastIn(element.elements[element.elements.length - 1]);
    }
    
    return element;
}

export function cursor(instruction, range, position) {
    const index = instruction.ranges[range][position];
    
    return {
        column: index - instruction.ranges.line[RANGE_BEGIN],
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
            return selection(comments[0], 'comment', RANGE_BEGIN, RANGE_END);
        } else {
            return selection(comments[0], 'line', RANGE_BEGIN, RANGE_END);
        }
    } else if (comments.length > 1) {
        return selection(comments[0], 'line', RANGE_BEGIN, comments[comments.length - 1], 'line', RANGE_END);
    } else {
        return selection(element, 'line', RANGE_BEGIN);
    }
};

export const selectElement = element => selection(element, 'line', RANGE_BEGIN, lastIn(element), 'line', RANGE_END);
export const selectKey = element => selection(element, 'key', RANGE_BEGIN, RANGE_END);
export const selectLine = element => selection(element, 'line', RANGE_BEGIN, RANGE_END);
