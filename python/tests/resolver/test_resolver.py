from enolib import parse

from tests.util import snapshot

input = '''
language field: eno notation language

language < language field

-- language multiline_field
eno notation language
-- language multiline_field

language < language multiline_field

language list:
- eno
- json
- yaml

languages < language list

languages fieldset:
eno = error notation
json = javascript object notation

languages fieldset corrected < languages fieldset
eno = eno notation

# languages section

eno: error notation
json: javascript object notation

# languages section corrected < languages section

eno: eno notation

# languages deep section

## eno

name:
short = err
long = error notation

## json

name:
short = json
long = javascript object notation

# languages deep section corrected and extended << languages deep section

## eno

name:
short = eno
long = eno notation

## yaml

name:
short = yaml
long = yaml ain't markup language
'''

def test_resolver_resolves_dependencies_without_error():
  result = parse(input).raw()

  assert result == snapshot(result, 'tests/resolver/snapshots/resolver_resolves_dependencies_without_error.snap.json')
