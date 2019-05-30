# frozen_string_literal: true

describe 'Expecting sections but getting an empty element' do
  it 'raises the expected ValidationError' do
    input = 'element:'

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | element:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end