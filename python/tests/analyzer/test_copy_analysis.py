from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
template:

key < template
key    < template
     key     < template
""".strip()

def test_escaped_copy_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/copy_analysis.snap.yaml')
