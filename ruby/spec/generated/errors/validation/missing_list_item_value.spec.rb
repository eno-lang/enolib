# frozen_string_literal: true

describe 'Directly querying a list item for a required but missing value' do
  it 'raises the expected ValidationError' do
    input = "list:\n" \
            '-'

    begin
      Enolib.parse(input).list('list').items.first.required_string_value
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'The list \'list\' may not contain empty items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | list:\n" \
                ' >    2 | -'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end

describe 'Indirectly querying a list with empty items for required values' do
  it 'raises the expected ValidationError' do
    input = "list:\n" \
            '-'

    begin
      Enolib.parse(input).list('list').required_string_values
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'The list \'list\' may not contain empty items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | list:\n" \
                ' >    2 | -'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end