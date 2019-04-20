from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
template:

key < template
key    < template
     key     < template
""".strip()

def test_escaped_copy_analysis():
    analysis = analyze(input)

    assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/copy_analysis.snap.yaml')
