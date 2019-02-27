input = <<~DOC.strip
fieldset:
entry = value
other = value
DOC

describe Enolib::Fieldset do
  before(:each) do
    @fieldset = Enolib.parse(input).fieldset
  end

  it 'is untouched after initialization' do
    expect(@fieldset.instance_variable_defined?(:@touched)).to be false
  end

  it 'has only untouched entries after initialization' do
    @fieldset.entries.each do |entry|
      expect(entry.instance_variable_defined?(:@touched)).to be false
    end
  end

  it 'has all_entries_required disabled by default' do
    expect(@fieldset.instance_variable_get(:@all_entries_required)).to be false
  end

  describe '#entry' do
    it 'returns an entry' do
      expect(@fieldset.entry('entry')).to be_a(Enolib::FieldsetEntry)
    end

    it 'returns the right entry' do
      expect(@fieldset.entry('entry').string_key).to eq('entry')
    end
  end

  describe '#entries' do
    before(:each) do
      @entries = @fieldset.entries
    end

    it 'returns all entries' do
      expect(@entries.length).to be 2
    end

    it 'returns entries' do
      @entries.each do |entry|
        expect(entry).to be_a(Enolib::FieldsetEntry)
      end
    end

    it 'touches the fieldset' do
      expect(@fieldset.instance_variable_defined?(:@touched)).to be true
    end

    it 'does not touch the entries' do
      @entries.each do |entry|
        expect(entry.instance_variable_defined?(:@touched)).to be false
      end
    end
  end

  describe '#entry' do
    context 'when the entry does not exist' do
      it 'returns a missing proxy instance' do
        expect(@fieldset.entry('missing')).to be_a(Enolib::MissingFieldsetEntry)
      end
    end
  end

  describe '#raw' do
    it 'returns a debug representation' do
      expect(@fieldset.raw).to eq({
        key: 'fieldset',
        entries: [
          {
            key: 'entry',
            type: :fieldset_entry,
            value: 'value'
          },
          {
            key: 'other',
            type: :fieldset_entry,
            value: 'value'
          }
        ],
        type: :fieldset
      })
    end
  end

  describe '#touch' do
    before(:each) do
      @fieldset.touch
    end

    it 'touches the fieldset' do
      expect(@fieldset.instance_variable_defined?(:@touched)).to be true
    end

    it 'touches the fieldset entries' do
      @fieldset.entries.each do |entry|
        expect(entry.instance_variable_defined?(:@touched)).to be true
      end
    end
  end

  describe '#to_s' do
    it 'returns a debug abstraction' do
      expect(@fieldset.to_s).to eq('#<Enolib::Fieldset key=fieldset entries=2>')
    end
  end
end
