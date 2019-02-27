describe Enolib::Parser do
  context 'with a complex sample' do
    input = File.read(File.join(__dir__, 'samples/complex.eno'))

    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
