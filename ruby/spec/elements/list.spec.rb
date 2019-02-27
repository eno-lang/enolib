input = <<~DOC.strip
list:
- item
- other
DOC

describe Enolib::List do
  before(:each) do
    @list = Enolib.parse(input).list('list')
  end

  it 'is untouched after initialization' do
    expect(@list.instance_variable_defined?(:@touched)).to be false
  end

  it 'has only untouched items after initialization' do
    @list.items.each do |item|
      expect(item.instance_variable_defined?(:@touched)).to be false
    end
  end


  describe '#required_string_values' do
    before(:each) do
      @items = @list.required_string_values
    end

    it 'returns the values' do
      expect(@items).to eq(['item', 'other'])
    end

    it 'touches the list itself' do
      expect(@list.instance_variable_defined?(:@touched)).to be true
    end

    it 'touches all list items' do
      @list.items.each do |item|
        expect(item.instance_variable_defined?(:@touched)).to be true
      end
    end
  end

  describe '#required_values' do
    context 'with a loader block' do
      before(:each) do
        @items = @list.required_values { |value| value.upcase }
      end

      it 'applies the loader' do
        expect(@items).to eq(['ITEM', 'OTHER']);
      end

      it 'touches the list' do
        expect(@list.instance_variable_defined?(:@touched)).to be true
      end

      it 'touches all list items' do
        @list.items.each do |item|
          expect(item.instance_variable_defined?(:@touched)).to be true
        end
      end
    end

    context 'with a loader Proc' do
      before(:each) do
        @items = @list.required_values(Proc.new { |value| value.upcase })
      end

      it 'applies the loader' do
        expect(@items).to eq(['ITEM', 'OTHER']);
      end

      it 'touches the list' do
        expect(@list.instance_variable_defined?(:@touched)).to be true
      end

      it 'touches all list items' do
        @list.items.each do |item|
          expect(item.instance_variable_defined?(:@touched)).to be true
        end
      end
    end
  end

  describe '#length' do
    it 'returns the number of items in the list' do
      expect(@list.length).to be(2)
    end
  end

  describe '#raw' do
    it 'returns a native representation' do
      expect(@list.raw).to eq({
        key: 'list',
        items: [
          {
            type: :list_item,
            value: 'item'
          },
          {
            type: :list_item,
            value: 'other'
          }
        ],
        type: :list
      })
    end
  end

  describe '#touch' do
    before(:each) do
      @list.touch
    end

    it 'touches the list itself' do
      expect(@list.instance_variable_defined?(:@touched)).to be true
    end

    it 'touches the list items' do
      @list.items.each do |item|
        expect(item.instance_variable_defined?(:@touched)).to be true
      end
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@list.to_s).to eq('#<Enolib::List key=list items=2>')
    end
  end
end
