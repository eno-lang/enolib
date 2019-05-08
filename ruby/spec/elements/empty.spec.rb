# frozen_string_literal: true

describe Enolib::Empty do
  before(:each) do
    @empty = Enolib.parse('element:').empty
  end

  it 'is untouched after initialization' do
    expect(@empty.instance_variable_defined?(:@touched)).to be false
  end

  describe '#error' do
    context 'with a message' do
      it 'returns a custom error' do
        expect(@empty.error('my custom error').message).to match_snapshot
      end
    end

    context 'with a message Proc' do
      it 'returns a custom error' do
        message_proc = ->(element) do
          "my custom generated message for empty element '#{element.string_key}'"
        end

        expect(@empty.error(message_proc).message).to match_snapshot
      end
    end
  end

  describe '#raw' do
    it 'returns a native object representation' do
      expect(@empty.raw).to eq({
          key: 'element',
          type: :empty_element
        })
    end
  end

  describe '#touch' do
    it 'touches the element' do
      @empty.touch
      expect(@empty.instance_variable_defined?(:@touched)).to be true
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@empty.to_s).to eq('#<Enolib::Empty key=element>')
    end
  end
end
