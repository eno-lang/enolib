from tests.util import snapshot
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

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/escaped_fieldset_entry_analysis.snap.yaml')
