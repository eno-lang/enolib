# frozen_string_literal: true

input = <<~DOC.strip
Field: Value
\\ Spaced continuation
| Direct continuation

Field:
Attribute = Value
\\ Spaced continuation
| Direct continuation

List:
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
DOC

describe 'Blackbox test' do
  describe 'Continuations' do
    it 'performs as expected' do
      # TODO: Replace .raw with custom spec helper
      expect(Enolib.parse(input).raw).to match_snapshot
    end
  end
end
