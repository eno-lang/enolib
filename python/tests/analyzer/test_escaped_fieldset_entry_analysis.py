from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
fieldset:
`key` =
``k`ey`` =
```ke``y```    =
    `` `key` ``    =
`key` =
""".strip()

def test_escaped_fieldset_entry_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/escaped_fieldset_entry_analysis.snap.yaml')
