describe 'Obtaining and throwing an error with a custom message in the context of a field' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      raise Enolib.parse(input).field('field').error('my message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "my message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(0)
    expect(error.selection[:to][:column]).to eq(12)
  end
end

describe 'Obtaining and throwing an error with a custom generated message in the context of a field' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      raise Enolib.parse(input).field('field').error { |field| "my generated message for field '#{field.string_key}'" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "my generated message for field 'field'"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(0)
    expect(error.selection[:to][:column]).to eq(12)
  end
end