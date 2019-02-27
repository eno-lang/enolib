input = <<~DOC.strip
fieldset:
entry = value
other = value
DOC

describe Enolib::FieldsetEntry do
  before(:each) do
    @fieldset_entry = Enolib.parse(input).fieldset.entry('entry')
  end

  context 'required_string_value' do
    before(:each) do
      @value = @fieldset_entry.required_string_value
    end

    it 'returns a value' do
      expect(@value).to eq('value')
    end

    it 'touches the fieldset entry' do
      expect(@fieldset_entry.instance_variable_defined?(:@touched)).to be true
    end

    context 'when the entry is empty' do
      let(:error) do
        document = Enolib.parse(
          <<~DOC
            fieldset:
            entry =
          DOC
        )

        intercept_validation_error do
          document.fieldset('fieldset').entry('entry').required_string_value
        end
      end

      it 'raises an error' do
        expect(error.message).to match_snapshot
      end
    end
  end

  context 'required_value' do
    context 'with a loader block' do
      before(:each) do
        @value = @fieldset_entry.required_value { |value| value.upcase }
      end

      it 'applies the loader' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the fieldset entry' do
        expect(@fieldset_entry.instance_variable_defined?(:@touched)).to be true
      end
    end

    context 'with a loader Proc' do
      before(:each) do
        @value = @fieldset_entry.required_value(Proc.new { |value| value.upcase })
      end

      it 'applies the loader' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the fieldset entry' do
        expect(@fieldset_entry.instance_variable_defined?(:@touched)).to be true
      end
    end
  end
end
