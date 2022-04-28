import { Context } from './context.js';
import { Element } from './elements/element.js';

import {
    ID_CONTAINS_ATTRIBUTES,
    ID_CONTAINS_CONTINUATIONS,
    ID_CONTAINS_ITEMS,
    ID_TYPE_EMBED,
    ID_TYPE_FIELD,
    ID_TYPE_SECTION,
    RANGE_BEGIN,
    RANGE_END
} from './constants.js';

const checkInDocumentByLine = (document, line) => {
    if (document.hasOwnProperty('comments')) {
        if (line <= document.comments[document.comments.length - 1].line) {
            return {
                element: document,
                instruction: document.comments.find(comment => line === comment.line)
            };
        }
    }
    
    return checkInSectionByLine(document, line);
};

const checkInDocumentByIndex = (document, index) => {
    if (document.hasOwnProperty('comments')) {
        if (index <= document.comments[document.comments.length - 1].ranges.line[RANGE_END]) {
            return {
                element: document,
                instruction: document.comments.find(comment => index <= comment.ranges.line[RANGE_END])
            };
        }
    }
    
    return checkInSectionByIndex(document, index);
};

const checkEmbedByLine = (field, line) => {
    if (line < field.line || line > field.end.line)
        return false;
    
    if (line === field.line)
        return { element: field, instruction: field };
    
    if (line === field.end.line)
        return { element: field, instruction: field.end };
    
    return { element: field, instruction: field.lines.find(valueLine => valueLine.line === line) };
};

const checkEmbedByIndex = (field, index) => {
    if (index < field.ranges.line[RANGE_BEGIN] || index > field.end.ranges.line[RANGE_END])
        return false;
    
    if (index <= field.ranges.line[RANGE_END])
        return { element: field, instruction: field };
    
    if (index >= field.end.ranges.line[RANGE_BEGIN])
        return { element: field, instruction: field.end };
    
    return { element: field, instruction: field.lines.find(line => index <= line.ranges.line[RANGE_END]) };
};

const checkFieldByLine = (field, line) => {
    if (line < field.line)
        return false;
    
    if (line === field.line)
        return { element: field, instruction: field };
    
    if (field.id & ID_CONTAINS_ATTRIBUTES) {
        if (line > field.attributes[field.attributes.length - 1].line)
            return false;
        
        for (const attribute of field.attributes) {
            if (line === attribute.line)
                return { element: attribute, instruction: attribute };
            
            if (line < attribute.line) {
                if (attribute.hasOwnProperty('comments') && line >= attribute.comments[0].line) {
                    return {
                        element: attribute,
                        instruction: attribute.comments.find(comment => line === comment.line)
                    };
                }
                return { element: field, instruction: null };
            }
            
            const matchInAttribute = checkFieldByLine(attribute, line); // TODO: Terminology!! Only should check continuations
            
            if (matchInAttribute)
                return matchInAttribute;
        }
    } else if (field.id & ID_CONTAINS_ITEMS) {
        if (line > field.items[field.items.length - 1].line)
            return false;
        
        for (const item of field.items) {
            if (line === item.line)
                return { element: item, instruction: item };
            
            if (line < item.line) {
                if (item.hasOwnProperty('comments') && line >= item.comments[0].line) {
                    return {
                        element: item,
                        instruction: item.comments.find(comment => line === comment.line)
                    };
                }
                return { element: field, instruction: null };
            }
            
            const matchInItem = checkFieldByLine(item, line);
            
            if (matchInItem)
                return matchInItem;
        }
    } else if (field.id & ID_CONTAINS_CONTINUATIONS) {
        if (line > field.continuations[field.continuations.length - 1].line)
            return false;
        
        for (const continuation of field.continuations) {
            if (line === continuation.line)
                return { element: field, instruction: continuation };
            if (line < continuation.line)
                return { element: field, instruction: null };
        }
    }
    
    return false;
};

const checkFieldByIndex = (field, index) => {
    if (index < field.ranges.line[RANGE_BEGIN])
        return false;
    
    if (index <= field.ranges.line[RANGE_END])
        return { element: field, instruction: field };
    
    if (field.id & ID_CONTAINS_ATTRIBUTES) {
        if (index > field.attributes[field.attributes.length - 1].ranges.line[RANGE_END])
            return false;
        
        for (const attribute of field.attributes) {
            if (index < attribute.ranges.line[RANGE_BEGIN]) {
                if (attribute.hasOwnProperty('comments') && index >= attribute.comments[0].ranges.line[RANGE_BEGIN]) {
                    return {
                        element: attribute,
                        instruction: attribute.comments.find(comment => index <= comment.ranges.line[RANGE_END])
                    };
                }
                return { element: field, instruction: null };
            }
            
            if (index <= attribute.ranges.line[RANGE_END])
                return { element: attribute, instruction: attribute };
            
            const matchInAttribute = checkFieldByIndex(attribute, index);
            
            if (matchInAttribute)
                return matchInAttribute;
        }
    } else if (field.id & ID_CONTAINS_ITEMS) {
        if (index > field.items[field.items.length - 1].ranges.line[RANGE_END])
            return false;
        
        for (const item of field.items) {
            if (index < item.ranges.line[RANGE_BEGIN]) {
                if (item.hasOwnProperty('comments') && index >= item.comments[0].ranges.line[RANGE_BEGIN]) {
                    return {
                        element: item,
                        instruction: item.comments.find(comment => index <= comment.ranges.line[RANGE_END])
                    };
                }
                return { element: field, instruction: null };
            }
            
            if (index <= item.ranges.line[RANGE_END])
                return { element: item, instruction: item };
            
            const matchInItem = checkFieldByIndex(item, index);
            
            if (matchInItem)
                return matchInItem;
        }
    } else if (field.id & ID_CONTAINS_CONTINUATIONS) {
        if (index > field.continuations[field.continuations.length - 1].ranges.line[RANGE_END])
            return false;
        
        for (const continuation of field.continuations) {
            if (index < continuation.ranges.line[RANGE_BEGIN])
                return { element: field, instruction: null };
            if (index <= continuation.ranges.line[RANGE_END])
                return { element: field, instruction: continuation };
        }
    }
    
    return false;
};

