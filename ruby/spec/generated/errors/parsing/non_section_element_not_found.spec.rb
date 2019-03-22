describe 'Copying a non-section element that does not exist' do
  it 'raises the expected ParseError' do
    error = nil

    input = "copy < element"

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
    
    text = "In line 1 the non-section element 'element' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | copy < element"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,14]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Copying a non-section element whose key only exists on a section' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# section\n" +
            "\n" +
            "# other_section\n" +
            "\n" +
            "copy < section"

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
    
    text = "In line 5 the non-section element 'section' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | # other_section\n" +
              "      4 | \n" +
              " >    5 | copy < section"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,14]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Copying an implied fieldset whose key only exists on a section' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# section\n" +
            "\n" +
            "# other_section\n" +
            "\n" +
            "copy < section\n" +
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
    
    text = "In line 5 the non-section element 'section' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | # other_section\n" +
              "      4 | \n" +
              " >    5 | copy < section\n" +
              "      6 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,14]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Copying an implied list whose key only exists on a section' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# section\n" +
            "\n" +
            "# other_section\n" +
            "\n" +
            "copy < section\n" +
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
    
    text = "In line 5 the non-section element 'section' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | # other_section\n" +
              "      4 | \n" +
              " >    5 | copy < section\n" +
              "      6 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,14]]
    
    expect(error.selection).to eq(selection)
  end
end