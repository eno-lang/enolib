describe 'Expecting a list but getting two lists' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "list:\n" +
            "- item\n" +
            "list:\n" +
            "- item"

    begin
      Enolib.parse(input).list('list')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only a single list with the key 'list' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | list:\n" +
              " *    2 | - item\n" +
              " >    3 | list:\n" +
              " *    4 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [1,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a list but getting two lists with comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "> comment\n" +
            "list:\n" +
            "- item\n" +
            "\n" +
            "- item\n" +
            "\n" +
            "list:\n" +
            "> comment\n" +
            "- item\n" +
            "\\ continuation"

    begin
      Enolib.parse(input).list('list')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only a single list with the key 'list' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | > comment\n" +
              " >    2 | list:\n" +
              " *    3 | - item\n" +
              " *    4 | \n" +
              " *    5 | - item\n" +
              "      6 | \n" +
              " >    7 | list:\n" +
              " *    8 | > comment\n" +
              " *    9 | - item\n" +
              " *   10 | \\ continuation"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [4,6]]
    
    expect(error.selection).to eq(selection)
  end
end