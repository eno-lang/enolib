describe 'Querying a missing entry on a fieldset when all entries are required' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:"

    begin
      fieldset = Enolib.parse(input).fieldset('fieldset')
      
      fieldset.all_entries_required
      fieldset.entry('entry')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization."
    
    expect(error.text).to eq(text)
  end
end

describe 'Querying a missing entry on a fieldset when all requiring all entries is explicitly enabled' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:"

    begin
      fieldset = Enolib.parse(input).fieldset('fieldset')
      
      fieldset.all_entries_required(true)
      fieldset.entry('entry')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization."
    
    expect(error.text).to eq(text)
  end
end

describe 'Querying a missing entry on a fieldset when requiring all entries is explicitly disabled' do
  it 'produces the expected result' do
    input = "fieldset:"

    fieldset = Enolib.parse(input).fieldset('fieldset')
    
    fieldset.all_entries_required(false)
    fieldset.entry('entry')

    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing entry on a fieldset when requiring all entries is enabled and disabled again' do
  it 'produces the expected result' do
    input = "fieldset:"

    fieldset = Enolib.parse(input).fieldset('fieldset')
    
    fieldset.all_entries_required(true)
    fieldset.all_entries_required(false)
    fieldset.entry('entry')

    expect('it passes').to be_truthy
  end
end