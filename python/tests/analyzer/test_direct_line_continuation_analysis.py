from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
field:

| value
|    value
    | value
    |    value
| value
""".strip()

def test_direct_line_continuation_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/direct_line_continuation_analysis.snap.yaml')
