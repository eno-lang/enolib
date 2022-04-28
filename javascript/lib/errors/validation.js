import { ValidationError } from '../error_types.js';
import { cursor, selection, selectComments, selectElement, selectKey } from './selections.js';
import {
    ID_CONTAINS_CONTINUATIONS,
    ID_TYPE_ATTRIBUTE,
    ID_TYPE_DOCUMENT,
    ID_TYPE_EMBED,
    ID_TYPE_FIELD,
    ID_TYPE_ITEM,
    RANGE_BEGIN,
    RANGE_END
} from '../constants.js';

// TODO: Here and prominently also elsewhere - consider replacing instruction.ranges.line with instruction[LINE_RANGE] (where LINE_RANGE = Symbol('descriptive'))

export const errors = {
    commentError: (context, message, element) => {
        return new ValidationError(
            context.messages.commentError(message),
            new context.reporter(context).reportComments(element).snippet(),
            selectComments(element)
        );
    },
    elementError: (context, message, element) => {
        return new ValidationError(
            message,
            new context.reporter(context).reportElement(element).snippet(),
            selectElement(element)
        );
    },
    keyError: (context, message, element) => {
        return new ValidationError(
            context.messages.keyError(message),
            new context.reporter(context).reportLine(element).snippet(),
            selectKey(element)
        );
    },
    missingComment: (context, element) => {
        if (element.id & ID_TYPE_DOCUMENT) {
            return new ValidationError(
                context.messages.missingDocumentComment,
                new context.reporter(context).questionLine(element).snippet(),
                selection(element, 'line', RANGE_BEGIN)
            );
        } else {            
            return new ValidationError(
                context.messages.missingComment,
                new context.reporter(context).reportLine(element).snippet(), // TODO: Question-tag an empty line before an element with missing comment
                selection(element, 'line', RANGE_BEGIN)
            );
        }
    },
    missingElement: (context, key, parent, message) => {
        return new ValidationError(
            key === null ? context.messages[message] : context.messages[message + 'WithKey'](key),
            new context.reporter(context).reportMissingElement(parent).snippet(),
            selection(parent, 'line', RANGE_END)
        );
    },
    missingValue: (context, element) => {
        let message;
        const selection = {};
        
        if (element.id & (ID_TYPE_EMBED | ID_TYPE_FIELD)) {
            message = context.messages.missingFieldValue(element.key); // TODO: Differentiate between missingEmbedValue and missingFieldValue?
            
            if (element.id & ID_TYPE_FIELD) {
                selection.from = cursor(element, 'fieldOperator', RANGE_END);
            } else {
                selection.from = cursor(element, 'line', RANGE_END);
            }
        } else if (element.id & ID_TYPE_ATTRIBUTE) {
            message = context.messages.missingAttributeValue(element.key);
            selection.from = cursor(element, 'attributeOperator', RANGE_END);
        } else if (element.id & ID_TYPE_ITEM) {
            message = context.messages.missingItemValue(element.parent.key);
            selection.from = cursor(element, 'itemOperator', RANGE_END);
        }
        
        const snippet = new context.reporter(context).reportElement(element).snippet();
        
        if (element.id & ID_CONTAINS_CONTINUATIONS) {
            selection.to = cursor(element.continuations[element.continuations.length - 1], 'line', RANGE_END);
        } else {
            selection.to = cursor(element, 'line', RANGE_END);
        }
        
        return new ValidationError(message, snippet, selection);
    },
    unexpectedElement: (context, message, element) => {
        return new ValidationError(
            message || context.messages.unexpectedElement,
            new context.reporter(context).reportElement(element).snippet(),
            selectElement(element)
        );
    },
    unexpectedFieldContent: (context, key, field, message) => {
        return new ValidationError(
            key === null ? context.messages[message] : context.messages[message + 'WithKey'](key),
            new context.reporter(context).reportElement(field).snippet(),
            selectElement(field)
        );
    },
    unexpectedMultipleElements: (context, key, elements, message) => {
        return new ValidationError(
            key === null ? context.messages[message] : context.messages[message + 'WithKey'](key),
            new context.reporter(context).reportElements(elements).snippet(),
            selectElement(elements[0])
        );
    },
    unexpectedElementType: (context, key, section, message) => {
        return new ValidationError(
            key === null ? context.messages[message] : context.messages[message + 'WithKey'](key),
            new context.reporter(context).reportElement(section).snippet(),
            selectElement(section)
        );
    },
    valueError: (context, message, element) => {
        let snippet, select;
        
        if (element.id & ID_TYPE_EMBED) {
            if (element.lines.length > 0) {
                snippet = new context.reporter(context).reportEmbedValue(element).snippet();
                select = selection(element.lines[0], 'line', RANGE_BEGIN, element.lines[element.lines.length - 1], 'line', RANGE_END);
            } else {
                snippet = new context.reporter(context).reportElement(element).snippet();
                select = selection(element, 'line', RANGE_END);
            }
        } else {
            snippet = new context.reporter(context).reportElement(element).snippet();
            select = {};
            
            if (element.ranges.hasOwnProperty('value')) {
                select.from = cursor(element, 'value', RANGE_BEGIN);
            } else if (element.id & ID_TYPE_FIELD) {
                select.from = cursor(element, 'fieldOperator', RANGE_END);
            } else if (element.id & ID_TYPE_ATTRIBUTE) {
                select.from = cursor(element, 'attributeOperator', RANGE_END);
            } else /* if (element.id & ID_TYPE_ITEM) */ {
                select.from = cursor(element, 'itemOperator', RANGE_END);
            }
            
            if (element.id & ID_CONTAINS_CONTINUATIONS) {
                select.to = cursor(element.continuations[element.continuations.length - 1], 'line', RANGE_END);
            } else if (element.ranges.hasOwnProperty('value')) {
                select.to = cursor(element, 'value', RANGE_END);
            } else {
                select.to = cursor(element, 'line', RANGE_END);
            }
        }
        
        return new ValidationError(context.messages.valueError(message), snippet, select);
    }
};
