# frozen_string_literal: true

input = <<~DOC.strip
field:
`key`=value
``k`ey`` = value
```ke``y```     = more value
    `` `key` ``     =
DOC

describe Enolib::Parser do
  describe 'Escaped attributes' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
