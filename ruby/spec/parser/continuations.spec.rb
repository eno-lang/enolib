# frozen_string_literal: true

input = <<~DOC.strip
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
DOC

describe Enolib::Parser do
  describe 'Continuations' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
