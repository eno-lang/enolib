describe 'A line without operators' do
  it 'raises the expected ParseError' do
    error = nil

    input = "list:\n" +
            "- item\n" +
            "- item\n" +
            "illegal"

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
    
    text = "Line 4 does not follow any specified pattern."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | - item\n" +
              "      3 | - item\n" +
              " >    4 | illegal"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[3,0], [3,7]]
    
    expect(error.selection).to eq(selection)
  end
end