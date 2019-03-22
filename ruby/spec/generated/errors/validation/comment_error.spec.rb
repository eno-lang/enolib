describe 'Triggering an error inside a custom loader when querying a required comment on a field' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "> comment\n" +
            "field: value"

    begin
      Enolib.parse(input).field('field').required_comment { raise 'my error' }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the comment of this element: my error"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | > comment\n" +
              " *    2 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,2], [0,9]]
    
    expect(error.selection).to eq(selection)
  end
end