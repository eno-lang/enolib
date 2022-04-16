# frozen_string_literal: true

describe 'Directly querying an item for a required but missing value' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            '-'

    begin
      Enolib.parse(input).field('field').items.first.required_string_value
    rescue Enolib::ValidationError => error
      text = 'The field \'field\' may not contain empty items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                ' >    2 | -'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end

describe 'Indirectly querying a field with empty items for required values' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            '-'

    begin
      Enolib.parse(input).field('field').required_string_values
    rescue Enolib::ValidationError => error
      text = 'The field \'field\' may not contain empty items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                ' >    2 | -'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end