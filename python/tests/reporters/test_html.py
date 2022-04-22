import enolib
from enolib import HtmlReporter

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


def test_html_reporter_produces_html_output():
    document = enolib.parse(input, reporter=HtmlReporter)

    snippet = document._context.reporter(document._context).report_element(document._context.document['elements'][0]).snippet()

    assert snippet == snapshot(snippet, 'tests/reporters/snapshots/html_reporter_produces_html_output.snap.html')
