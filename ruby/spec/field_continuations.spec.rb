describe Enolib::Field do
  describe '#new' do
    context 'leading, trailing and in-between empty direct line continuations' do
      let(:input) do
        <<~DOC
        field:
        |
        | foo
        |
        | bar
        |
        DOC
      end

      it 'discards all empty direct lines continuations' do
        value = Enolib.parse(input).field('field').required_string_value
        expect(value).to eq('foobar')
      end
    end

    context 'leading, trailing and in-between empty spaced line continuations' do
      let(:input) do
        <<~DOC
        field:
        \\
        \\ foo
        \\
        \\ bar
        \\
        DOC
      end

      it 'ignores leading and trailing empty continuations' do
        value = Enolib.parse(input).field('field').required_string_value
        expect(value).to eq('foo bar')
      end
    end

    context 'leading and trailing empty lines copied from block' do
      let(:input) do
        <<~DOC
        -- block

        inbetween

        -- block

        field < block
        DOC
      end

      it 'retains all empty lines' do
        value = Enolib.parse(input).field('field').required_string_value
        expect(value).to eq("\ninbetween\n")
      end
    end
  end
end
