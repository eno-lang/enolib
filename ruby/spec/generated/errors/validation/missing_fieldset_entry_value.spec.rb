describe 'Querying a fieldset entry for a required but missing value' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "entry ="

    begin
      Enolib.parse(input).fieldset('fieldset').entry('entry').required_string_value
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The fieldset entry 'entry' must contain a value."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | fieldset:\n" +
              " >    2 | entry ="
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(1)
    expect(error.selection[:from][:column]).to eq(7)
    expect(error.selection[:to][:line]).to eq(1)
    expect(error.selection[:to][:column]).to eq(7)
  end
end