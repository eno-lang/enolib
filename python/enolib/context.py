import math
from .analyzer import Analyzer
from .locales import en
from .reporters.text_reporter import TextReporter
from .resolver import Resolver
from .constants import (
    BEGIN,
    DOCUMENT,
    EMPTY_ELEMENT,
    FIELD,
    FIELDSET,
    FIELDSET_ENTRY,
    LIST,
    LIST_ITEM,
    MULTILINE_FIELD_BEGIN,
    PRETTY_TYPES,
    SECTION
)

class Context:
    def __init__(self, input: str, *, locale=en, reporter=TextReporter, source=None):
        self.input = input
        self.messages = locale
        self.reporter = reporter
        self.source = source

        self.document = {
            'elements': [],
            'type': DOCUMENT
        }

        self.meta = []

        Analyzer(self).analyze()

        if hasattr(self, '_copy_non_section_elements') or hasattr(self, '_copy_sections'):
            Resolver(self).resolve()

    def comment(self, element):
        if not 'computed_comment' in element:
            if 'comments' in element:
                if len(element['comments']) == 1:
                    element['computed_comment'] = element['comments'][0]['comment']
                else:
                    first_non_empty_line_index = None
                    shared_indent = math.inf
                    last_non_empty_line_index = None

                    for index, comment in enumerate(element['comments']):
                        if 'comment' in comment:
                            if first_non_empty_line_index is None:
                                first_non_empty_line_index = index

                            indent = comment['ranges']['comment'][BEGIN] - comment['ranges']['line'][BEGIN]
                            if indent < shared_indent:
                                shared_indent = indent

                            last_non_empty_line_index = index

                    if first_non_empty_line_index is not None:
                        non_empty_lines = element['comments'][first_non_empty_line_index:last_non_empty_line_index + 1]

                        def indent(comment):
                            if not 'comment' in comment:
                                return ''
                            elif (comment['ranges']['comment'][BEGIN] - comment['ranges']['line'][BEGIN]) == shared_indent:
                                return comment['comment']
                            else:
                                return (' ' * (comment['ranges']['comment'][BEGIN] - comment['ranges']['line'][BEGIN] - shared_indent)) + comment['comment']

                        element['computed_comment'] = '\n'.join(indent(comment) for comment in non_empty_lines)
                    else:
                        element['computed_comment'] = None
            else:
                element['computed_comment'] = None

        return element['computed_comment']

    def elements(self, section):
        if 'mirror' in section:
            self.elements(section['mirror'])
        else:
            if not 'computed_elements' in section:
                section['computed_elements_map'] = {}
                section['computed_elements'] = section['elements']

                for element in section['computed_elements']:
                    if element['key'] in section['computed_elements_map']:
                        section['computed_elements_map'][element['key']].append(element)
                    else:
                        section['computed_elements_map'][element['key']] = [element]

                if 'extend' in section:
                    copied_elements = [element for element in self.elements(section['extend']) if element['key'] not in section['computed_elements_map']]

                    section['computed_elements'] = copied_elements + section['computed_elements']

                    for element in copied_elements:
                        if element['key'] in section['computed_elements_map']:
                            section['computed_elements_map'][element['key']].append(element)
                        else:
                            section['computed_elements_map'][element['key']] = [element]

            return section['computed_elements']

    def entries(self, fieldset):
        if 'mirror' in fieldset:
            return self.entries(fieldset['mirror'])

        if not 'computed_entries' in fieldset:
            fieldset['computed_entries_map'] = {}
            fieldset['computed_entries'] = fieldset['entries']

            for entry in fieldset['computed_entries']:
                if entry['key'] in fieldset['computed_entries_map']:
                    fieldset['computed_entries_map'][entry['key']].append(entry)
                else:
                    fieldset['computed_entries_map'][entry['key']] = [entry]

            if 'extend' in fieldset:
                copied_entries = [entry for entry in self.entries(fieldset['extend']) if entry['key'] not in fieldset['computed_entries_map']]

                fieldset['computed_entries'] = copied_entries + fieldset['computed_entries']

                for entry in copied_entries:
                    if entry['key'] in fieldset['computed_entries_map']:
                        fieldset['computed_entries_map'][entry['key']].append(entry)
                    else:
                        fieldset['computed_entries_map'][entry['key']] = [entry]

        return fieldset['computed_entries']

    def items(self, list):
        if 'mirror' in list:
            return self.items(list['mirror'])

        if 'extend' in list:
            if not 'computed_items' in list:
                list['computed_items'] = self.items(list['extend']) + list['items']

            return list['computed_items']

        if 'items' in list:
            return list['items']

        return []

    def raw(self, element):
        result = { 'type': PRETTY_TYPES[element['type']] }

        if 'comments' in element:
            result['comment'] = self.comment(element)

        if element['type'] == EMPTY_ELEMENT:
            result['key'] = element['key']
        elif element['type'] == FIELD:
            result['key'] = element['key']
            result['value'] = self.value(element)
        elif element['type'] == LIST_ITEM:
            result['value'] = self.value(element)
        elif element['type'] == FIELDSET_ENTRY:
            result['key'] = element['key']
            result['value'] = self.value(element)
        elif element['type'] == MULTILINE_FIELD_BEGIN:
            result['key'] = element['key']
            result['value'] = self.value(element)
        elif element['type'] == LIST:
            result['key'] = element['key']
            result['items'] = [self.raw(item) for item in self.items(element)]
        elif element['type'] == FIELDSET:
            result['key'] = element['key']
            result['entries'] = [self.raw(entry) for entry in self.entries(element)]
        elif element['type'] == SECTION:
            result['key'] = element['key']
            result['elements'] = [self.raw(section_element) for section_element in self.elements(element)]
        elif element['type'] == DOCUMENT:
            result['elements'] = [self.raw(section_element) for section_element in self.elements(element)]

        return result

    def value(self, element):
        if 'computed_value' not in element:
            if 'mirror' in element:
                return self.value(element['mirror'])

            element['computed_value'] = None

            if element['type'] is MULTILINE_FIELD_BEGIN:
                if 'lines' in element:
                    element['computed_value'] = self.input[
                        element['lines'][0]['ranges']['line'][0]:element['lines'][-1]['ranges']['line'][1]
                    ]
            else:
                if 'value' in element:
                    element['computed_value'] = element['value']

                if 'continuations' in element:
                    unapplied_spacing = None

                    for continuation in element['continuations']:
                        if element['computed_value'] is None:
                            if 'value' in continuation:
                                element['computed_value'] = continuation['value']

                            unapplied_spacing = None
                        elif not 'value' in continuation:
                            unapplied_spacing = unapplied_spacing or 'spaced' in continuation
                        elif 'spaced' in continuation or unapplied_spacing:
                            element['computed_value'] += ' ' + continuation['value']
                            unapplied_spacing = None
                        else:
                            element['computed_value'] += continuation['value']

        return element['computed_value']
