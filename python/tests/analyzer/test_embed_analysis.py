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

def test_embed_analysis():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/embed_analysis.snap.yaml')