const checkInSectionByLine = (section, line) => {
    for (let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
        const element = section.elements[elementIndex];
        
        if (element.hasOwnProperty('comments')) {
            if (line < element.comments[0].line) continue;
            
            if (line <= element.comments[element.comments.length - 1].line) {
                return {
                    element: element,
                    instruction: element.comments.find(comment => line === comment.line)
                };
            }
        }
        
        if (element.line > line)
            continue;
        
        if (element.line === line)
            return { element: element, instruction: element };
        
        if (element.id & ID_TYPE_FIELD) {
            const matchInField = checkFieldByLine(element, line);
            if (matchInField) return matchInField;
        } else if (element.id & ID_TYPE_EMBED) {
            const matchInEmbed = checkEmbedByLine(element, line);
            if (matchInEmbed) return matchInEmbed;
        } else if (element.id & ID_TYPE_SECTION) {
            return checkInSectionByLine(element, line);
        }
                
        break;
    }
    return { element: section, instruction: null };
};

const checkInSectionByIndex = (section, index) => {
    for (let elementIndex = section.elements.length - 1; elementIndex >= 0; elementIndex--) {
        const element = section.elements[elementIndex];
        
        if (element.hasOwnProperty('comments')) {
            if (index < element.comments[0].ranges.line[RANGE_BEGIN]) continue;
            
            if (index <= element.comments[element.comments.length - 1].ranges.line[RANGE_END]) {
                return {
                    element: element,
                    instruction: element.comments.find(comment => index <= comment.ranges.line[RANGE_END])
                };
            }
        }
        
        if (index < element.ranges.line[RANGE_BEGIN])
            continue;
        
        if (index <= element.ranges.line[RANGE_END])
            return { element: element, instruction: element };
        
        if (element.id & ID_TYPE_FIELD) {
            const matchInField = checkFieldByIndex(element, index);
            if (matchInField) return matchInField;
        } else if (element.id & ID_TYPE_EMBED) {
            const matchInEmbed = checkEmbedByIndex(element, index);
            if (matchInEmbed) return matchInEmbed;
        } else if (element.id & ID_TYPE_SECTION) {
            return checkInSectionByIndex(element, index);
        }
        
        break;
    }
    return { element: section, instruction: null };
};


export function lookup(position, input, options = {}) {
    let { column, index, line } = position;
    
    const context = new Context(input, options);
    
    let match;
    if (index === undefined) {
        if (line < 0 || line >= context._lineCount)
            throw new RangeError(`You are trying to look up a line (${line}) outside of the document's line range (0-${context._lineCount - 1})`);
        
        match = checkInDocumentByLine(context._document, line);
    } else {
        if (index < 0 || index > context._input.length)
            throw new RangeError(`You are trying to look up an index (${index}) outside of the document's index range (0-${context._input.length})`);
        
        match = checkInDocumentByIndex(context._document, index);
    }
    
    const result = {
        element: new Element(context, match.element),
        range: null
    };
    
    let instruction = match.instruction;
    
    if (!instruction) {
        if (index === undefined) {
            instruction = context._meta.find(instruction => instruction.line === line);
        } else {
            instruction = context._meta.find(instruction =>
                index >= instruction.ranges.line[RANGE_BEGIN] && index <= instruction.ranges.line[RANGE_END]
            );
        }
        
        if (!instruction)
            return result;
    }
    
    let rightmostMatch = instruction.ranges.line[0];
    
    if (index === undefined) {
        index = instruction.ranges.line[0] + column;
    }
    
    for (const [type, range] of Object.entries(instruction.ranges)) {
        if (type === 'line') continue;
        
        if (index >= range[RANGE_BEGIN] && index <= range[RANGE_END] && range[RANGE_BEGIN] >= rightmostMatch) {
            result.range = type;
            // TODO: Provide content of range too as convenience
            rightmostMatch = index;
        }
    }
    
    return result;
}
