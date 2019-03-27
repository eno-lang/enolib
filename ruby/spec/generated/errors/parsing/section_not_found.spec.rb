describe 'Copying a section that does not exist' do
  it 'raises the expected ParseError' do
    error = nil

    input = "# copy < section"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 1 the section 'section' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | # copy < section"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(0)
    expect(error.selection[:to][:column]).to eq(16)
  end
end

describe 'Copying a section whose key only exists on a field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "field: value\n" +
            "\n" +
            "# copy < field"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 3 the section 'field' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | field: value\n" +
              "      2 | \n" +
              " >    3 | # copy < field"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(2)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(2)
    expect(error.selection[:to][:column]).to eq(14)
  end
end

describe 'Copying a section whose key only exists on a fieldset' do
  it 'raises the expected ParseError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value\n" +
            "\n" +
            "# copy < fieldset"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 4 the section 'fieldset' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | entry = value\n" +
              "      3 | \n" +
              " >    4 | # copy < fieldset"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(3)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(3)
    expect(error.selection[:to][:column]).to eq(17)
  end
end

describe 'Copying a section whose key only exists on a list' do
  it 'raises the expected ParseError' do
    error = nil

    input = "list:\n" +
            "- item\n" +
            "\n" +
            "# copy < list"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 4 the section 'list' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | - item\n" +
              "      3 | \n" +
              " >    4 | # copy < list"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(3)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(3)
    expect(error.selection[:to][:column]).to eq(13)
  end
end

describe 'Copying a section whose key only exists on a multiline field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "-- multiline_field\n" +
            "value\n" +
            "-- multiline_field\n" +
            "\n" +
            "# copy < multiline_field"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 5 the section 'multiline_field' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      3 | -- multiline_field\n" +
              "      4 | \n" +
              " >    5 | # copy < multiline_field"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(4)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(4)
    expect(error.selection[:to][:column]).to eq(24)
  end
end

describe 'Copying a section whose key only exists on an empty multiline field' do
  it 'raises the expected ParseError' do
    error = nil

    input = "-- multiline_field\n" +
            "-- multiline_field\n" +
            "\n" +
            "# copy < multiline_field"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 4 the section 'multiline_field' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | -- multiline_field\n" +
              "      3 | \n" +
              " >    4 | # copy < multiline_field"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(3)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(3)
    expect(error.selection[:to][:column]).to eq(24)
  end
end

describe 'Copying a section whose key only exists on a fieldset entry' do
  it 'raises the expected ParseError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value\n" +
            "\n" +
            "# copy < entry"

    begin
      Enolib.parse(input)
    rescue => _error
      if _error.is_a?(Enolib::ParseError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ParseError)
    
    text = "In line 4 the section 'entry' should be copied, but it was not found."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "   ...\n" +
              "      2 | entry = value\n" +
              "      3 | \n" +
              " >    4 | # copy < entry"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(3)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(3)
    expect(error.selection[:to][:column]).to eq(14)
  end
end