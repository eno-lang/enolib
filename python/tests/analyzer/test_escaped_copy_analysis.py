from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
template:

`key` < template
``ke`y`` < template
```k``ey```    < template
    `` `key` ``    < template
`key` < template
""".strip()

def test_escaped_copy_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/escaped_copy_analysis.snap.yaml')
