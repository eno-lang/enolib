from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
`key`:

``k`ey``:

```ke``y```    :

    `` `key` ``    :

`key`:
""".strip()

def test_escaped_key_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/escaped_key_analysis.snap.yaml')
