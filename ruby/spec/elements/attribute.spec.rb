# frozen_string_literal: true

input = <<~DOC.strip
field:
attribute = value
other = value
DOC

describe Enolib::Attribute do
  before(:each) do
    @attribute = Enolib.parse(input).field.attribute('attribute')
  end

  context 'required_string_value' do
    before(:each) do
      @value = @attribute.required_string_value
    end

    it 'returns a value' do
      expect(@value).to eq('value')
    end

    it 'touches the attribute' do
      expect(@attribute.instance_variable_defined?(:@touched)).to be true
    end

    context 'when the attribute is empty' do
      let(:error) do
        document = Enolib.parse(
          <<~DOC
            field:
            attribute =
          DOC
        )

        intercept_validation_error do
          document.field('field').attribute('attribute').required_string_value
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
        @value = @attribute.required_value { |value| value.upcase }
      end

      it 'applies the loader' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the attribute' do
        expect(@attribute.instance_variable_defined?(:@touched)).to be true
      end
    end

    context 'with a loader Proc' do
      before(:each) do
        @value = @attribute.required_value(proc { |value| value.upcase })
      end

      it 'applies the loader' do
        expect(@value).to eq('VALUE')
      end

      it 'touches the attribute' do
        expect(@attribute.instance_variable_defined?(:@touched)).to be true
      end
    end
  end
end
