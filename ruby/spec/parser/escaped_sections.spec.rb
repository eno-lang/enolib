# frozen_string_literal: true

input = <<~DOC.strip
# `key`
## ``long ` key``
    ### ```ke``y```
    ####    ` key`
DOC

describe Enolib::Parser do
  describe 'Escaped sections' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
