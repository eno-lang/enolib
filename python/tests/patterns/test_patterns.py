from enolib.grammar_regex import Grammar
from tests.patterns.scenarios import SCENARIOS
from tests.patterns.util import space

MATCH_INDICES = [[name, value] for name, value in vars(Grammar).items() if name.endswith('_INDEX')]

def test_unified_grammar_matcher():
  for scenario in SCENARIOS:
    for variant in scenario['variants']:
      match = Grammar.REGEX.match(variant)

      if 'captures' in scenario:
        assert match is not None

        for label, index in MATCH_INDICES:
          if index in scenario['captures']:
            assert match.group(index) == scenario['captures'][index]
          else:
            assert match.group(index) is None
      else:
        assert match is None
