from tests.util import match_object_snapshot
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

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/multiline_field_analysis.snap.yaml')
