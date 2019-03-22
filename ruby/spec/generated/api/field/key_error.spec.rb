describe 'Obtaining and throwing an error with a custom message in the context of a field\'s key' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      raise Enolib.parse(input).field('field').key_error('my message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the key of this element: my message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,5]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Obtaining and throwing an error with a custom generated message in the context of a field\'s key' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      raise Enolib.parse(input).field('field').key_error { |key| "my generated message for field '#{key}'" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the key of this element: my generated message for field 'field'"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,5]]
    
    expect(error.selection).to eq(selection)
  end
end