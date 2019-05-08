# frozen_string_literal: true

input = <<~DOC.strip
> note
> more notes
    >    note
    >
DOC

describe Enolib::Parser do
  describe 'Comments' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
