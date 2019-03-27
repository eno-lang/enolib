describe 'Expecting a section but getting a field' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      Enolib.parse(input).section('field')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'field' was expected."
    
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

describe 'Expecting a section but getting a field with continuations' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field:\n" +
            "| continuation\n" +
            "| continuation"

    begin
      Enolib.parse(input).section('field')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'field' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field:\n" +
              " *    2 | | continuation\n" +
              " *    3 | | continuation"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(2)
    expect(error.selection[:to][:column]).to eq(14)
  end
end

describe 'Expecting a section but getting a field with continuations separated by idle lines' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value\n" +
            "| continuation\n" +
            "| continuation\n" +
            "\n" +
            "> comment\n" +
            "| continuation"

    begin
      Enolib.parse(input).section('field')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "A section with the key 'field' was expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value\n" +
              " *    2 | | continuation\n" +
              " *    3 | | continuation\n" +
              " *    4 | \n" +
              " *    5 | > comment\n" +
              " *    6 | | continuation"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(5)
    expect(error.selection[:to][:column]).to eq(14)
  end
end