describe 'Expecting a field but getting two fields' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value\n" +
            "field: value"

    begin
      Enolib.parse(input).field('field')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only a single field with the key 'field' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value\n" +
              " >    2 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,12]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a field but getting two fields with comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "> comment\n" +
            "field: value\n" +
            "\\ continuation\n" +
            "\n" +
            "\\ continuation\n" +
            "\n" +
            "field: value\n" +
            "> comment\n" +
            "| continutation"

    begin
      Enolib.parse(input).field('field')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only a single field with the key 'field' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | > comment\n" +
              " >    2 | field: value\n" +
              " *    3 | \\ continuation\n" +
              " *    4 | \n" +
              " *    5 | \\ continuation\n" +
              "      6 | \n" +
              " >    7 | field: value\n" +
              " *    8 | > comment\n" +
              " *    9 | | continutation"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [4,14]]
    
    expect(error.selection).to eq(selection)
  end
end