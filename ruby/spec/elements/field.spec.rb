describe Enolib::Field do
  before(:each) do
    @field = Enolib.parse('field: value').field('field')
  end

  it 'is untouched after initialization' do
    expect(@field.instance_variable_defined?(:@touched)).to be false
  end

  describe '#value_error' do
    context 'with a message' do
      it 'returns a custom error' do
        expect(@field.value_error('my custom error').message).to match_snapshot
      end
    end

    context 'with a message Proc' do
      it 'returns a custom error' do
        message_proc = ->(value) do
          "my custom generated message for value '#{value}'"
        end

        expect(@field.value_error(message_proc).message).to match_snapshot
      end
    end
  end

  describe '#raw' do
    it 'returns a debug representation' do
      expect(@field.raw).to eq({
        key: 'field',
        type: :field,
        value: 'value'
      })
    end
  end

  describe '#touch' do
    it 'touches the element' do
      @field.touch
      expect(@field.instance_variable_defined?(:@touched)).to be true
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@field.to_s).to eq('#<Enolib::Field key=field value=value>')
    end

    context 'with no value' do
      it 'returns a debug abstraction' do
        empty_field = Enolib.parse('field:').field('field')
        expect(empty_field.to_s).to eq('#<Enolib::Field key=field value=nil>')
      end
    end
  end

  describe '#required_string_value' do
    before(:each) do
      @value = @field.required_string_value
    end

    it 'returns the value' do
      expect(@value).to eq('value')
    end

    it 'touches the element' do
      expect(@field.instance_variable_defined?(:@touched)).to be true
    end
  end

  describe '#required_value' do
    context 'with a loader block' do
      before(:each) do
        @value = @field.required_value { |value| value.upcase }
      end

      it 'returns the processed value' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the element' do
        expect(@field.instance_variable_defined?(:@touched)).to be true
      end
    end

    context 'with a loader Proc' do
      before(:each) do
        @value = @field.required_value(Proc.new { |value| value.upcase })
      end

      it 'returns the processed value' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the element' do
        expect(@field.instance_variable_defined?(:@touched)).to be true
      end
    end

    context 'with a loader lambda' do
      before(:each) do
        @value = @field.required_value(->(value) { value.upcase })
      end

      it 'returns the processed value' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the element' do
        expect(@field.instance_variable_defined?(:@touched)).to be true
      end
    end
  end
end
