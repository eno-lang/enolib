input = <<~DOC.strip
-- key
value
-- key
    --    key
    more value
  --  key
-- key
-- key
-- --
--
-- --
DOC

describe Enolib::Parser do
  describe 'Multiline fields' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
