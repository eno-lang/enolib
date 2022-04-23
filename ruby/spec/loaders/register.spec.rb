# frozen_string_literal: true

input = <<~DOC
> comment
field: value

> comment
field_with_item:
- value

> comment
# section
DOC

describe 'register' do
  before :all do
    Enolib.register(custom: ->(value) { "custom #{value}" })
  end

  let(:document) { Enolib.parse(input) }

  let(:field) { document.field('field') }
  let(:field_with_item) { document.field('field_with_item') }
  let(:section) { document.section('section') }

  let(:missing_field) { document.field('missing') }
  let(:missing_section) { document.section('missing') }

  describe Enolib::Field do
    it 'registers an optional_custom_comment accessor' do
      expect(field.optional_custom_comment).to eq('custom comment')
    end

    it 'registers a required_custom_comment accessor' do
      expect(field.required_custom_comment).to eq('custom comment')
    end

    it 'registers a custom_key accessor' do
      expect(field.custom_key).to eq('custom field')
    end

    it 'registers an optional_custom_value accessor' do
      expect(field.optional_custom_value).to eq('custom value')
    end

    it 'registers a required_custom_value accessor' do
      expect(field.required_custom_value).to eq('custom value')
    end

    it 'registers an optional_custom_values accessor' do
      expect(field_with_item.optional_custom_values).to eq(['custom value'])
    end

    it 'registers a required_custom_values accessor' do
      expect(field_with_item.required_custom_values).to eq(['custom value'])
    end
  end

  describe Enolib::Section do
    it 'registers an optional_custom_comment accessor' do
      expect(section.optional_custom_comment).to eq('custom comment')
    end

    it 'registers a required_custom_comment accessor' do
      expect(section.required_custom_comment).to eq('custom comment')
    end

    it 'registers a custom_key accessor' do
      expect(section.custom_key).to eq('custom section')
    end
  end

  describe Enolib::MissingField do
    it 'registers an optional_custom_comment accessor' do
      expect(missing_field.optional_custom_comment).to be nil
    end

    it 'registers a required_custom_comment accessor' do
      expect { missing_field.required_custom_comment }.to raise_error(Enolib::ValidationError)
    end

    it 'registers a custom_key accessor' do
      expect { missing_field.custom_key }.to raise_error(Enolib::ValidationError)
    end

    it 'registers an optional_custom_value accessor' do
      expect(missing_field.optional_custom_value).to be nil
    end

    it 'registers a required_custom_value accessor' do
      expect { missing_field.required_custom_value }.to raise_error(Enolib::ValidationError)
    end

    it 'registers an optional_custom_values accessor' do
      expect(missing_field.optional_custom_values).to eq([])
    end

    it 'registers a required_custom_values accessor' do
      expect(missing_field.required_custom_values).to eq([])
    end
  end

  describe Enolib::MissingSection do
    it 'registers an optional_custom_comment accessor' do
      expect(missing_section.optional_custom_comment).to be nil
    end

    it 'registers a required_custom_comment accessor' do
      expect { missing_section.required_custom_comment }.to raise_error(Enolib::ValidationError)
    end

    it 'registers a custom_key accessor' do
      expect { missing_section.custom_key }.to raise_error(Enolib::ValidationError)
    end
  end
end
