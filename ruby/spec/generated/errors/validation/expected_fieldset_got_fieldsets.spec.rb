describe 'Expecting a fieldset but getting two fieldsets' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value\n" +
            "fieldset:\n" +
            "entry = value"

    begin
      Enolib.parse(input).fieldset('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only a single fieldset with the key 'fieldset' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | entry = value\n" +
              " >    3 | fieldset:\n" +
              " *    4 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [1,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a fieldset but getting two fieldsets with comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "> comment\n" +
            "fieldset:\n" +
            "entry = value\n" +
            "\n" +
            "entry = value\n" +
            "\n" +
            "fieldset:\n" +
            "> comment\n" +
            "entry = value"

    begin
      Enolib.parse(input).fieldset('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only a single fieldset with the key 'fieldset' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | > comment\n" +
              " >    2 | fieldset:\n" +
              " *    3 | entry = value\n" +
              " *    4 | \n" +
              " *    5 | entry = value\n" +
              "      6 | \n" +
              " >    7 | fieldset:\n" +
              " *    8 | > comment\n" +
              " *    9 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [4,13]]
    
    expect(error.selection).to eq(selection)
  end
end