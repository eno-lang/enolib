from tests.util import snapshot
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

    assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/escaped_key_analysis.snap.yaml')
