describe 'Expecting lists but getting a fieldset with one item' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value"

    begin
      Enolib.parse(input).lists('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only lists with the key 'fieldset' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(1)
    expect(error.selection[:to][:column]).to eq(13)
  end
end

describe 'Expecting lists but getting a fieldset with empty lines and multiple entries' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "\n" +
            "entry = value\n" +
            "\n" +
            "entry = value\n" +
            "\n" +
            "entry = value\n" +
            ""

    begin
      Enolib.parse(input).lists('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only lists with the key 'fieldset' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | \n" +
              " *    3 | entry = value\n" +
              " *    4 | \n" +
              " *    5 | entry = value\n" +
              " *    6 | \n" +
              " *    7 | entry = value\n" +
              "      8 | "
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(6)
    expect(error.selection[:to][:column]).to eq(13)
  end
end

describe 'Expecting lists but getting a fieldset with two entries with comments' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "> comment\n" +
            "entry = value\n" +
            "\n" +
            "> comment\n" +
            "entry = value"

    begin
      Enolib.parse(input).lists('fieldset')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only lists with the key 'fieldset' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | > comment\n" +
              " *    3 | entry = value\n" +
              " *    4 | \n" +
              " *    5 | > comment\n" +
              " *    6 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(5)
    expect(error.selection[:to][:column]).to eq(13)
  end
end