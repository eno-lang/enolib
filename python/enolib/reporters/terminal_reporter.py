from ..constants import BEGIN, COMMENT, END, HUMAN_INDEXING, UNPARSED
from .reporter import DISPLAY, EMPHASIZE, INDICATE, OMISSION, QUESTION, Reporter

RESET = '\x1b[0m'
BOLD = '\x1b[1m'
DIM = '\x1b[2m'

BLACK = '\x1b[30m'
BRIGHT_BLACK = '\x1b[90m'
WHITE = '\x1b[37m'
BRIGHT_WHITE = '\x1b[97m'

BRIGHT_BLACK_BACKGROUND = '\x1b[40m'
BRIGHT_RED_BACKGROUND = '\x1b[101m'
WHITE_BACKGROUND = '\x1b[47m'

INDICATORS = {
    DISPLAY: ' ',
    EMPHASIZE: '>',
    INDICATE: '*',
    QUESTION: '?'
}

GUTTER_STYLE = {
    DISPLAY: BRIGHT_BLACK_BACKGROUND,
    EMPHASIZE: BLACK + BRIGHT_RED_BACKGROUND,
    INDICATE: BLACK + WHITE_BACKGROUND,
    QUESTION: BLACK + WHITE_BACKGROUND
}

RANGE_STYLE = {
    'element_operator': WHITE,
    'escape_begin_operator': WHITE,
    'escape_end_operator': WHITE,
    'item_operator': WHITE,
    'entry_operator': WHITE,
    'section_operator': WHITE,
    'copy_operator': WHITE,
    'deepCopy_operator': WHITE,
    'multiline_field_operator': WHITE,
    'direct_line_continuation_operator': WHITE,
    'spaced_line_continuation_operator': WHITE,
    'key': BOLD + BRIGHT_WHITE,
    'template': BOLD + BRIGHT_WHITE,
    'value': DIM + WHITE
}

class TerminalReporter(Reporter):
    def __init__(self, context):
        super().__init__(context)

        highest_shown_line_number = len(self._snippet)

        for index, tag in reversed(list(enumerate(self._snippet))):
            if tag is not None and tag != OMISSION:
                highest_shown_line_number = index + 1
                break

        self._line_number_padding = max(4, len(str(highest_shown_line_number)))  # TODO: Pick this up in other reporters
        self._header = ''

        if context.source:
            self._header += f"{BLACK + BRIGHT_RED_BACKGROUND} {INDICATORS[EMPHASIZE]} {' '.rjust(self._line_number_padding)} {RESET} {BOLD}{context.source}{RESET}\n"

    def _line(self, line, tag):
        if tag == OMISSION:
            return f"{DIM + BRIGHT_BLACK_BACKGROUND}{'...'.rjust(self._line_number_padding + 2)}  {RESET}"

        number = str(line + HUMAN_INDEXING)
        instruction = self._index[line]

        content = ''
        if instruction:
            if instruction['type'] == COMMENT or instruction['type'] == UNPARSED:
                content = BRIGHT_BLACK + self._context.input[instruction['ranges']['line'][BEGIN]:instruction['ranges']['line'][END]] + RESET
            else:
                content = self._context.input[instruction['ranges']['line'][BEGIN]:instruction['ranges']['line'][END]]

                ranges = [(name, range) for name, range in instruction['ranges'].items() if name != 'line']

                ranges.sort(key=lambda name_range_tuple: name_range_tuple[1][BEGIN], reverse=True)

                for (name, range) in ranges:
                    before = content[:range[BEGIN] - instruction['ranges']['line'][BEGIN]]
                    after = content[range[END] - instruction['ranges']['line'][BEGIN]:]

                    content = before + RANGE_STYLE[name] + self._context.input[range[BEGIN]:range[END]] + RESET + after

        return f"{GUTTER_STYLE[tag]} {INDICATORS[tag]} {number.rjust(self._line_number_padding)} {RESET} {content}"

    def _print(self):
        snippet = '\n'.join(self._line(line, tag) for line, tag in enumerate(self._snippet) if tag is not None)

        return self._header + snippet
