import re
from ..constants import BEGIN, DOCUMENT, END, HUMAN_INDEXING
from ..error_types import ParseError
from .selections import cursor, select_line

# = value
# : value
ATTRIBUTE_OR_FIELD_WITHOUT_KEY = re.compile(r'^\s*([:=]).*$')
def attribute_or_field_without_key(context, instruction, match):
    operator_column = match.start(1)
    message = getattr(context.messages, 'attribute_without_key' if match.group(1) == '=' else 'field_without_key')
    return ParseError(
        message(instruction['line'] + HUMAN_INDEXING),
        context.reporter(context).report_line(instruction).snippet(),
        {
            'from': cursor(instruction, 'line', BEGIN),
            'to': { 'column': operator_column, 'index': instruction['ranges']['line'][BEGIN] + operator_column, 'line': instruction['line'] }
        }
    )

# = value
# : value
EMBED_OR_SECTION_WITHOUT_KEY = re.compile(r'^\s*(--+|#+).*$')
def embed_or_section_without_key(context, instruction, match):
    key_column = match.end(1)
    message = getattr(context.messages, 'embed_without_key' if match.group(1).startswith('-') else 'section_without_key')
    return ParseError(
        message(instruction['line'] + HUMAN_INDEXING),
        context.reporter(context).report_line(instruction).snippet(),
        {
            'from': { 'column': key_column, 'index': instruction['ranges']['line'][BEGIN] + key_column, 'line': instruction['line'] },
            'to': cursor(instruction, 'line', END)
        }
    )

# ` `
ESCAPE_WITHOUT_KEY = re.compile(r'^\s*(`+)(?!`)(\s+)(\1).*$')
def escape_without_key(context, instruction, match):
    gap_begin_column = match.end(1)
    gap_end_column = match.start(3)
    return ParseError(
        context.messages.escape_without_key(instruction['line'] + HUMAN_INDEXING),
        context.reporter(context).report_line(instruction).snippet(),
        {
            'from': { 'column': gap_begin_column, 'index': instruction['ranges']['line'][BEGIN] + gap_begin_column, 'line': instruction['line'] },
            'to': { 'column': gap_end_column, 'index': instruction['ranges']['line'][BEGIN] + gap_end_column, 'line': instruction['line'] }
        }
    )

# `key` value
INVALID_AFTER_ESCAPE = re.compile(r'^\s*(`+)(?!`)(?:(?!\1).)+\1\s*([^=:].*?)\s*$')
def invalid_after_escape(context, instruction, match):
    invalid_begin_column = match.start(2)
    invalid_end_column = match.end(2)
    return ParseError(
        context.messages.invalid_after_escape(instruction['line'] + HUMAN_INDEXING),
        context.reporter(context).report_line(instruction).snippet(),
        {
            'from': { 'column': invalid_begin_column, 'index': instruction['ranges']['line'][BEGIN] + invalid_begin_column, 'line': instruction['line'] },
            'to': { 'column': invalid_end_column, 'index': instruction['ranges']['line'][BEGIN] + invalid_end_column, 'line': instruction['line'] }
        }
    )

# `key
UNTERMINATED_ESCAPED_KEY = re.compile(r'^\s*(`+)(?!`)(.*)$')
def unterminated_escaped_key(context, instruction, match):
    selection_column =  match.end(1)
    return ParseError(
        context.messages.unterminated_escaped_key(instruction['line'] + HUMAN_INDEXING),
        context.reporter(context).report_line(instruction).snippet(),
        {
            'from': { 'column': selection_column, 'index': instruction['ranges']['line'][BEGIN] + selection_column, 'line': instruction['line'] },
            'to': cursor(instruction, 'line', END)
        }
    )

class Parsing:
    @staticmethod
    def invalid_line(context, instruction):
        line = context.input[instruction['ranges']['line'][BEGIN]:instruction['ranges']['line'][END]]

        match = ATTRIBUTE_OR_FIELD_WITHOUT_KEY.match(line)
        if match is not None:
            return attribute_or_field_without_key(context, instruction, match)
        
        match = EMBED_OR_SECTION_WITHOUT_KEY.match(line)
        if match is not None:
            return embed_or_section_without_key(context, instruction, match)
            
        match = ESCAPE_WITHOUT_KEY.match(line)
        if match is not None:
            return escape_without_key(context, instruction, match)
            
        match = INVALID_AFTER_ESCAPE.match(line)
        if match is not None:
            return invalid_after_escape(context, instruction, match)
            
        match = UNTERMINATED_ESCAPED_KEY.match(line)
        if match is not None:
            return unterminated_escaped_key(context, instruction, match)

    @staticmethod
    def instruction_outside_field(context, instruction, type):
        message = getattr(context.messages, f"{type}_outside_field")
        return ParseError(
            message(instruction['line'] + HUMAN_INDEXING),
            context.reporter(context).report_line(instruction).snippet(),
            select_line(instruction)
        )

    @staticmethod
    def mixed_field_content(context, field, conflicting):
        return ParseError(
            context.messages.mixed_field_content(field['line'] + HUMAN_INDEXING),
            context.reporter(context).indicate_element(field).report_line(conflicting).snippet(),
            select_line(conflicting)
        )

    @staticmethod
    def section_level_skip(context, section, super_section):
        reporter = context.reporter(context).report_line(section)

        if super_section['type'] != DOCUMENT:
            reporter.indicate_line(super_section)

        return ParseError(
            context.messages.section_level_skip(section['line'] + HUMAN_INDEXING),
            reporter.snippet(),
            select_line(section)
        )

    @staticmethod
    def unterminated_embed(context, embed):
        reporter = context.reporter(context).report_element(embed)

        # TODO: Possibly revisit this - differs from js impl. and possibly improvable here or there
        for instruction in context.meta:
            if instruction['line'] > embed['line']:
                reporter.indicate_line(instruction)

        return ParseError(
            context.messages.unterminated_embed(embed['key'], embed['line'] + HUMAN_INDEXING),
            reporter.snippet(),
            select_line(embed)
        )
