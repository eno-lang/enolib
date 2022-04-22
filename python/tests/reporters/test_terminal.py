import enolib
from enolib import TerminalReporter

from tests.util import snapshot

input = '''
> comment
# section

field: value

field_with_items:
- item
- item

> comment
- item

## subsection

field_with_attributes:
attribute = value

> comment
attribute = value
'''.strip()

def test_terminal_reporter_produces_colored_terminal_output():
    document = enolib.parse(input, reporter=TerminalReporter)

    snippet = document._context.reporter(document._context).report_element(document._context.document['elements'][0]).snippet()

    # Uncomment this to inspect the snippet correctness in a terminal for review
    # print(snippet)

    assert snippet == snapshot(snippet, 'tests/reporters/snapshots/terminal_reporter_produces_colored_terminal_output.snap.sh')
