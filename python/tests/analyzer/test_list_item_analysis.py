from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
list:
- value
-    value
    - value
    -    value
- value
""".strip()

def test_list_item_analysis():
    analysis = analyze(input)

    assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/list_item_analysis.snap.yaml')
