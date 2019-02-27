from tests.util import snapshot
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

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/analyzer.snap.yaml')
