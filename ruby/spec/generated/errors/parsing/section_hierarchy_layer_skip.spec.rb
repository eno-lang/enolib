describe 'Starting a section two levels deeper than the current one' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# section\n" +
            "### subsubsection"

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
    
    text = "Line 2 starts a section that is more than one level deeper than the current one."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " *    1 | # section\n" +
              " >    2 | ### subsubsection"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [1,17]]
    
    expect(error.selection).to eq(selection)
  end
end