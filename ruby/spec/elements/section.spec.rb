# frozen_string_literal: true

input = <<~DOC.strip
field: value
other: value
DOC

describe Enolib::Section do
  before(:each) do
    @section = Enolib.parse(input)
  end

  it 'is untouched after initialization' do
    expect(@section.instance_variable_defined?(:@touched)).to be false
  end

  it 'has only untouched elements after initialization' do
    @section.elements.each do |element|
      expect(element.instance_variable_defined?(:@touched)).to be false
    end
  end

  it 'has all_elements_required disabled by default' do
    expect(@section.all_elements_required?).to be false
  end

  describe '#raw' do
    it 'returns a native representation' do
      expect(@section.raw).to eq({
        elements:  [
          {
            key: 'field',
            type: :field,
            value: 'value'
          },
          {
            key: 'other',
            type: :field,
            value: 'value'
          }
        ],
        type: :document
      })
    end
  end

  describe '#touch' do
    it 'touches the section' do
      @section.touch
      expect(@section.instance_variable_defined?(:@touched)).to be true
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@section.to_s).to eq('#<Enolib::Section document elements=2>')
    end
  end
end
