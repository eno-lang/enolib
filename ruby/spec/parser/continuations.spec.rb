# frozen_string_literal: true

input = <<~DOC.strip
field: value
\\ spaced continuation
| direct continuation

field_with_attribute:
attribute = value
\\ spaced continuation
| direct continuation

field_with_item:
- value
\\ spaced continuation
| direct continuation

field:
\\ spaced continuation
| direct continuation

field_with_attribute:
attribute =
\\ spaced continuation
| direct continuation

field_with_item:
-
\\ spaced continuation
| direct continuation
DOC

describe Enolib::Parser do
  describe 'Continuations' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
