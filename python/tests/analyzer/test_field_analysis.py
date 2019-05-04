from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
key: value
key:    value
key    : value
    key    :    value
key: value
""".strip()

def test_field_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/field_analysis.snap.yaml')
