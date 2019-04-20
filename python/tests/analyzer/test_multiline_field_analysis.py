from tests.util import snapshot
from tests.analyzer.util import analyze

input = """
-- key
value
-- key

--    key

value

    -- key

    --    key
value

    value
        -- key

-- key
-- key
""".strip()

def test_multiline_field_analysis():
    analysis = analyze(input)

    assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/multiline_field_analysis.snap.yaml')
