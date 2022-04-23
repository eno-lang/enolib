# frozen_string_literal: true

describe Enolib::Field do
  describe '#new' do
    context 'leading, trailing and in-between empty direct continuations' do
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

      it 'discards all empty direct continuations' do
        value = Enolib.parse(input).field('field').required_string_value
        expect(value).to eq('foobar')
      end
    end

    context 'leading, trailing and in-between empty spaced continuations' do
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
  end
end
