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