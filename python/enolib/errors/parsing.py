import re
from ..constants import BEGIN, DOCUMENT, END, HUMAN_INDEXING
from ..error_types import ParseError
from .selections import cursor, select_line

class Parsing:
    UNTERMINATED_ESCAPED_KEY = re.compile(r'^\s*#*\s*(`+)(?!`)((?:(?!\1).)+)$')

    @staticmethod
    def invalid_line(context, instruction):
        line = context.input[instruction['ranges']['line'][BEGIN]:instruction['ranges']['line'][END]]

        match = Parsing.UNTERMINATED_ESCAPED_KEY.match(line)
        if match is not None:
            return Parsing.unterminated_escaped_key(context, instruction, match.end(1))

        return ParseError(
            context.messages.invalid_line(instruction['line'] + HUMAN_INDEXING),
            context.reporter(context).report_line(instruction).snippet(),
            select_line(instruction)
        )

    @staticmethod
    def missing_element_for_continuation(context, continuation):
        return ParseError(
            context.messages.missing_element_for_continuation(continuation['line'] + HUMAN_INDEXING),
            context.reporter(context).report_line(continuation).snippet(),
            select_line(continuation)
        )

    @staticmethod
    def missing_fieldset_for_fieldset_entry(context, entry):
        return ParseError(
            context.messages.missing_fieldset_for_fieldset_entry(entry['line'] + HUMAN_INDEXING),
            context.reporter(context).report_line(entry).snippet(),
            select_line(entry)
        )

    @staticmethod
    def missing_list_for_list_item(context, item):
        return ParseError(
            context.messages.missing_list_for_list_item(item['line'] + HUMAN_INDEXING),
            context.reporter(context).report_line(item).snippet(),
            select_line(item)
        )

    @staticmethod
    def section_hierarchy_layer_skip(context, section, super_section):
        reporter = context.reporter(context).report_line(section)

        if super_section['type'] != DOCUMENT:
            reporter.indicate_line(super_section)

        return ParseError(
            context.messages.section_hierarchy_layer_skip(section['line'] + HUMAN_INDEXING),
            reporter.snippet(),
            select_line(section)
        )

    @staticmethod
    def unterminated_escaped_key(context, instruction, selection_column):
        return ParseError(
            context.messages.unterminated_escaped_key(instruction['line'] + HUMAN_INDEXING),
            context.reporter(context).report_line(instruction).snippet(),
            {
                'from': { 'column': selection_column, 'index': instruction['ranges']['line'][BEGIN] + selection_column, 'line': instruction['line'] },
                'to': cursor(instruction, 'line', END)
            }
        )

    @staticmethod
    def unterminated_multiline_field(context, field):
        reporter = context.reporter(context).report_element(field)

        # TODO: Possibly revisit this - differs from js impl. and possibly improvable here or there
        for instruction in context.meta:
            if instruction['line'] > field['line']:
                reporter.indicate_line(instruction)

        return ParseError(
            context.messages.unterminated_multiline_field(field['key'], field['line'] + HUMAN_INDEXING),
            reporter.snippet(),
            select_line(field)
        )
