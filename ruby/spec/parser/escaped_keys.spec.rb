# frozen_string_literal: true

input = <<~DOC.strip
`key`:
``k`ey``:
```ke``y```    :
    `` `key` ``    :
DOC

describe Enolib::Parser do
  describe 'Escaped keys' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
