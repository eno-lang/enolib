input = <<~DOC.strip
field:
|
| value
|    value
    | more value
    |    value
    |
DOC

describe Enolib::Parser do
  describe 'Direct line continuations' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
