import enolib
from tests.util import snapshot

input = """
Field: Value
\\ Spaced line continuation
| Direct line continuation

Fieldset:
Entry = Value
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

def test_blackbox_test_continuations():
    result = enolib.parse(input).raw()

    assert result == snapshot(result, 'tests/blackbox/snapshots/continuations.snap.json')
