# frozen_string_literal: true

describe 'Expecting a field with a value but getting a field with an attribute' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                ' *    2 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting a field containing a value but getting a field containing three attributes with empty lines' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            ''

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | \n" \
                " *    3 | attribute = value\n" \
                " *    4 | \n" \
                " *    5 | attribute = value\n" \
                " *    6 | \n" \
                " *    7 | attribute = value\n" \
                '      8 | '
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(6)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting a field containing a value but getting a field containing two attributes with comments' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "> comment\n" \
            "attribute = value\n" \
            "\n" \
            "> comment\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | > comment\n" \
                " *    3 | attribute = value\n" \
                " *    4 | \n" \
                " *    5 | > comment\n" \
                ' *    6 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting a field containing a value but getting a field containing one item' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            '- item'

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                ' *    2 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting a field containing a value but getting a field containing three items with empty lines' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            ''

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | \n" \
                " *    3 | - item\n" \
                " *    4 | \n" \
                " *    5 | - item\n" \
                " *    6 | \n" \
                " *    7 | - item\n" \
                '      8 | '
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(6)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting a field containing a value but getting a field with two items with comments' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "> comment\n" \
            "- item\n" \
            "\n" \
            "> comment\n" \
            '- item'

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | > comment\n" \
                " *    3 | - item\n" \
                " *    4 | \n" \
                " *    5 | > comment\n" \
                ' *    6 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end