# frozen_string_literal: true

input = <<~DOC.strip
field_with_items:
- item
- other
DOC

describe Enolib::Field do
  before(:each) do
    @field = Enolib.parse(input).field('field_with_items')
  end

  it 'is untouched after initialization' do
    expect(@field.instance_variable_defined?(:@touched)).to be false
  end

  it 'has only untouched items after initialization' do
    @field.items.each do |item|
      expect(item.instance_variable_defined?(:@touched)).to be false
    end
  end

  describe '#required_string_values' do
    before(:each) do
      @items = @field.required_string_values
    end

    it 'returns the values' do
      expect(@items).to eq(['item', 'other'])
    end

    it 'touches the field itself' do
      expect(@field.instance_variable_defined?(:@touched)).to be true
    end

    it 'touches all field items' do
      @field.items.each do |item|
        expect(item.instance_variable_defined?(:@touched)).to be true
      end
    end
  end

  describe '#required_values' do
    context 'with a loader block' do
      before(:each) do
        @items = @field.required_values { |value| value.upcase }
      end

      it 'applies the loader' do
        expect(@items).to eq(['ITEM', 'OTHER'])
      end

      it 'touches the field' do
        expect(@field.instance_variable_defined?(:@touched)).to be true
      end

      it 'touches all field items' do
        @field.items.each do |item|
          expect(item.instance_variable_defined?(:@touched)).to be true
        end
      end
    end

    context 'with a loader Proc' do
      before(:each) do
        @items = @field.required_values(proc { |value| value.upcase })
      end

      it 'applies the loader' do
        expect(@items).to eq(['ITEM', 'OTHER'])
      end

      it 'touches the field' do
        expect(@field.instance_variable_defined?(:@touched)).to be true
      end

      it 'touches all field items' do
        @field.items.each do |item|
          expect(item.instance_variable_defined?(:@touched)).to be true
        end
      end
    end
  end

  describe '#length' do
    it 'returns the number of items in the field' do
      expect(@field.length).to be(2)
    end
  end

  describe '#touch' do
    before(:each) do
      @field.touch
    end

    it 'touches the field itself' do
      expect(@field.instance_variable_defined?(:@touched)).to be true
    end

    it 'touches the field items' do
      @field.items.each do |item|
        expect(item.instance_variable_defined?(:@touched)).to be true
      end
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@field.to_s).to eq('#<Enolib::Field key=field_with_items items=2>')
    end
  end
end
