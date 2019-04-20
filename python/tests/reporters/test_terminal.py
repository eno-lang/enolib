import enolib
from enolib.reporters import TerminalReporter

from tests.util import snapshot

input = '''
> comment
# section

field: value

list:
- item
- item

> comment
- item

## subsection

fieldset:
entry = value

> comment
entry = value
'''.strip()

def test_terminal_reporter_produces_colored_terminal_output():
    document = enolib.parse(input, reporter=TerminalReporter)

    snippet = document._context.reporter(document._context).report_element(document._context.document['elements'][0]).snippet()

    # Uncomment this to inspect the snippet correctness in a terminal for review
    # print(snippet)

    assert snippet == snapshot(snippet, 'tests/reporters/snapshots/terminal_reporter_produces_colored_terminal_output.snap.sh')
