from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
# key
    ## key
###    key
    ####    key
# key
""".strip()

def test_field_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/section_analysis.snap.yaml')
