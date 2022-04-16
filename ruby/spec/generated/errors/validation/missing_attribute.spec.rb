# frozen_string_literal: true

describe 'Querying an empty field for a required but missing attribute' do
  it 'raises the expected ValidationError' do
    input = 'field:'

    begin
      Enolib.parse(input).field('field').required_attribute('attribute')
    rescue Enolib::ValidationError => error
      text = 'The attribute \'attribute\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' *    1 | field:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(6)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Querying a field with two attributes for a required but missing attribute' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "attribute = value\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').required_attribute('missing')
    rescue Enolib::ValidationError => error
      text = 'The attribute \'missing\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field:\n" \
                " ?    2 | attribute = value\n" \
                ' ?    3 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(6)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Querying a field with attributes, empty lines and comments for a required but missing attribute' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "\n" \
            "> comment\n" \
            "attribute = value\n" \
            "\n" \
            "> comment\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').required_attribute('missing')
    rescue Enolib::ValidationError => error
      text = 'The attribute \'missing\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field:\n" \
                " ?    2 | \n" \
                " ?    3 | > comment\n" \
                " ?    4 | attribute = value\n" \
                " ?    5 | \n" \
                " ?    6 | > comment\n" \
                ' ?    7 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(6)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end