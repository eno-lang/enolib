import re
from .errors.parsing import Parsing
from .grammar_regex import Grammar
from .constants import (
    ATTRIBUTE,
    BEGIN,
    COMMENT,
    CONTINUATION,
    EMBED_BEGIN,
    EMBED_END,
    EMBED_VALUE,
    END,
    FIELD,
    FLAG,
    ITEM,
    SECTION,
    UNPARSED
)

class Analyzer:
    def __init__(self, context):
        self._context = context
        self._depth = 0
        self._index = 0
        self._line = 0

    def _parse_after_error(self, error_instruction=None):
        if error_instruction:
            self._context.meta.append(error_instruction)
            self._index = error_instruction['ranges']['line'][END] + 1
            self._line += 1

        while self._index < len(self._context.input):
            end_of_line_index = self._context.input.find('\n', self._index)

            if end_of_line_index == -1:
                end_of_line_index = len(self._context.input)

            instruction = {
                'line': self._line,
                'ranges': { 'line': (self._index, end_of_line_index) },
                'type': UNPARSED
            }

            if not error_instruction:
                error_instruction = instruction

            self._context.meta.append(instruction)
            self._index = end_of_line_index + 1
            self._line += 1

        if self._context.input[-1] == '\n':
            self._context.line_count = self._line + 1
        else:
            self._context.line_count = self._line

        return error_instruction

    def analyze(self):
        if len(self._context.input) == 0:
            self._context.line_count = 1
            return

        comments = []
        last_continuable_element = None
        last_field = None
        last_section = self._context.document

        while self._index < len(self._context.input):
            match = Grammar.REGEX.search(self._context.input, self._index)

            if not match or match.start() != self._index:
                instruction = self._parse_after_error()
                raise Parsing.invalid_line(self._context, instruction)

            embed = False

            if match.group(Grammar.EMPTY_LINE_INDEX) is not None:
                if comments:
                    if comments[0]['line'] == 0:
                        self._context.document['comments'] = comments
                        comments = []
                    else:
                        self._context.meta.extend(comments)
                        comments.clear()
            else:
                instruction = {
                    'line': self._line,
                    'ranges': {
                        'line': (self._index, match.end())
                    }
                }
                
                if match.group(Grammar.FIELD_OPERATOR_INDEX) is not None:

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    instruction['key'] = match.group(Grammar.KEY_UNESCAPED_INDEX)
                    instruction['type'] = FIELD

                    if instruction['key'] is None:
                        instruction['key'] = match.group(Grammar.KEY_ESCAPED_INDEX)
                        instruction['ranges']['field_operator'] = match.span(Grammar.FIELD_OPERATOR_INDEX)
                        instruction['ranges']['escape_begin_operator'] = match.span(Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                        instruction['ranges']['escape_end_operator'] = match.span(Grammar.KEY_ESCAPE_END_OPERATOR_INDEX)
                        instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                    else:
                        instruction['ranges']['field_operator'] = match.span(Grammar.FIELD_OPERATOR_INDEX)
                        instruction['ranges']['key'] = match.span(Grammar.KEY_UNESCAPED_INDEX)

                    value = match.group(Grammar.FIELD_VALUE_INDEX)

                    if value:
                        instruction['value'] = value
                        instruction['ranges']['value'] = match.span(Grammar.FIELD_VALUE_INDEX)

                    instruction['parent'] = last_section
                    last_section['elements'].append(instruction)
                    last_continuable_element = instruction
                    last_field = instruction

                elif match.group(Grammar.ITEM_OPERATOR_INDEX) is not None:

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    instruction['ranges']['item_operator'] = match.span(Grammar.ITEM_OPERATOR_INDEX)
                    instruction['type'] = ITEM

                    value = match.group(Grammar.ITEM_VALUE_INDEX)

                    if value is not None:
                        instruction['ranges']['value'] = match.span(Grammar.ITEM_VALUE_INDEX)
                        instruction['value'] = value

                    if last_field is None:
                        self._parse_after_error(instruction)
                        raise Parsing.instruction_outside_field(self._context, instruction, 'item')
                    elif 'items' in last_field:
                        last_field['items'].append(instruction)
                    elif 'attributes' in last_field or 'continuations' in last_field or 'value' in last_field:
                        self._parse_after_error(instruction)
                        raise Parsing.mixed_field_content(self._context, last_field, instruction)
                    else:
                        last_field['items'] = [instruction]

                    instruction['parent'] = last_field
                    last_continuable_element = instruction

                elif match.group(Grammar.ATTRIBUTE_OPERATOR_INDEX):

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    instruction['type'] = ATTRIBUTE

                    unescaped_key = match.group(Grammar.KEY_UNESCAPED_INDEX)

                    if unescaped_key is None:
                        instruction['key'] = match.group(Grammar.KEY_ESCAPED_INDEX)
                        instruction['ranges']['escape_begin_operator'] = match.span(Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                        instruction['ranges']['escape_end_operator'] = match.span(Grammar.KEY_ESCAPE_END_OPERATOR_INDEX)
                        instruction['ranges']['attribute_operator'] = match.span(Grammar.ATTRIBUTE_OPERATOR_INDEX)
                        instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                    else:
                        instruction['key'] = unescaped_key
                        instruction['ranges']['attribute_operator'] = match.span(Grammar.ATTRIBUTE_OPERATOR_INDEX)
                        instruction['ranges']['key'] = match.span(Grammar.KEY_UNESCAPED_INDEX)

                    value = match.group(Grammar.ATTRIBUTE_VALUE_INDEX)

                    if value is not None:
                        instruction['ranges']['value'] = match.span(Grammar.ATTRIBUTE_VALUE_INDEX)
                        instruction['value'] = value

                    if last_field is None:
                        self._parse_after_error(instruction)
                        raise Parsing.instruction_outside_field(self._context, instruction, 'attribute')
                    elif 'attributes' in last_field:
                        last_field['attributes'].append(instruction)
                    elif 'continuations' in last_field or 'items' in last_field or 'value' in last_field:
                        self._parse_after_error(instruction)
                        raise Parsing.mixed_field_content(self._context, last_field, instruction)
                    else:
                        last_field['attributes'] = [instruction]

                    instruction['parent'] = last_field
                    last_continuable_element = instruction

                elif match.group(Grammar.CONTINUATION_OPERATOR_INDEX) is not None:

                    operator = match.group(Grammar.CONTINUATION_OPERATOR_INDEX)

                    instruction['type'] = CONTINUATION

                    if operator == '\\':
                        instruction['spaced'] = True
                        instruction['ranges']['spaced_continuation_operator'] = match.span(Grammar.CONTINUATION_OPERATOR_INDEX)
                    else:
                        instruction['ranges']['direct_continuation_operator'] = match.span(Grammar.CONTINUATION_OPERATOR_INDEX)

                    value = match.group(Grammar.CONTINUATION_VALUE_INDEX)

                    if value is not None:
                        instruction['ranges']['value'] = match.span(Grammar.CONTINUATION_VALUE_INDEX)
                        instruction['value'] = value

                    if last_continuable_element is None:
                        self._parse_after_error(instruction)
                        raise Parsing.instruction_outside_field(self._context, instruction, 'continuation')

                    if 'continuations' in last_continuable_element:
                        last_continuable_element['continuations'].append(instruction)
                    else:
                        last_continuable_element['continuations'] = [instruction]

                    if comments:
                        self._context.meta.extend(comments)
                        comments.clear()

                elif match.group(Grammar.SECTION_OPERATOR_INDEX) is not None:

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    instruction['elements'] = []
                    instruction['ranges']['section_operator'] = match.span(Grammar.SECTION_OPERATOR_INDEX)
                    instruction['type'] = SECTION

                    instruction['key'] = match.group(Grammar.SECTION_KEY_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.SECTION_KEY_INDEX)

                    new_depth = instruction['ranges']['section_operator'][END] - instruction['ranges']['section_operator'][BEGIN]

                    if new_depth == self._depth + 1:
                        instruction['parent'] = last_section
                        self._depth = new_depth
                    elif new_depth == self._depth:
                        instruction['parent'] = last_section['parent']
                    elif new_depth < self._depth:
                        while new_depth < self._depth:
                            last_section = last_section['parent']
                            self._depth -= 1

                        instruction['parent'] = last_section['parent']
                    else:
                        self._parse_after_error(instruction)
                        raise Parsing.section_level_skip(self._context, instruction, last_section)

                    instruction['parent']['elements'].append(instruction)

                    last_section = instruction
                    last_continuable_element = None
                    last_field = None

                elif match.group(Grammar.EMBED_OPERATOR_INDEX) is not None:

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    operator = match.group(Grammar.EMBED_OPERATOR_INDEX)
                    key = match.group(Grammar.EMBED_KEY_INDEX)

                    instruction['key'] = key
                    instruction['parent'] = last_section
                    instruction['ranges']['embed_operator'] = match.span(Grammar.EMBED_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.EMBED_KEY_INDEX)
                    instruction['type'] = EMBED_BEGIN

                    self._index = match.end()

                    terminator_re = re.compile(rf"\n[^\S\n]*({operator})(?!-)[^\S\n]*({re.escape(key)})[^\S\n]*(?=\n|$)")
                    terminator_match = terminator_re.search(self._context.input, self._index)

                    self._index += 1  # move past current char (\n) into next line
                    self._line += 1

                    last_section['elements'].append(instruction)
                    last_continuable_element = None
                    last_field = None
                    begin_instruction = instruction

                    if not terminator_match:
                        # TODO: We can actually semantically identify/type the following lines as regular value lines in all implementations
                        #       (The somewhat differently implemented javascript parsing implementation does this due to how it works)
                        self._parse_after_error()
                        raise Parsing.unterminated_embed(self._context, instruction)

                    end_of_embed_index = terminator_match.start()

                    if end_of_embed_index != self._index - 1:
                        instruction['lines'] = []

                        while True:
                            end_of_line_index = self._context.input.find('\n', self._index, end_of_embed_index)

                            if end_of_line_index == -1:
                                begin_instruction['lines'].append({
                                    'line': self._line,
                                    'ranges': {
                                        'line': (self._index, end_of_embed_index),
                                        'value': (self._index, end_of_embed_index)
                                    },
                                    'type': EMBED_VALUE
                                })

                                self._index = end_of_embed_index + 1
                                self._line += 1

                                break
                            else:
                                begin_instruction['lines'].append({
                                    'line': self._line,
                                    'ranges': {
                                        'line': (self._index, end_of_line_index),
                                        'value': (self._index, end_of_line_index)
                                    },
                                    'type': EMBED_VALUE
                                })

                                self._index = end_of_line_index + 1
                                self._line += 1

                    instruction = {
                        'line': self._line,
                        'ranges': {
                            'embed_operator': terminator_match.span(1),
                            'key': terminator_match.span(2),
                            'line': (self._index, terminator_match.end())
                        },
                        'type': EMBED_END
                    }

                    begin_instruction['end'] = instruction

                    self._index = terminator_match.end() + 1
                    self._line += 1

                    embed = True

                elif match.group(Grammar.COMMENT_OPERATOR_INDEX) is not None:

                    instruction['ranges']['comment_operator'] = match.span(Grammar.COMMENT_OPERATOR_INDEX)
                    instruction['type'] = COMMENT

                    comment = match.group(Grammar.COMMENT_VALUE_INDEX)

                    if comment is not None:
                        instruction['comment'] = comment
                        instruction['ranges']['comment'] = match.span(Grammar.COMMENT_VALUE_INDEX)

                    comments.append(instruction)

                elif match.group(Grammar.KEY_UNESCAPED_INDEX) is not None:

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    instruction['key'] = match.group(Grammar.KEY_UNESCAPED_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                    instruction['type'] = FLAG

                    instruction['parent'] = last_section
                    last_section['elements'].append(instruction)
                    last_continuable_element = None
                    last_field = None

                elif match.group(Grammar.KEY_ESCAPED_INDEX) is not None:

                    if comments:
                        instruction['comments'] = comments
                        comments = []

                    instruction['key'] = match.group(Grammar.KEY_ESCAPED_INDEX)
                    instruction['ranges']['escape_begin_operator'] = match.span(Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                    instruction['ranges']['escape_end_operator'] = match.span(Grammar.KEY_ESCAPE_END_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                    instruction['type'] = FLAG

                    instruction['parent'] = last_section
                    last_section['elements'].append(instruction)
                    last_continuable_element = None
                    last_field = None


            if not embed:
                self._index = match.end() + 1
                self._line += 1

        # again outside while self._index < len(self._context.input):

        if self._context.input[-1] == '\n':
            self._context.line_count = self._line + 1
        else:
            self._context.line_count = self._line

        if comments:
            self._context.meta.extend(comments)
