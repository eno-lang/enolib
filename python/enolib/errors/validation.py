from ..error_types import ValidationError
from .selections import cursor, DOCUMENT_BEGIN, select_comments, select_element, select_key, selection
from ..constants import (
    ATTRIBUTE,
    BEGIN,
    EMBED_BEGIN,
    END,
    DOCUMENT,
    FIELD,
    ITEM
)


class Validation:
    @staticmethod
    def comment_error(context, message, element):
        return ValidationError(
            context.messages.comment_error(message),
            context.reporter(context).report_comments(element).snippet(),
            select_comments(element)
        )

    @staticmethod
    def element_error(context, message, element):
        return ValidationError(
            message,
            context.reporter(context).report_element(element).snippet(),
            select_element(element)
        )

    @staticmethod
    def key_error(context, message, element):
        return ValidationError(
            context.messages.key_error(message),
            context.reporter(context).report_line(element).snippet(),
            select_key(element)
        )

    @staticmethod
    def missing_comment(context, element):
        return ValidationError(
            context.messages.missing_comment,
            context.reporter(context).report_line(element).snippet(), # TODO: Question-tag an empty line before an element with missing comment
            selection(element, 'line', BEGIN)
        )

    @staticmethod
    def missing_element(context, key, parent, message):
        message = getattr(context.messages, message if key is None else message + '_with_key')

        return ValidationError(
            message if key is None else message(key),
            context.reporter(context).report_missing_element(parent).snippet(),
            DOCUMENT_BEGIN if parent['type'] == DOCUMENT else selection(parent, 'line', END)
        )

    @staticmethod
    def missing_value(context, element):
        selection_data = {}

        if (element['type'] == FIELD or
            element['type'] == EMBED_BEGIN):
            message = context.messages.missing_field_value(element['key'])

            if 'field_operator' in element['ranges']:
                selection_data['from'] = cursor(element, 'field_operator', END)
            else:
                selection_data['from'] = cursor(element, 'line', END)
        elif element['type'] == ATTRIBUTE:
            message = context.messages.missing_attribute_value(element['key'])
            selection_data['from'] = cursor(element, 'attribute_operator', END)
        elif element['type'] == ITEM:
            message = context.messages.missing_item_value(element['parent']['key'])
            selection_data['from'] = cursor(element, 'item_operator', END)

        snippet = context.reporter(context).report_element(element).snippet()

        if element['type'] == FIELD and 'continuations' in element:
            selection_data['to'] = cursor(element['continuations'][-1], 'line', END)
        else:
            selection_data['to'] = cursor(element, 'line', END)

        return ValidationError(message, snippet, selection_data)

    @staticmethod
    def unexpected_element(context, message, element):
        return ValidationError(
            message or context.messages.unexpected_element,
            context.reporter(context).report_element(element).snippet(),
            select_element(element)
        )
        
    @staticmethod
    def unexpected_field_content(context, key, field, message):
        message = getattr(context.messages, message if key is None else message + '_with_key')
        return ValidationError(
            message if key is None else message(key),
            context.reporter(context).report_element(field).snippet(),
            select_element(field)
        )

    @staticmethod
    def unexpected_multiple_elements(context, key, elements, message):
        message = getattr(context.messages, message if key is None else message + '_with_key')
        return ValidationError(
            message if key is None else message(key),
            context.reporter(context).report_elements(elements).snippet(),
            select_element(elements[0])
        )

    @staticmethod
    def unexpected_element_type(context, key, section, message):
        message = getattr(context.messages, message if key is None else message + '_with_key')

        return ValidationError(
            message if key is None else message(key),
            context.reporter(context).report_element(section).snippet(),
            select_element(section)
        )

    @staticmethod
    def value_error(context, message, element):
        if element['type'] == EMBED_BEGIN:
            if 'lines' in element:
                snippet = context.reporter(context).report_multiline_value(element).snippet()
                select = selection(element['lines'][0], 'line', BEGIN, element['lines'][-1], 'line', END)
            else:
                snippet = context.reporter(context).report_element(element).snippet()
                select = selection(element, 'line', END)
        else:
            snippet = context.reporter(context).report_element(element).snippet()
            select = {}

            if 'value' in element['ranges']:
                select['from'] = cursor(element, 'value', BEGIN)
            elif 'field_operator' in element['ranges']:
                select['from'] = cursor(element, 'field_operator', END)
            elif 'attribute_operator' in element['ranges']:
                select['from'] = cursor(element, 'attribute_operator', END)
            elif element['type'] == ITEM:
                select['from'] = cursor(element, 'item_operator', END)
            else:
                # TODO: Possibly never reached - think through state permutations
                select['from'] = cursor(element, 'line', END)

            if 'continuations' in element:
                select['to'] = cursor(element['continuations'][-1], 'line', END)
            elif 'value' in element['ranges']:
                select['to'] = cursor(element, 'value', END)
            else:
                select['to'] = cursor(element, 'line', END)

        return ValidationError(context.messages.value_error(message), snippet, select)
