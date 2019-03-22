describe 'Querying an empty document for a required but missing section' do
  it 'raises the expected ValidationError' do
    error = nil

    input = ""

    begin
      Enolib.parse(input).required_section('section')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " ?    1 | "
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,0]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Querying a section for a required but missing section' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "# section"

    begin
      Enolib.parse(input).section('section').required_section('section')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " *    1 | # section"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,9], [0,9]]
    
    expect(error.selection).to eq(selection)
  end
end