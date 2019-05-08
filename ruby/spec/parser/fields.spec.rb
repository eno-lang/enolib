# frozen_string_literal: true

input = <<~DOC.strip
key:value
key: value
key: more value
    key    :    value
DOC

describe Enolib::Parser do
  describe 'Fields' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
