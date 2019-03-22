describe 'Parsing a line continuation without any prior element' do
  it 'raises the expected ParseError' do
    error = nil

    input = "| continuation"

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
    
    text = "Line 1 contains a line continuation without a continuable element being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | | continuation"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,14]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Parsing a line continuation preceded by a copied field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field: value\n" +
            "\n" +
            "copy < field\n" +
            "| illegal_continuation"

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
    
    text = "Line 4 contains a line continuation without a continuable element being specified before."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | \n" +
              "      3 | copy < field\n" +
              " >    4 | | illegal_continuation"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[3,0], [3,22]]
    
    expect(error.selection).to eq(selection)
  end
end