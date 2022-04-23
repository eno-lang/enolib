# frozen_string_literal: true

input = <<~DOC.strip
field_with_items:
-
- value
-    value
    - more value
    -    value
    -
DOC

describe Enolib::Parser do
  describe 'Items' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      # TODO: Infinite loop on serialization - possibly a problem with the serialization code in rspec_cheki
      # expect(context.document).to match_snapshot
    end
  end
end
