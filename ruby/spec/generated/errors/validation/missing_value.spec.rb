# frozen_string_literal: true

describe 'Querying an attribute for a required but missing value' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            'attribute ='

    begin
      Enolib.parse(input).field('field').attribute('attribute').required_string_value
    rescue Enolib::ValidationError => error
      text = 'The attribute \'attribute\' must contain a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                ' >    2 | attribute ='
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(11)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(11)
    end
  end
end

describe 'Querying a field for a required but missing value' do
  it 'raises the expected ValidationError' do
    input = 'field:'

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'The field \'field\' must contain a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(6)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Querying a field with empty line continuations for a required but missing value' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "|\n" \
            "\n" \
            '|'

    begin
      Enolib.parse(input).field('field').required_string_value
    rescue Enolib::ValidationError => error
      text = 'The field \'field\' must contain a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | |\n" \
                " *    3 | \n" \
                ' *    4 | |'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(6)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end

describe 'Querying a field with an empty item for required values' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "- item\n" \
            '-'

    begin
      Enolib.parse(input).field('field').required_string_values
    rescue Enolib::ValidationError => error
      text = 'The field \'field\' may not contain empty items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                "      2 | - item\n" \
                ' >    3 | -'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end