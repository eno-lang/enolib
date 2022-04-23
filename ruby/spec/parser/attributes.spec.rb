# frozen_string_literal: true

input = <<~DOC.strip
field:
key=value
key = value
key = more value
    more key    =    value
DOC

describe Enolib::Parser do
  describe 'Attributes' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
