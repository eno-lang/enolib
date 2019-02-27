from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
key:
key:
key    :
    key    :
key:
""".strip()

def test_empty_element_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/empty_element_analysis.snap.yaml')
