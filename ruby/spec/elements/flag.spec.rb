# frozen_string_literal: true

describe Enolib::Flag do
  before(:each) do
    @flag = Enolib.parse('flag').flag
  end

  it 'is untouched after initialization' do
    expect(@flag.instance_variable_defined?(:@touched)).to be false
  end

  describe '#error' do
    context 'with a message' do
      it 'returns a custom error' do
        expect(@flag.error('my custom error').message).to match_snapshot
      end
    end

    context 'with a message Proc' do
      it 'returns a custom error' do
        message_proc = proc do |element|
          "my custom generated message for flag '#{element.string_key}'"
        end

        expect(@flag.error(message_proc).message).to match_snapshot
      end
    end
  end

  describe '#touch' do
    it 'touches the element' do
      @flag.touch
      expect(@flag.instance_variable_defined?(:@touched)).to be true
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@flag.to_s).to eq('#<Enolib::Flag key=flag>')
    end
  end
end
