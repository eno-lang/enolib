from tests.util import match_object_snapshot
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

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/fieldset_entry_analysis.snap.yaml')
