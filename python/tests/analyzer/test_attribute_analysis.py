from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
field:
attribute = value
attribute    = value
    attribute = value
    attribute    = value
    attribute    =    value
attribute = value
""".strip()

def test_attribute_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/attribute_analysis.snap.yaml')
