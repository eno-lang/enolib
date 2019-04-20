from tests.analyzer.util import analyze
from tests.util import snapshot

input = """
Field: Value
\\ Spaced line continuation
| Direct line continuation

Fieldset:
Empty = Value
\\ Spaced line continuation
| Direct line continuation

List:
- Value
\\ Spaced line continuation
| Direct line continuation

Empty field:
\\ Spaced line continuation
| Direct line continuation

Fieldset with empty entry:
Empty entry =
\\ Spaced line continuation
| Direct line continuation

List with empty item:
-
\\ Spaced line continuation
| Direct line continuation
""".strip()

def test_continuations():
    analysis = analyze(input)

    assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/continuations.snap.yaml')
