from tests.util import match_object_snapshot
from tests.analyzer.util import analyze

input = """
language: eno

languages:
- eno
- yaml
-

languages:
eno = eno notation language
json = json object notation

-- languages
eno
yaml

json

-- languages
""".strip()

def test_tokenizer():
    analysis = analyze(input)

    assert match_object_snapshot(analysis, 'tests/analyzer/snapshots/analyzer.snap.yaml')
