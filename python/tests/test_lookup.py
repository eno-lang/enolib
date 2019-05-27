import enolib

from tests.util import snapshot

input = '''
field: value

list:
- item

- item

fieldset:
entry = value

entry = value

copied_field < field
copied_fieldset < fieldset
copied_list < list

# section

-- empty
-- empty

-- multiline
value
value
-- multiline

copied_multiline < multiline

## subsection
## copy < subsection
'''.strip()

SNIPPET_PADDING_WIDTH = 3
SNIPPET_PADDING = '▓' * SNIPPET_PADDING_WIDTH

# The + ' ' before closing SNIPPET_PADDING represents the last cursor
# (there is always one cursor index more than there are chars in a string)
snippet_input = SNIPPET_PADDING + input.replace('\n', '⏎').replace('\t', '⇥').replace(' ', '␣') + ' ' + SNIPPET_PADDING

def snippet(index):
    index += SNIPPET_PADDING_WIDTH

    return (
        snippet_input[index - SNIPPET_PADDING_WIDTH : index] +
        '  ' + snippet_input[index] + '  ' +
        snippet_input[index + 1 : index + SNIPPET_PADDING_WIDTH + 1]
    )

def test_lookup():
    column = 0
    line = 0

    summary = '\nINDEX  SNIPPET            KEY                  RANGE\n\n'

    for index in range(0, len(input) + 1):
        index_lookup = enolib.lookup(input, index=index)
        line_column_lookup = enolib.lookup(input, line=line, column=column)

        if index_lookup['range'] != line_column_lookup['range']:
            raise f"Lookup by index produced a different range ({index_lookup['range']}) than by line/column (${line_column_lookup['range']})"

        if index_lookup['element'].string_key() != line_column_lookup['element'].string_key():
            raise f"Lookup by index produced a different key ({index_lookup['element'].string_key()}) than by line/column (${line_column_lookup['element'].string_key()})"

        key = 'document' if index_lookup['element'].string_key() is None else index_lookup['element'].string_key()
        summary += f"{str(index).ljust(5)}  {snippet(index).rjust(9)}   =>   {key.ljust(20)} {index_lookup['range']}\n"

        if index < len(input) and input[index] == '\n':
            line += 1
            column = 0
        else:
            column += 1

    assert summary == snapshot(summary, 'tests/snapshots/lookup.snap.txt')
