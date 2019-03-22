describe 'A single field with an terminated escaped key' do
  it 'raises the expected ParseError' do
    error = nil

    input = "`field: value"

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
    
    text = "In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | `field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,1], [0,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'A single section with an unterminated escaped key' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# `field: value"

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
    
    text = "In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | # `field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,3], [0,15]]
    
    expect(error.selection).to eq(selection)
  end
end