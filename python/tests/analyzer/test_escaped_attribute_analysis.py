from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
field:
`key` =
``k`ey`` =
```ke``y```    =
    `` `key` ``    =
`key` =
""".strip()

def test_escaped_attribute_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/escaped_attribute_analysis.snap.yaml')
