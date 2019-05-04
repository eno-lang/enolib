from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
> note
    > more notes
    >    note
    >
""".strip()

def test_comment_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/comment_analysis.snap.yaml')
