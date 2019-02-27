from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
> note
    > more notes
    >    note
    >
""".strip()

def test_comment_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/comment_analysis.snap.yaml')
