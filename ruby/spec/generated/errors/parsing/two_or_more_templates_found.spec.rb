describe 'Copying a field that exists twice' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field: value\n" +
            "field: value\n" +
            "\n" +
            "copy < field"

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
    
    text = "There are at least two elements with the key 'field' that qualify for being copied here, it is not clear which to copy."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " ?    1 | field: value\n" +
              " ?    2 | field: value\n" +
              "      3 | \n" +
              " >    4 | copy < field"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[3,0], [3,12]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Copying a section that exists twice' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# section\n" +
            "\n" +
            "# section\n" +
            "\n" +
            "# copy < section"

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
    
    text = "There are at least two elements with the key 'section' that qualify for being copied here, it is not clear which to copy."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " ?    1 | # section\n" +
              "      2 | \n" +
              " ?    3 | # section\n" +
              "      4 | \n" +
              " >    5 | # copy < section"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[4,0], [4,16]]
    
    expect(error.selection).to eq(selection)
  end
end