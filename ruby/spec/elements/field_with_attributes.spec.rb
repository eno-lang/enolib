# frozen_string_literal: true

input = <<~DOC.strip
field:
attribute = value
other = value
DOC

describe Enolib::Field do
  before(:each) do
    @field = Enolib.parse(input).field
  end

  it 'is untouched after initialization' do
    expect(@field.instance_variable_defined?(:@touched)).to be false
  end

  it 'has only untouched attributes after initialization' do
    @field.attributes.each do |attribute|
      expect(attribute.instance_variable_defined?(:@touched)).to be false
    end
  end

  it 'has all_attributes_required disabled by default' do
    expect(@field.instance_variable_get(:@all_attributes_required)).to be false
  end

  describe '#attribute' do
    it 'returns an attribute' do
      expect(@field.attribute('attribute')).to be_a(Enolib::Attribute)
    end

    it 'returns the right attribute' do
      expect(@field.attribute('attribute').string_key).to eq('attribute')
    end
  end

  describe '#attributes' do
    before(:each) do
      @attributes = @field.attributes
    end

    it 'returns all attributes' do
      expect(@attributes.length).to be 2
    end

    it 'returns attributes' do
      @attributes.each do |attribute|
        expect(attribute).to be_a(Enolib::Attribute)
      end
    end

    it 'touches the field' do
      expect(@field.instance_variable_defined?(:@touched)).to be true
    end

    it 'does not touch the attributes' do
      @attributes.each do |attribute|
        expect(attribute.instance_variable_defined?(:@touched)).to be false
      end
    end
  end

  describe '#attribute' do
    context 'when the attribute does not exist' do
      it 'returns a missing proxy instance' do
        expect(@field.attribute('missing')).to be_a(Enolib::MissingAttribute)
      end
    end
  end

  describe '#touch' do
    before(:each) do
      @field.touch
    end

    it 'touches the field' do
      expect(@field.instance_variable_defined?(:@touched)).to be true
    end

    it 'touches the field attributes' do
      @field.attributes.each do |attribute|
        expect(attribute.instance_variable_defined?(:@touched)).to be true
      end
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@field.to_s).to eq('#<Enolib::Field key=field attributes=2>')
    end
  end
end
