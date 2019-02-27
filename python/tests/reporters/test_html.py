import enolib
from enolib.reporters import HtmlReporter

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


def test_html_reporter_produces_html_output():
  document = enolib.parse(input, reporter=HtmlReporter)

  snippet = document._context.reporter(document._context).report_element(document._context.document['elements'][0]).snippet()

  assert snippet == snapshot(snippet, 'tests/reporters/snapshots/html_reporter_produces_html_output.snap.html')
