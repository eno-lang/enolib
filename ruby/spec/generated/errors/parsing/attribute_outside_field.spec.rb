# frozen_string_literal: true

describe 'Parsing an attribute without a field' do
  it 'raises the expected ParseError' do
    input = 'attribute = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The attribute in line 1 is not contained within a field.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end