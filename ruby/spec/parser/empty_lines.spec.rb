input = "\n" +
        " \n" +
        "  \n" +
        "   \n" +
        "\n" +
        " \n" +
        "  \n" +
        "   \n"

describe Enolib::Parser do
  describe 'Empty lines' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
