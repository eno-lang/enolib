from tests.util import snapshot
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

    assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/field_analysis.snap.yaml')
