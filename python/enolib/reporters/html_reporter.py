from html import escape

from ..constants import BEGIN, END, HUMAN_INDEXING
from .reporter import EMPHASIZE, INDICATE, OMISSION, QUESTION, Reporter


class HtmlReporter(Reporter):
    def _line(self, line, tag):
        if tag == OMISSION:
            return self._markup('...', '...')

        number = str(line + HUMAN_INDEXING)
        instruction = self._index[line]

        content = ''
        if instruction:
            content = self._context.input[instruction['ranges']['line'][BEGIN]:instruction['ranges']['line'][END]]

        if tag == EMPHASIZE:
            tag_class = 'eno-report-line-emphasized'
        elif tag == INDICATE:
            tag_class = 'eno-report-line-indicated'
        elif tag == QUESTION:
            tag_class = 'eno-report-line-questioned'
        else:
            tag_class = ''

        return self._markup(number, content, tag_class)

    def _markup(self, gutter, content, tag_class=''):
        return (
            f"<div class=\"eno-report-line {tag_class}\">"
            f"<div class=\"eno-report-gutter\">{gutter.rjust(10)}</div>"
            f"<div class=\"eno-report-content\">{escape(content)}</div>"
            '</div>'
        )

    def _print(self):
        columns_header = self._markup(self._context.messages.gutter_header, self._context.messages.content_header)
        snippet = '\n'.join(self._line(line, tag) for line, tag in enumerate(self._snippet) if tag is not None)

        if self._context.source:
            return f"<div><div>{self._context.source}</div><pre class=\"eno-report\">{columns_header}{snippet}</pre></div>"

        return f"<pre class=\"eno-report\">{columns_header}{snippet}</pre>"
