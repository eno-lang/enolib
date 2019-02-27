from tests.util import snapshot
from tests.analyzer.util import analyze

input = ('\n'
         ' \n'
         '  \n'
         '   \n'
         '\n'
         ' \n'
         '  \n'
         '   \n')

def test_empty_line_analysis():
  analysis = analyze(input)

  assert analysis == snapshot(analysis, 'tests/analyzer/snapshots/empty_line_analysis.snap.yaml')
