describe 'Triggering an error inside a custom loader when querying the key of a field' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      Enolib.parse(input).field('field').key { raise 'my error' }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the key of this element: my error"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,5]]
    
    expect(error.selection).to eq(selection)
  end
end