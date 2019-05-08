# frozen_string_literal: true

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

describe 'Querying a field with empty line continuations for a required but missing value' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field:\n" +
            "|\n" +
            "\n" +
            "|"

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
              " >    1 | field:\n" +
              " *    2 | |\n" +
              " *    3 | \n" +
              " *    4 | |"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(6)
    expect(error.selection[:to][:line]).to eq(3)
    expect(error.selection[:to][:column]).to eq(1)
  end
end

describe 'Querying a list with an empty item for required values' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "list:\n" +
            "- item\n" +
            "-"

    begin
      Enolib.parse(input).list('list').required_string_values
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "The list 'list' may not contain empty items."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | list:\n" +
              "      2 | - item\n" +
              " >    3 | -"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(2)
    expect(error.selection[:from][:column]).to eq(1)
    expect(error.selection[:to][:line]).to eq(2)
    expect(error.selection[:to][:column]).to eq(1)
  end
end