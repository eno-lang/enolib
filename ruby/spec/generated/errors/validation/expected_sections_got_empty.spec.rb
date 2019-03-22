describe 'Expecting sections but getting an empty element' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "element:"

    begin
      Enolib.parse(input).sections('element')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only sections with the key 'element' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | element:"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,8]]
    
    expect(error.selection).to eq(selection)
  end
end