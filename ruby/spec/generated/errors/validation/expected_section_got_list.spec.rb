describe 'Expecting a section but getting a list with one item' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "list:\n" +
            "- item"

    begin
      Enolib.parse(input).section('list')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'list' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | list:\n" +
              " *    2 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [1,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a section but getting a list with empty lines and multiple items' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "list:\n" +
            "\n" +
            "- item\n" +
            "\n" +
            "- item\n" +
            "\n" +
            "- item\n" +
            ""

    begin
      Enolib.parse(input).section('list')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'list' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | list:\n" +
              " *    2 | \n" +
              " *    3 | - item\n" +
              " *    4 | \n" +
              " *    5 | - item\n" +
              " *    6 | \n" +
              " *    7 | - item\n" +
              "      8 | "
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [6,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Expecting a section but getting a list with two items with comments' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "list:\n" +
            "> comment\n" +
            "- item\n" +
            "\n" +
            "> comment\n" +
            "- item"

    begin
      Enolib.parse(input).section('list')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'list' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | list:\n" +
              " *    2 | > comment\n" +
              " *    3 | - item\n" +
              " *    4 | \n" +
              " *    5 | > comment\n" +
              " *    6 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [5,6]]
    
    expect(error.selection).to eq(selection)
  end
end