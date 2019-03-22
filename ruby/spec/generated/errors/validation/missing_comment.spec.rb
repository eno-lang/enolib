describe 'Querying a section for a required but missing comment' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "# section"

    begin
      Enolib.parse(input).section('section').required_comment
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A required comment for this element is missing."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | # section"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,0]]
    
    expect(error.selection).to eq(selection)
  end
end