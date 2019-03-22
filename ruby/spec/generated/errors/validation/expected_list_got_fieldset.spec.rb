describe 'Expecting a list but getting a fieldset with one item' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value"

    begin
      Enolib.parse(input).list('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A list with the key 'fieldset' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [1,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a list but getting a fieldset with empty lines and multiple entries' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "\n" +
            "entry = value\n" +
            "\n" +
            "entry = value\n" +
            "\n" +
            "entry = value\n" +
            ""

    begin
      Enolib.parse(input).list('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A list with the key 'fieldset' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | \n" +
              " *    3 | entry = value\n" +
              " *    4 | \n" +
              " *    5 | entry = value\n" +
              " *    6 | \n" +
              " *    7 | entry = value\n" +
              "      8 | "
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [6,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a list but getting a fieldset with two entries with comments' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "> comment\n" +
            "entry = value\n" +
            "\n" +
            "> comment\n" +
            "entry = value"

    begin
      Enolib.parse(input).list('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A list with the key 'fieldset' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | > comment\n" +
              " *    3 | entry = value\n" +
              " *    4 | \n" +
              " *    5 | > comment\n" +
              " *    6 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [5,13]]
    
    expect(error.selection).to eq(selection)
  end
end