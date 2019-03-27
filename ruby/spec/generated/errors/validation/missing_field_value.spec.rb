describe 'Querying a field for a required but missing value' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field:"

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The field 'field' must contain a value."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field:"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(6)
    expect(error.selection[:to][:line]).to eq(0)
    expect(error.selection[:to][:column]).to eq(6)
  end
end