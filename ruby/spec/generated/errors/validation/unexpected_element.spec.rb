describe 'Asserting everything was touched on an untouched document' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      Enolib.parse(input).assert_all_touched
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,12]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Asserting everything was touched on an untouched document, with a custom message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      Enolib.parse(input).assert_all_touched('my custom message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "my custom message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,12]]
    
    expect(error.selection).to eq(selection)
  end
end