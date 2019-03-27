describe 'Expecting lists but getting an empty section' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "# section"

    begin
      Enolib.parse(input).lists('section')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only lists with the key 'section' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | # section"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(0)
    expect(error.selection[:to][:column]).to eq(9)
  end
end

describe 'Expecting lists but getting a section with a field and a list' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "# section\n" +
            "\n" +
            "field: value\n" +
            "\n" +
            "list:\n" +
            "- item\n" +
            "- item"

    begin
      Enolib.parse(input).lists('section')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only lists with the key 'section' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | # section\n" +
              " *    2 | \n" +
              " *    3 | field: value\n" +
              " *    4 | \n" +
              " *    5 | list:\n" +
              " *    6 | - item\n" +
              " *    7 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(6)
    expect(error.selection[:to][:column]).to eq(6)
  end
end

describe 'Expecting lists but getting a section with subsections' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "# section\n" +
            "\n" +
            "## subsection\n" +
            "\n" +
            "field: value\n" +
            "\n" +
            "## subsection\n" +
            "\n" +
            "list:\n" +
            "- item\n" +
            "- item"

    begin
      Enolib.parse(input).lists('section')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "Only lists with the key 'section' were expected."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | # section\n" +
              " *    2 | \n" +
              " *    3 | ## subsection\n" +
              " *    4 | \n" +
              " *    5 | field: value\n" +
              " *    6 | \n" +
              " *    7 | ## subsection\n" +
              " *    8 | \n" +
              " *    9 | list:\n" +
              " *   10 | - item\n" +
              " *   11 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(10)
    expect(error.selection[:to][:column]).to eq(6)
  end
end