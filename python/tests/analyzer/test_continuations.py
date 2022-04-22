from tests.analyzer.util import analyze
from tests.util import match_object_snapshot

input = """
Field: Value
\\ Spaced continuation
| Direct continuation

Field:
Empty = Value
\\ Spaced continuation
| Direct continuation

Field with item:
- Value
\\ Spaced continuation
| Direct continuation

Field:
\\ Spaced continuation
| Direct continuation

Field with attribute:
Attribute =
\\ Spaced continuation
| Direct continuation

Field with item:
-
\\ Spaced continuation
| Direct continuation
""".strip()

def test_continuations():
    analysis = analyze(input)
    
    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/continuations.snap.yaml')
