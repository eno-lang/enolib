describe 'Parsing a fieldset entry without a fieldset' do
  it 'raises the expected ParseError' do
    error = nil

    input = "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 1 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a line continuation' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field:\n" +
            "| line_continuation\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 3 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | field:\n" +
              "      2 | | line_continuation\n" +
              " >    3 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[2,0], [2,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field: value\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 2 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | field: value\n" +
              " >    2 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [1,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a list item' do
  it 'raises the expected ParseError' do
    error = nil

    input = "list:\n" +
            "- item\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 3 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | list:\n" +
              "      2 | - item\n" +
              " >    3 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[2,0], [2,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a copied field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field: value\n" +
            "\n" +
            "copy < field\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 4 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | \n" +
              "      3 | copy < field\n" +
              " >    4 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[3,0], [3,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a copied list' do
  it 'raises the expected ParseError' do
    error = nil

    input = "list:\n" +
            "- item\n" +
            "\n" +
            "copy < list\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 5 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | \n" +
              "      4 | copy < list\n" +
              " >    5 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a copied empty multiline field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "-- multiline field\n" +
            "-- multiline field\n" +
            "\n" +
            "copy < multiline field\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 5 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | \n" +
              "      4 | copy < multiline field\n" +
              " >    5 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a fieldset entry preceded by a copied multiline field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "-- multiline field\n" +
            "value\n" +
            "-- multiline field\n" +
            "\n" +
            "copy < multiline field\n" +
            "entry = value"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "Line 6 contains a fieldset entry without a fieldset being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      4 | \n" +
              "      5 | copy < multiline field\n" +
              " >    6 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[5,0], [5,13]]
    
    expect(error.selection).to eq(selection)
  end
end