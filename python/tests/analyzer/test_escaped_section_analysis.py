from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
# `key`

## ``ke`y``

### ```k``ey```

    #### `` `key` ``

# `key`
""".strip()

def test_escaped_section_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/escaped_section_analysis.snap.yaml')
