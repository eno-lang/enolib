import re
from .errors.parsing import Parsing
from .grammar_regex import Grammar
from .constants import (
    BEGIN,
    COMMENT,
    CONTINUATION,
    DOCUMENT,
    EMPTY_ELEMENT,
    END,
    FIELD,
    FIELDSET,
    FIELDSET_ENTRY,
    LIST,
    LIST_ITEM,
    MULTILINE_FIELD_BEGIN,
    MULTILINE_FIELD_END,
    MULTILINE_FIELD_VALUE,
    SECTION,
    UNPARSED
)

class Analyzer:
    def __init__(self, context):
        self._context = context
        self._depth = 0 # TODO: Make depth only a local temporary variable in analysis in js implementation too
        self._index = 0
        self._line = 0

    def _tokenize_error_context(self):
        first_instruction = None

        while True:
            end_of_line_index = self._context.input.find('\n', self._index)

            if end_of_line_index == -1:
                instruction = {
                    'ranges': { 'line': (self._index, len(self._context.input)) },
                    'line': self._line
                }

                if first_instruction is not None:
                    instruction['type'] = UNPARSED

                self._context.line_count = self._line + 1
                self._context.meta.append(instruction)

                return first_instruction or instruction
            else:
                instruction = {
                    'ranges': { 'line': (self._index, end_of_line_index) },
                    'line': self._line
                }

                self._context.meta.append(instruction)

                if first_instruction is None:
                    first_instruction = instruction
                else:
                    instruction['type'] = UNPARSED

                self._index = end_of_line_index + 1
                self._line += 1

    def analyze(self):
        if len(self._context.input) == 0:
            self._context.line_count = 1
            return

        comments = None
        last_continuable_element = None
        last_non_section_element = None
        last_section = self._context.document

        while self._index < len(self._context.input):
            match = Grammar.REGEX.search(self._context.input, self._index)

            if not match or match.start() != self._index:
                instruction = self._tokenize_error_context()
                raise Parsing.invalid_line(self._context, instruction)

            instruction = {
                'line': self._line,
                'ranges': {
                    'line': (self._index, match.end())
                }
            }

            multiline_field = False

            if match.group(Grammar.EMPTY_LINE_INDEX) is not None:

                if comments is not None:
                    self._context.meta.extend(comments)
                    comments = None

            elif match.group(Grammar.ELEMENT_OPERATOR_INDEX) is not None:

                if comments is not None:
                    instruction['comments'] = comments
                    comments = None

                instruction['key'] = match.group(Grammar.KEY_UNESCAPED_INDEX)

                if instruction['key'] is None:
                    instruction['key'] = match.group(Grammar.KEY_ESCAPED_INDEX)
                    instruction['ranges']['element_operator'] = match.span(Grammar.ELEMENT_OPERATOR_INDEX)
                    instruction['ranges']['escape_begin_operator'] = match.span(Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                    instruction['ranges']['escape_end_operator'] = match.span(Grammar.KEY_ESCAPE_END_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                else:
                    instruction['ranges']['element_operator'] = match.span(Grammar.ELEMENT_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_UNESCAPED_INDEX)

                value = match.group(Grammar.FIELD_VALUE_INDEX)

                if value is None:
                    instruction['type'] = EMPTY_ELEMENT
                else:
                    instruction['type'] = FIELD
                    instruction['value'] = value
                    instruction['ranges']['value'] = match.span(Grammar.FIELD_VALUE_INDEX)

                instruction['parent'] = last_section
                last_section['elements'].append(instruction)
                last_continuable_element = instruction
                last_non_section_element = instruction

            elif match.group(Grammar.LIST_ITEM_OPERATOR_INDEX) is not None:

                if comments is not None:
                    instruction['comments'] = comments
                    comments = None

                instruction['ranges']['item_operator'] = match.span(Grammar.LIST_ITEM_OPERATOR_INDEX)
                instruction['type'] = LIST_ITEM

                value = match.group(Grammar.LIST_ITEM_VALUE_INDEX)

                if value is not None:
                    instruction['ranges']['value'] = match.span(Grammar.LIST_ITEM_VALUE_INDEX)
                    instruction['value'] = value

                if last_non_section_element is None:
                    instruction = self._tokenize_error_context()
                    raise Parsing.missing_list_for_list_item(self._context, instruction)
                elif last_non_section_element['type'] == LIST:
                    last_non_section_element['items'].append(instruction)
                elif last_non_section_element['type'] == EMPTY_ELEMENT:
                    last_non_section_element['items'] = [instruction]
                    last_non_section_element['type'] = LIST
                else:
                    instruction = self._tokenize_error_context()
                    raise Parsing.missing_list_for_list_item(self._context, instruction)

                instruction['parent'] = last_non_section_element
                last_continuable_element = instruction

            elif match.group(Grammar.FIELDSET_ENTRY_OPERATOR_INDEX):

                if comments is not None:
                    instruction['comments'] = comments
                    comments = None

                instruction['type'] = FIELDSET_ENTRY

                unescaped_key = match.group(Grammar.KEY_UNESCAPED_INDEX)

                if unescaped_key is None:
                    instruction['key'] = match.group(Grammar.KEY_ESCAPED_INDEX)
                    instruction['ranges']['escape_begin_operator'] = match.span(Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                    instruction['ranges']['escape_end_operator'] = match.span(Grammar.KEY_ESCAPE_END_OPERATOR_INDEX)
                    instruction['ranges']['entry_operator'] = match.span(Grammar.FIELDSET_ENTRY_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                else:
                    instruction['key'] = unescaped_key
                    instruction['ranges']['entry_operator'] = match.span(Grammar.FIELDSET_ENTRY_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_UNESCAPED_INDEX)

                value = match.group(Grammar.FIELDSET_ENTRY_VALUE_INDEX)

                if value is not None:
                    instruction['ranges']['value'] = match.span(Grammar.FIELDSET_ENTRY_VALUE_INDEX)
                    instruction['value'] = value

                if last_non_section_element is None:
                    instruction = self._tokenize_error_context()
                    raise Parsing.missing_fieldset_for_fieldset_entry(self._context, instruction)
                elif last_non_section_element['type'] == FIELDSET:
                    last_non_section_element['entries'].append(instruction)
                elif last_non_section_element['type'] == EMPTY_ELEMENT:
                    last_non_section_element['entries'] = [instruction]
                    last_non_section_element['type'] = FIELDSET
                else:
                    instruction = self._tokenize_error_context()
                    raise Parsing.missing_fieldset_for_fieldset_entry(self._context, instruction)

                instruction['parent'] = last_non_section_element
                last_continuable_element = instruction

            elif match.group(Grammar.SPACED_LINE_CONTINUATION_OPERATOR_INDEX) is not None:

                if last_continuable_element is None:
                    instruction = self._tokenize_error_context()
                    raise Parsing.missing_element_for_continuation(self._context, instruction)

                instruction['spaced'] = True
                instruction['ranges']['spaced_line_continuation_operator'] = match.span(Grammar.SPACED_LINE_CONTINUATION_OPERATOR_INDEX)
                instruction['type'] = CONTINUATION

                value = match.group(Grammar.SPACED_LINE_CONTINUATION_VALUE_INDEX)

                if value is not None:
                    instruction['ranges']['value'] = match.span(Grammar.SPACED_LINE_CONTINUATION_VALUE_INDEX)
                    instruction['value'] = value

                if 'continuations' in last_continuable_element:
                    last_continuable_element['continuations'].append(instruction)
                else:
                    if last_continuable_element['type'] == EMPTY_ELEMENT:
                        last_continuable_element['type'] = FIELD

                    last_continuable_element['continuations'] = [instruction]

                if comments is not None:
                    self._context.meta.extend(comments)
                    comments = None

            elif match.group(Grammar.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX) is not None:

                if last_continuable_element is None:
                    instruction = self._tokenize_error_context()
                    raise Parsing.missing_element_for_continuation(self._context, instruction)

                instruction['ranges']['direct_line_continuation_operator'] = match.span(Grammar.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX)
                instruction['type'] = CONTINUATION

                value = match.group(Grammar.DIRECT_LINE_CONTINUATION_VALUE_INDEX)

                if value is not None:
                    instruction['ranges']['value'] = match.span(Grammar.DIRECT_LINE_CONTINUATION_VALUE_INDEX)
                    instruction['value'] = value

                if 'continuations' in last_continuable_element:
                    last_continuable_element['continuations'].append(instruction)
                else:
                    if last_continuable_element['type'] == EMPTY_ELEMENT:
                        last_continuable_element['type'] = FIELD

                    last_continuable_element['continuations'] = [instruction]

                if comments is not None:
                    self._context.meta.extend(comments)
                    comments = None

            elif match.group(Grammar.SECTION_OPERATOR_INDEX) is not None:

                if comments is not None:
                    instruction['comments'] = comments
                    comments = None

                instruction['elements'] = []
                instruction['ranges']['section_operator'] = match.span(Grammar.SECTION_OPERATOR_INDEX)
                instruction['type'] = SECTION

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
                    instruction = self._tokenize_error_context()
                    raise Parsing.section_hierarchy_layer_skip(self._context, instruction, last_section)

                instruction['parent']['elements'].append(instruction)
                last_section = instruction

                instruction['key'] = match.group(Grammar.SECTION_KEY_UNESCAPED_INDEX)

                if instruction['key'] is None:
                    instruction['key'] = match.group(Grammar.SECTION_KEY_ESCAPED_INDEX)
                    instruction['ranges']['escape_begin_operator'] = match.span(Grammar.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                    instruction['ranges']['escape_end_operator'] = match.span(Grammar.SECTION_KEY_ESCAPE_END_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.SECTION_KEY_ESCAPED_INDEX)
                else:
                    instruction['ranges']['key'] = match.span(Grammar.SECTION_KEY_UNESCAPED_INDEX)

                template = match.group(Grammar.SECTION_TEMPLATE_INDEX)

                if template is not None:
                    instruction['ranges']['template'] = match.span(Grammar.SECTION_TEMPLATE_INDEX)
                    instruction['template'] = template

                    parent = instruction['parent']
                    while parent['type'] != DOCUMENT:
                        parent['deep_resolve'] = True
                        parent = parent['parent']

                    copy_operator_range = match.span(Grammar.SECTION_COPY_OPERATOR_INDEX)

                    if copy_operator_range[1] - copy_operator_range[0] == 2:
                        instruction['deep_copy'] = True
                        instruction['ranges']['deep_copy_operator'] = copy_operator_range
                    else:
                        instruction['ranges']['copy_operator'] = copy_operator_range

                    if not hasattr(self._context, '_copy_sections'):
                        self._context._copy_sections = {}

                    if template in self._context._copy_sections:
                        self._context._copy_sections[template]['targets'].append(instruction)
                    else:
                        self._context._copy_sections[template] = { 'targets': [instruction] }

                    instruction['copy'] = self._context._copy_sections[template]

                last_continuable_element = None
                last_non_section_element = None

            elif match.group(Grammar.MULTILINE_FIELD_OPERATOR_INDEX) is not None:

                if comments is not None:
                    instruction['comments'] = comments
                    comments = None

                operator = match.group(Grammar.MULTILINE_FIELD_OPERATOR_INDEX)
                key = match.group(Grammar.MULTILINE_FIELD_KEY_INDEX)

                instruction['key'] = key
                instruction['parent'] = last_section
                instruction['ranges']['multiline_field_operator'] = match.span(Grammar.MULTILINE_FIELD_OPERATOR_INDEX)
                instruction['ranges']['key'] = match.span(Grammar.MULTILINE_FIELD_KEY_INDEX)
                instruction['type'] = MULTILINE_FIELD_BEGIN

                self._index = match.end()

                terminator_re = re.compile(rf"\n[^\S\n]*({operator})(?!-)[^\S\n]*({re.escape(key)})[^\S\n]*(?=\n|$)")
                terminator_match = terminator_re.search(self._context.input, self._index)

                self._index += 1  # move past current char (\n) into next line
                self._line += 1

                last_section['elements'].append(instruction)
                last_continuable_element = None
                last_non_section_element = instruction

                if not terminator_match:
                    self._tokenize_error_context()
                    raise Parsing.unterminated_multiline_field(self._context, instruction)

                end_of_multiline_field_index = terminator_match.start()

                if end_of_multiline_field_index != self._index - 1:
                    instruction['lines'] = []

                    while True:
                        end_of_line_index = self._context.input.find('\n', self._index, end_of_multiline_field_index)

                        if end_of_line_index == -1:
                            last_non_section_element['lines'].append({
                                'line': self._line,
                                'ranges': {
                                    'line': (self._index, end_of_multiline_field_index),
                                    'value': (self._index, end_of_multiline_field_index)
                                },
                                'type': MULTILINE_FIELD_VALUE
                            })

                            self._index = end_of_multiline_field_index + 1
                            self._line += 1

                            break
                        else:
                            last_non_section_element['lines'].append({
                                'line': self._line,
                                'ranges': {
                                    'line': (self._index, end_of_line_index),
                                    'value': (self._index, end_of_line_index)
                                },
                                'type': MULTILINE_FIELD_VALUE
                            })

                            self._index = end_of_line_index + 1
                            self._line += 1

                instruction = {
                    'line': self._line,
                    'ranges': {
                        'key': terminator_match.span(2),
                        'line': (self._index, terminator_match.end()),
                        'multiline_field_operator': terminator_match.span(1)
                    },
                    'type': MULTILINE_FIELD_END
                }

                last_non_section_element['end'] = instruction
                last_non_section_element = None

                self._index = terminator_match.end() + 1
                self._line += 1

                multiline_field = True

            elif match.group(Grammar.COMMENT_OPERATOR_INDEX) is not None:

                if comments is None:
                    comments = [instruction]
                else:
                    comments.append(instruction)

                instruction['ranges']['comment_operator'] = match.span(Grammar.COMMENT_OPERATOR_INDEX)
                instruction['type'] = COMMENT

                comment = match.group(Grammar.COMMENT_VALUE_INDEX)

                if comment is not None:
                    instruction['comment'] = comment
                    instruction['ranges']['comment'] = match.span(Grammar.COMMENT_VALUE_INDEX)

            elif match.group(Grammar.COPY_OPERATOR_INDEX) is not None:

                if comments is not None:
                    instruction['comments'] = comments
                    comments = None

                template = match.group(Grammar.TEMPLATE_INDEX)

                instruction['ranges']['copy_operator'] = match.span(Grammar.COPY_OPERATOR_INDEX)
                instruction['ranges']['template'] = match.span(Grammar.TEMPLATE_INDEX)
                instruction['template'] = template
                instruction['type'] = EMPTY_ELEMENT

                instruction['key'] = match.group(Grammar.KEY_UNESCAPED_INDEX)

                if instruction['key'] is None:
                    instruction['key'] = match.group(Grammar.KEY_ESCAPED_INDEX)
                    instruction['ranges']['escape_begin_operator'] = match.span(Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
                    instruction['ranges']['escape_end_operator'] = match.span(Grammar.KEY_ESCAPE_END_OPERATOR_INDEX)
                    instruction['ranges']['key'] = match.span(Grammar.KEY_ESCAPED_INDEX)
                else:
                    instruction['ranges']['key'] = match.span(Grammar.KEY_UNESCAPED_INDEX)

                instruction['parent'] = last_section
                last_section['elements'].append(instruction)
                last_continuable_element = None
                last_non_section_element = instruction

                if not hasattr(self._context, '_copy_non_section_elements'):
                    self._context._copy_non_section_elements = {}

                if template in self._context._copy_non_section_elements:
                    self._context._copy_non_section_elements[template]['targets'].append(instruction)
                else:
                    self._context._copy_non_section_elements[template] = { 'targets': [instruction] }

                instruction['copy'] = self._context._copy_non_section_elements[template]

            if not multiline_field:
                self._index = match.end() + 1
                self._line += 1

        # again outside while self._index < len(self._context.input):

        if self._context.input[-1] == '\n':
            self._context.line_count = self._line + 1
        else:
            self._context.line_count = self._line

        if comments is not None:
            self._context.meta.extend(comments)
