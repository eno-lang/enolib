import math
from .analyzer import Analyzer
from .locales import en
from .reporters.text_reporter import TextReporter
from .constants import (
    BEGIN,
    DOCUMENT,
    EMBED_BEGIN
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

    def value(self, element):
        if 'computed_value' not in element:
            element['computed_value'] = None

            if element['type'] is EMBED_BEGIN:
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
