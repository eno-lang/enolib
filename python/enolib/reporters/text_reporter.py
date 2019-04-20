from ..constants import BEGIN, END, HUMAN_INDEXING
from .reporter import DISPLAY, EMPHASIZE, INDICATE, OMISSION, QUESTION, Reporter

INDICATORS = {
    DISPLAY: ' ',
    EMPHASIZE: '>',
    INDICATE: '*',
    QUESTION: '?'
}

class TextReporter(Reporter):
    def __init__(self, context):
        super().__init__(context)

        gutter_header = context.messages.gutter_header.rjust(5)
        columns_header = f"  {gutter_header} | {context.messages.content_header}"

        source = f"-- {context.source} --\n\n" if context.source is not None else ''

        self._gutter_width = len(gutter_header) + 3
        self._header = f"{source}{columns_header}\n"

    def _line(self, line, tag):
        if tag == OMISSION:
            return f"{' ' * (self._gutter_width - 5)}..."

        number = str(line + HUMAN_INDEXING)
        instruction = self._index[line]

        if instruction is None:
            content = ''
        else:
            content = self._context.input[instruction['ranges']['line'][BEGIN]:instruction['ranges']['line'][END]]

        return f" {INDICATORS[tag]}{number.rjust(self._gutter_width - 3)} | {content}"

    def _print(self):
        snippet = '\n'.join(self._line(line, tag) for line, tag in enumerate(self._snippet) if tag is not None)

        return self._header + snippet
