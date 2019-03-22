describe 'Parsing a list item without any previous element' do
  it 'raises the expected ParseError' do
    error = nil

    input = "- item"

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
    
    text = "Line 1 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a list item preceded by a line continuation' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field:\n" +
            "| continuation\n" +
            "- item"

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
    
    text = "Line 3 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | field:\n" +
              "      2 | | continuation\n" +
              " >    3 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[2,0], [2,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a list item preceded by a fieldset entry' do
  it 'raises the expected ParseError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value\n" +
            "- item"

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
    
    text = "Line 3 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | fieldset:\n" +
              "      2 | entry = value\n" +
              " >    3 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[2,0], [2,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a list item preceded by a copied field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field: value\n" +
            "\n" +
            "copy < field\n" +
            "- item"

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
    
    text = "Line 4 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | \n" +
              "      3 | copy < field\n" +
              " >    4 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[3,0], [3,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a list item preceded by a copied fieldset' do
  it 'raises the expected ParseError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value\n" +
            "\n" +
            "copy < fieldset\n" +
            "- item"

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
    
    text = "Line 5 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | \n" +
              "      4 | copy < fieldset\n" +
              " >    5 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a list item preceded by a multiline field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "-- multiline_field\n" +
            "value\n" +
            "-- multiline_field\n" +
            "\n" +
            "copy < multiline_field\n" +
            "- item"

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
    
    text = "Line 6 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      4 | \n" +
              "      5 | copy < multiline_field\n" +
              " >    6 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[5,0], [5,6]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a list item preceded by an empty multiline field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "-- multiline_field\n" +
            "-- multiline_field\n" +
            "\n" +
            "copy < multiline_field\n" +
            "- item"

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
    
    text = "Line 5 contains a list item without a list being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | \n" +
              "      4 | copy < multiline_field\n" +
              " >    5 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,6]]
    
    expect(error.selection).to eq(selection)
  end
end