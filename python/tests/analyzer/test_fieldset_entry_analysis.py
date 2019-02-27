from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
fieldset:
entry = value
entry    = value
    entry = value
    entry    = value
    entry    =    value
entry = value
""".strip()

def test_field_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/fieldset_entry_analysis.snap.yaml')
