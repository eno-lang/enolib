from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
key:
key:
key    :
    key    :
key:
""".strip()

def test_ambiguous_element_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/ambiguous_element_analysis.snap.yaml')
