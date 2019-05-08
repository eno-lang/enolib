# frozen_string_literal: true

input = <<~DOC.strip
fieldset:
`key`=value
``k`ey`` = value
```ke``y```     = more value
    `` `key` ``     =
DOC

describe Enolib::Parser do
  describe 'Escaped fieldset entries' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
