describe 'Expecting a section but getting an empty element' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "element:"

    begin
      Enolib.parse(input).section('element')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'element' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | element:"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,8]]
    
    expect(error.selection).to eq(selection)
  end
end