describe 'Querying an empty fieldset for a required but missing entry' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:"

    begin
      Enolib.parse(input).fieldset('fieldset').required_entry('entry')
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
    
    snippet = "   Line | Content\n" +
              " *    1 | fieldset:"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,9], [0,9]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Querying a fieldset with two entries for a required but missing entry' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value\n" +
            "entry = value"

    begin
      Enolib.parse(input).fieldset('fieldset').missing('missing')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The fieldset entry 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " *    1 | fieldset:\n" +
              " ?    2 | entry = value\n" +
              " ?    3 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,9], [0,9]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Querying a fieldset with entries, empty lines and comments for a required but missing entry' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "\n" +
            "> comment\n" +
            "entry = value\n" +
            "\n" +
            "> comment\n" +
            "entry = value"

    begin
      Enolib.parse(input).fieldset('fieldset').missing('missing')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The fieldset entry 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " *    1 | fieldset:\n" +
              " ?    2 | \n" +
              " ?    3 | > comment\n" +
              " ?    4 | entry = value\n" +
              " ?    5 | \n" +
              " ?    6 | > comment\n" +
              " ?    7 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,9], [0,9]]
    
    expect(error.selection).to eq(selection)
  end
end